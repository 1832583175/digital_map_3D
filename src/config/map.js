/**
 * 三维地图的投影与取景参数
 *
 * 换省份时最常改的就是这里：
 *  - projectionCenter / projectionScale 决定地图在画面里的位置和大小
 *  - flyLineCenter 是飞线汇聚点（一般填省会）
 *  - focusLabel 是地图中央的大字标签
 *  - geojson 指向 public 下的边界数据文件
 */
export default {
    /** 墨卡托投影中心 [经度, 纬度] */
    projectionCenter: [84.946334, 42.188608],
    /** 投影缩放：数值越大，地图越大 */
    projectionScale: 38,
    /** 飞线汇聚点（乌鲁木齐） */
    flyLineCenter: [87.617733, 43.792818],
    /** 地图中央大字标签 */
    focusLabel: {
        name: '新疆维吾尔自治区',
        enName: 'XINJIANG UYGUR AUTONOMOUS REGION',
        center: [84.946334, 36.115],
    },
    /**
     * 地图边界数据（相对 public 目录）
     *
     * 文件名一律用英文：中文文件名在 COS / CDN 上容易出现路径编码不一致导致 404，
     * 部署到对象存储时是常见坑，所以这里统一英文。
     */
    geojson: {
        china: 'assets/json/china.json',
        prefectures: 'assets/json/xj-prefectures.json',
        outline: 'assets/json/xj-outline.json',
    },
}
