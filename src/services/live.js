/**
 * ============================================================
 *  后端数据接入（拉取 + 实时推送）
 * ============================================================
 *  数据流：
 *
 *   后端(8787) ──GET /api/dataset──▶ bootstrap()：挂载前拉一次，
 *                                    深合并进 cfg —— 首屏渲染即用后端数据
 *   后端 ──SSE /api/stream──▶ connectLive()：
 *        ├─ kpi     事件 → 顶部指标原地数字滚动（不刷新，适合高频推送）
 *        └─ dataset 事件 → 配置数据变了 → 短暂遮罩后自动刷新页面
 *                          （城市柱/散点/标题都要重建三维场景，整页刷新最稳）
 *
 *  所有请求都静默失败：后端没开 = 纯本地配置，大屏照常跑。
 */
import cfg from '../config/index.js';
import apiConf from '../config/api.js';

const STORAGE_KEY = 'dashboard.apiBase';

let currentBase = '';
let eventSource = null;
let lastReloadAt = 0;

/* ---------------- 后端地址解析 ---------------- */

export function resolveApiBase() {
    if (currentBase) return currentBase;
    // 0) 运行时注入（控制台里敲 window.__API_BASE__='http://x:8787' 后刷新）
    if (typeof window !== 'undefined' && window.__API_BASE__) {
        currentBase = String(window.__API_BASE__).replace(/\/+$/, '');
        return currentBase;
    }
    // 1) URL 参数 ?api=（写一次就记住）
    if (typeof window !== 'undefined' && window.location) {
        const q = new URLSearchParams(window.location.search).get('api');
        if (q) {
            if (q === '0' || q === 'off') {
                localStorage.setItem(STORAGE_KEY, '');
                currentBase = '';
            } else {
                localStorage.setItem(STORAGE_KEY, q.replace(/\/+$/, ''));
                currentBase = q.replace(/\/+$/, '');
            }
            return currentBase;
        }
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
            currentBase = saved;
            return currentBase;
        }
    }
    // 2) 构建期环境变量
    const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_URL : '';
    if (env) {
        currentBase = String(env).replace(/\/+$/, '');
        return currentBase;
    }
    // 3) 本地开发默认：页面不在 localhost（已部署成静态站）则不连
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    if (['localhost', '127.0.0.1', '::1'].includes(host)) currentBase = apiConf.defaultBase;
    else currentBase = '';
    return currentBase;
}

/* ---------------- 数据合并 ---------------- */

const MERGE_SECTIONS = ['site', 'map', 'cities', 'points', 'districts'];

function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function deepMerge(dst, src) {
    if (!isPlainObject(src)) return src;
    for (const k of Object.keys(src)) {
        if (isPlainObject(src[k]) && isPlainObject(dst[k])) deepMerge(dst[k], src[k]);
        else dst[k] = src[k];
    }
    return dst;
}

/** 把后端 dataset 合并进本地 cfg（只接受大屏认识的字段） */
export function applyDataset(dataset) {
    if (!isPlainObject(dataset)) return false;
    for (const key of MERGE_SECTIONS) {
        if (dataset[key] !== undefined) {
            if (isPlainObject(cfg[key]) && isPlainObject(dataset[key])) deepMerge(cfg[key], dataset[key]);
            else cfg[key] = dataset[key];
        }
    }
    return true;
}

/* ---------------- 启动拉取 ---------------- */

function fetchWithTimeout(url, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

/**
 * 应用挂载前调用：拉一次后端数据合并进 cfg。
 * 永远 resolve（失败也算），不阻塞大屏启动。
 */
export async function bootstrap() {
    const base = resolveApiBase();
    if (!base) {
        console.info('[live] 未配置后端，使用本地配置（src/config）');
        return;
    }
    try {
        const res = await fetchWithTimeout(`${base}/api/dataset`, apiConf.timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const dataset = await res.json();
        applyDataset(dataset);
        console.info(`[live] 已从后端加载数据：${base}（更新于 ${dataset.updatedAt || '未知'}）`);
    } catch (e) {
        console.info(`[live] 后端不可达（${e.message}），使用本地配置`);
    }
}

/* ---------------- 实时推送 ---------------- */

/** KPI 数字滚动（自绘 rAF 补间，不引 GSAP，避免把引擎打进首屏） */
function tweenText(el, to, duration = 900) {
    if (!el) return;
    const from = parseFloat((el.textContent || '0').replace(/,/g, '')) || 0;
    const start = performance.now();
    const fmt = (v) => String(Math.round(v * 100) / 100);
    function frame(now) {
        const p = Math.max(0, Math.min(1, (now - start) / duration));
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = fmt(from + (to - from) * eased);
        if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

function flashKpiCards() {
    document.querySelectorAll('.count-card').forEach((el) => {
        el.classList.add('is-flash');
        setTimeout(() => el.classList.remove('is-flash'), 1400);
    });
}

/** KPI 事件：顶部指标原地滚动 */
function handleKpiEvent(kpi) {
    if (!Array.isArray(kpi)) return;
    const cards = document.querySelectorAll('.top-count-card .count-card');
    kpi.forEach((item, i) => {
        const card = cards[i];
        if (!card) return;
        tweenText(card.querySelector('.count-card-right .value span'), item.value);
    });
    flashKpiCards();
}

/** 结构化数据变更：短暂遮罩后整页刷新（三维场景需要重建） */
function handleDatasetEvent() {
    const now = Date.now();
    if (now - lastReloadAt < 5000) return; // 防抖：连续推送只刷一次
    lastReloadAt = now;
    const mask = document.createElement('div');
    mask.className = 'dashboard-sync-mask is-visible';
    mask.textContent = '数 据 同 步 中 …';
    document.body.appendChild(mask);
    setTimeout(() => window.location.reload(), 600);
}

/** 订阅后端事件流（在应用挂载后调用） */
export function connectLive() {
    const base = resolveApiBase();
    if (!base || !apiConf.live || typeof EventSource === 'undefined') return;
    if (eventSource) eventSource.close();

    eventSource = new EventSource(`${base}/api/stream`);
    eventSource.addEventListener('kpi', (e) => {
        try {
            handleKpiEvent(JSON.parse(e.data).kpi);
        } catch (err) {
            /* 忽略格式错误 */
        }
    });
    eventSource.addEventListener('dataset', handleDatasetEvent);
    eventSource.onopen = () => console.info('[live] 实时通道已连接：', base);
    eventSource.onerror = () => {
        /* EventSource 会自动重连，这里只留个痕迹 */
        console.info('[live] 实时通道断开，自动重连中…');
    };
}

/** 手动断开（一般用不到，留给二开清理用） */
export function disconnectLive() {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
    }
}
