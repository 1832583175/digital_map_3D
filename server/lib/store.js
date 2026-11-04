/**
 * ============================================================
 *  数据仓库：dataset 的读取 / 校验 / 合并 / 持久化
 * ============================================================
 *  数据文件：server/data/dataset.json（首次启动自动从 dataset.seed.json 复制）
 *  结构与大屏 src/config/ 完全对应：
 *    site      标题 / 副标题 / 顶部 KPI
 *    map       投影参数 / 飞线中心 / 中央大字 / geojson 路径
 *    cities    三维柱状图数据
 *    points    散点 + 信息监测点
 *    districts 左下角区县分类
 */
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'dataset.json');
const SEED_FILE = path.join(__dirname, '..', 'data', 'dataset.seed.json');

const SECTIONS = ['site', 'map', 'cities', 'points', 'districts'];

/* ---------------- 工具 ---------------- */

function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isNumArr(v, n) {
    return Array.isArray(v) && v.length === n && v.every((x) => typeof x === 'number' && isFinite(x));
}

function deepClone(v) {
    return JSON.parse(JSON.stringify(v));
}

/** 深合并：src 的值覆盖 dst；数组整体替换（不做按下标合并，语义更直观） */
function deepMerge(dst, src) {
    if (!isPlainObject(src)) return src;
    for (const k of Object.keys(src)) {
        if (isPlainObject(src[k]) && isPlainObject(dst[k])) deepMerge(dst[k], src[k]);
        else dst[k] = deepClone(src[k]);
    }
    return dst;
}

/* ---------------- 校验 ---------------- */

/**
 * 校验一个 section。返回 null 表示通过，否则返回错误信息（用于 400 响应）。
 * 校验保持宽松：只挡住会让大屏白屏/报错的结构错误。
 */
function validateSection(name, value) {
    switch (name) {
        case 'site': {
            if (!isPlainObject(value)) return 'site 必须是对象';
            if (value.title !== undefined && typeof value.title !== 'string') return 'site.title 必须是字符串';
            if (value.subTitle !== undefined && typeof value.subTitle !== 'string') return 'site.subTitle 必须是字符串';
            if (value.kpi !== undefined) {
                if (!Array.isArray(value.kpi)) return 'site.kpi 必须是数组';
                for (const k of value.kpi) {
                    if (!isPlainObject(k)) return 'site.kpi 每项必须是对象 {icon,zh,en,value,unit}';
                    if (typeof k.value !== 'number') return `site.kpi "${k.zh || '?'}" 的 value 必须是数字`;
                }
            }
            return null;
        }
        case 'map': {
            if (!isPlainObject(value)) return 'map 必须是对象';
            if (value.projectionCenter !== undefined && !isNumArr(value.projectionCenter, 2))
                return 'map.projectionCenter 必须是 [经度, 纬度] 数字数组';
            if (value.flyLineCenter !== undefined && !isNumArr(value.flyLineCenter, 2))
                return 'map.flyLineCenter 必须是 [经度, 纬度] 数字数组';
            if (value.projectionScale !== undefined && typeof value.projectionScale !== 'number')
                return 'map.projectionScale 必须是数字';
            return null;
        }
        case 'cities': {
            if (!Array.isArray(value)) return 'cities 必须是数组';
            for (const c of value) {
                if (!isPlainObject(c)) return 'cities 每项必须是对象';
                if (typeof c.name !== 'string') return 'cities 每项必须有 name（需与 geojson 地名一致）';
                if (typeof c.value !== 'number') return `cities "${c.name}" 的 value 必须是数字`;
            }
            return null;
        }
        case 'points': {
            if (!isPlainObject(value)) return 'points 必须是对象 {scatter, monitor}';
            for (const key of ['scatter', 'monitor']) {
                if (value[key] !== undefined && !Array.isArray(value[key])) return `points.${key} 必须是数组`;
            }
            return null;
        }
        case 'districts': {
            if (!Array.isArray(value) || value.some((s) => typeof s !== 'string'))
                return 'districts 必须是字符串数组';
            return null;
        }
        default:
            return `未知字段 ${name}（可用字段：${SECTIONS.join(', ')}）`;
    }
}

/* ---------------- 仓库 ---------------- */

function ensureDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
        fs.copyFileSync(SEED_FILE, DATA_FILE);
        console.log('[store] 首次启动，已从种子生成 data/dataset.json');
    }
}

function load() {
    ensureDataFile();
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        console.error('[store] dataset.json 解析失败，已回退到种子数据：', e.message);
        const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
        save(seed, false);
        return seed;
    }
}

/** 原子化落盘（先写临时文件再改名，断电也不会写坏数据） */
function save(dataset, touch = true) {
    if (touch) dataset.updatedAt = new Date().toISOString();
    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(dataset, null, 2));
    fs.renameSync(tmp, DATA_FILE);
    return dataset;
}

function snapshot() {
    return load();
}

module.exports = { SECTIONS, deepClone, deepMerge, validateSection, load, save, snapshot };
