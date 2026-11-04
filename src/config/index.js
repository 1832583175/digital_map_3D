/**
 * 业务配置汇总入口
 *
 * 二开时 90% 的改动都在这个目录里：
 *   site.js       标题 / 副标题 / 顶部指标
 *   map.js        投影参数 / 飞线中心 / 中央标签 / geojson 路径
 *   cities.js     地图柱状图数据
 *   points.js     散点与信息点
 *   districts.js  左下角区县柱状图
 */
import site from './site.js'
import map from './map.js'
import cities from './cities.js'
import points from './points.js'
import districts from './districts.js'
import performance from './performance.js'

export default { site, map, cities, points, districts, performance }
