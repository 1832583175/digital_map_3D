/**
 * ============================================================
 *  从 src/config/*.js 生成后端种子数据
 * ============================================================
 *  用法：node server/scripts/build-seed.js
 *  作用：把大屏当前的本地配置（标题/KPI/城市/散点/区县）导出成
 *        server/data/dataset.seed.json，作为后端的初始数据与「恢复默认」基准。
 *  零依赖：用 Function 构造器把「export default {...}」转成表达式求值。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const CFG = (f) => path.join(ROOT, 'src', 'config', f);

/** 把 ESM 配置文件转成可求值的 JS（去掉 export default / import） */
function loadConfig(file) {
    const raw = fs.readFileSync(file, 'utf8');
    const code = raw
        .replace(/^\s*import\s.*$/gm, '')
        .replace(/export\s+default/, 'return');
    return new Function(code + '\n//# sourceURL=' + file)();
}

function main() {
    const dataset = {
        version: 1,
        updatedAt: new Date().toISOString(),
        _comment: '由 scripts/build-seed.js 从 src/config 生成；修改后可用 PUT /api/dataset 推送到大屏',
        site: loadConfig(CFG('site.js')),
        map: loadConfig(CFG('map.js')),
        cities: loadConfig(CFG('cities.js')),
        points: loadConfig(CFG('points.js')),
        districts: loadConfig(CFG('districts.js')),
    };
    const out = path.join(__dirname, '..', 'data');
    fs.mkdirSync(out, { recursive: true });
    const file = path.join(out, 'dataset.seed.json');
    fs.writeFileSync(file, JSON.stringify(dataset, null, 2));
    // 当前数据文件不存在时，同步生成
    const cur = path.join(out, 'dataset.json');
    if (!fs.existsSync(cur)) fs.writeFileSync(cur, JSON.stringify(dataset, null, 2));
    console.log('[seed] 已生成', file);
    console.log('       site.kpi=%d 项  cities=%d 条  scatter=%d  monitor=%d',
        dataset.site.kpi.length, dataset.cities.length,
        (dataset.points.scatter || []).length, (dataset.points.monitor || []).length);
}

main();
