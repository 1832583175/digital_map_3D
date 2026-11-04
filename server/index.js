/**
 * ============================================================
 *  新疆数据可视化大屏 · 独立数据后端
 * ============================================================
 *  零依赖：node index.js 即可运行（无需 npm install）
 *
 *  启动：
 *      node server/index.js
 *      PORT=9000 API_TOKEN=mysecret node server/index.js
 *
 *  页面：
 *      http://localhost:8787/          数据控制台（网页可视化编辑 + 一键推送）
 *      http://localhost:8787/dashboard 大屏静态页（若已 npm run build）
 *
 *  接口：
 *      GET    /api/health           健康检查（含在线大屏数量）
 *      GET    /api/dataset          拉取全部数据
 *      PUT    /api/dataset          全量替换（推送后大屏自动更新）
 *      PATCH  /api/dataset          局部更新（只传要改的字段）
 *      POST   /api/dataset/reset    恢复为种子数据
 *      POST   /api/kpi              高频推送顶部指标（大屏原地数字滚动，不刷新）
 *      GET    /api/stream           实时事件流（SSE）
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const store = require('./lib/store');
const { createHub } = require('./lib/sse');

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';
const TOKEN = process.env.API_TOKEN || '';
const DIST_DIR = path.join(__dirname, '..', 'dist');
const ADMIN_FILE = path.join(__dirname, 'public', 'index.html');

const hub = createHub();
const startedAt = Date.now();

/* ---------------- 基础工具 ---------------- */

function isLocal(req) {
    const addr = req.socket.remoteAddress || '';
    return ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(addr);
}

function json(res, code, data) {
    const body = JSON.stringify(data, null, 2);
    res.writeHead(code, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
    });
    res.end(body);
}

function readBody(req, limit = 5 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
        let size = 0;
        const chunks = [];
        req.on('data', (c) => {
            size += c.length;
            if (size > limit) {
                reject(new Error('请求体超过 5MB 限制'));
                req.destroy();
                return;
            }
            chunks.push(c);
        });
        req.on('end', () => {
            const raw = Buffer.concat(chunks).toString('utf8').trim();
            if (!raw) return resolve({});
            try {
                resolve(JSON.parse(raw));
            } catch (e) {
                reject(new Error('请求体不是合法 JSON：' + e.message));
            }
        });
        req.on('error', reject);
    });
}

/** 写接口鉴权：设了 API_TOKEN 则校验 token；未设则仅允许本机调用 */
function checkWriteAuth(req, res) {
    if (TOKEN) {
        if (req.headers['x-api-token'] === TOKEN) return true;
        json(res, 401, { ok: false, error: '需要请求头 x-api-token（启动服务时用 API_TOKEN 环境变量设置）' });
        return false;
    }
    if (isLocal(req)) return true;
    json(res, 403, {
        ok: false,
        error: '为安全起见，未设置 API_TOKEN 时只允许本机写入。远程写入请用 API_TOKEN=xxx 启动服务并携带 x-api-token 头',
    });
    return false;
}

/* ---------------- 静态文件 ---------------- */

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.wasm': 'application/wasm',
    '.ico': 'image/x-icon',
};

function serveFile(res, file) {
    fs.readFile(file, (err, buf) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not Found');
            return;
        }
        res.writeHead(200, {
            'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
            'Cache-Control': file.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=86400' : 'no-cache',
        });
        res.end(buf);
    });
}

/** 大屏静态页（/dashboard/...），不存在 dist 时给出提示 */
function serveDist(req, res, pathname) {
    const rel = pathname.replace(/^\/dashboard\/?/, '') || 'index.html';
    const file = path.normalize(path.join(DIST_DIR, rel));
    if (!file.startsWith(DIST_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    if (!fs.existsSync(DIST_DIR)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('尚未构建：请先在大屏工程目录执行 npm run build');
        return;
    }
    serveFile(res, file);
}

/* ---------------- 请求处理 ---------------- */

async function handleApi(req, res, pathname) {
    const method = req.method;

    /* ---- 健康检查 ---- */
    if (method === 'GET' && pathname === '/api/health') {
        const d = store.snapshot();
        return json(res, 200, {
            ok: true,
            service: 'xinjiang-dashboard-api',
            uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
            dashboardClients: hub.size,
            updatedAt: d.updatedAt,
            sections: Object.keys(d).filter((k) => !k.startsWith('_')),
        });
    }

    /* ---- 实时事件流 ---- */
    if (method === 'GET' && pathname === '/api/stream') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            'Access-Control-Allow-Origin': '*',
        });
        res.write(': connected\n\n');
        const n = hub.add(res);
        hub.send(res, 'hello', { clients: n, serverTime: Date.now() });
        console.log(`[sse] 大屏接入（当前 ${n} 个）`);
        return;
    }

    /* ---- 读取 ---- */
    if (method === 'GET' && pathname === '/api/dataset') {
        return json(res, 200, store.snapshot());
    }

    /* ---- 写入（PUT 全量 / PATCH 局部） ---- */
    if ((method === 'PUT' || method === 'PATCH') && pathname === '/api/dataset') {
        if (!checkWriteAuth(req, res)) return;
        let body;
        try {
            body = await readBody(req);
        } catch (e) {
            return json(res, 400, { ok: false, error: e.message });
        }
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return json(res, 400, { ok: false, error: '请求体必须是 JSON 对象' });
        }
        const unknown = Object.keys(body).filter((k) => !store.SECTIONS.includes(k) && !k.startsWith('_'));
        if (unknown.length) {
            return json(res, 400, { ok: false, error: `未知字段：${unknown.join(', ')}`, hint: `可用字段：${store.SECTIONS.join(', ')}` });
        }
        for (const key of Object.keys(body)) {
            if (key.startsWith('_')) continue;
            const err = store.validateSection(key, body[key]);
            if (err) return json(res, 400, { ok: false, error: err });
        }
        const current = store.snapshot();
        if (method === 'PUT') {
            // 全量替换：未提供的 section 保留原值，避免误删
            for (const key of store.SECTIONS) {
                if (body[key] !== undefined) current[key] = store.deepClone(body[key]);
            }
        } else {
            store.deepMerge(current, body);
        }
        store.save(current);
        hub.broadcast('dataset', { dataset: current, by: isLocal(req) ? '本机' : '远程' });
        return json(res, 200, { ok: true, message: '已保存并推送到大屏', updatedAt: current.updatedAt });
    }

    /* ---- 恢复默认 ---- */
    if (method === 'POST' && pathname === '/api/dataset/reset') {
        if (!checkWriteAuth(req, res)) return;
        const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'dataset.seed.json'), 'utf8'));
        store.save(seed);
        hub.broadcast('dataset', { dataset: seed, by: 'reset' });
        return json(res, 200, { ok: true, message: '已恢复为种子数据并推送' });
    }

    /* ---- 高频 KPI 推送 ---- */
    if (method === 'POST' && pathname === '/api/kpi') {
        if (!checkWriteAuth(req, res)) return;
        let body;
        try {
            body = await readBody(req);
        } catch (e) {
            return json(res, 400, { ok: false, error: e.message });
        }
        const current = store.snapshot();
        const kpi = current.site && current.site.kpi ? current.site.kpi : [];

        // 支持两种写法：
        //   { index: 0, value: 21000 }              按下标改一个
        //   { values: [21000, 2600] }               按顺序改多个
        //   { zh: '2024年生产总值', value: 21000 }   按标题匹配
        const updates = [];
        if (Array.isArray(body.values)) {
            body.values.forEach((v, i) => kpi[i] && updates.push([i, v]));
        } else if (typeof body.index === 'number') {
            updates.push([body.index, body.value]);
        } else if (body.zh) {
            const i = kpi.findIndex((k) => k.zh === body.zh);
            if (i >= 0) updates.push([i, body.value]);
        } else {
            return json(res, 400, { ok: false, error: '请传 { index, value } 或 { values: [...] } 或 { zh, value }' });
        }
        for (const [i, v] of updates) {
            if (typeof v !== 'number' || !isFinite(v)) {
                return json(res, 400, { ok: false, error: `第 ${i} 项 value 必须是数字` });
            }
            kpi[i].value = v;
        }
        store.save(current);
        hub.broadcast('kpi', { kpi: store.deepClone(kpi) });
        return json(res, 200, { ok: true, updated: updates.map(([i, v]) => ({ index: i, value: v })) });
    }

    json(res, 404, { ok: false, error: '接口不存在', docs: '见 server/README.md' });
}

const server = http.createServer(async (req, res) => {
    const u = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(u.pathname);

    // CORS：允许大屏页面跨域读取
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-token');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    try {
        if (pathname.startsWith('/api/')) return await handleApi(req, res, pathname);
        if (pathname === '/' || pathname === '/admin' || pathname === '/admin/') return serveFile(res, ADMIN_FILE);
        if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) return serveDist(req, res, pathname);
        if (pathname === '/favicon.ico') return res.writeHead(204).end();
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found。数据控制台：/ ；大屏：/dashboard/ ；接口：/api/health');
    } catch (e) {
        console.error('[server] 未捕获错误：', e);
        if (!res.headersSent) json(res, 500, { ok: false, error: e.message });
    }
});

server.listen(PORT, HOST, () => {
    const d = store.snapshot();
    console.log('');
    console.log('  ┌──────────────────────────────────────────────────────┐');
    console.log('  │  新疆数据可视化大屏 · 数据后端已启动                       │');
    console.log('  ├──────────────────────────────────────────────────────┤');
    console.log(`  │  数据控制台   http://localhost:${PORT}/`);
    console.log(`  │  大屏静态页   http://localhost:${PORT}/dashboard/  (需先 build)`);
    console.log(`  │  健康检查     http://localhost:${PORT}/api/health`);
    console.log(`  │  实时事件流   http://localhost:${PORT}/api/stream`);
    console.log(`  │  在线大屏数   ${hub.size}`);
    console.log(`  │  数据更新于   ${d.updatedAt}`);
    console.log(TOKEN ? '  │  写入鉴权     已开启（x-api-token）' : '  │  写入鉴权     未开启（仅允许本机写入）');
    console.log('  └──────────────────────────────────────────────────────┘');
    console.log('');
});

process.on('SIGINT', () => {
    console.log('\n[server] 正在退出…');
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 1500).unref();
});
