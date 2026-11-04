/**
 * 渲染性能开关
 *
 * 大屏是实时 WebGL 渲染，吃的是显卡。画质和流畅度在这里权衡：
 *
 *  pixelRatio  渲染分辨率倍率
 *      2   —— 原版默认。1080p 窗口实际渲染 3840×2160（约 830 万像素），最清晰也最吃显卡
 *      1.5 —— 折中，约 470 万像素
 *      1   —— 和窗口 1:1 渲染（约 207 万像素），帧率最高，肉眼几乎看不出差别
 *
 *  antialias  是否开多重采样抗锯齿。关掉能再省一点，但也可能出现锯齿边；
 *             搭配 pixelRatio=1 时建议保持 true。
 *
 *  显卡较弱的笔记本 / 核显：pixelRatio 设 1，antialias 设 true。
 *  要演示截图、追求画质：pixelRatio 设 1.5~2。
 */
export default {
    pixelRatio: 1,
    antialias: true,
}
