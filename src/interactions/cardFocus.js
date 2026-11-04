/**
 * ============================================================
 *  左右卡片「悬浮聚焦」交互
 * ============================================================
 *  效果：
 *    鼠标进入卡片 → 卡片从侧倾/后退状态沿 Z 轴前移、转正（抵消父容器
 *    的 rotateY 侧倾）、放大，同时点亮四角光标 + 扫描光 + 边缘霓虹，
 *    同侧其余卡片压暗，形成「抽出来单独看」的层次。
 *
 *  设计要点：
 *    1. 位移/旋转/缩放交给 GSAP（GPU 合成，60fps 顺滑，且不与入场动画抢
 *       属性）；纯装饰的光效用 CSS 动画，零 JS 开销。
 *    2. 入场动画结束前（约 3.2s）不绑定，避免和 translate(-150%) → 0 的
 *       入场补间打架。
 *    3. 所有变换只作用于卡片自身，不影响 flex 布局，不会把别的卡片挤变形。
 */
const PARENT_TILT = 6; // .left-wrap-3d / .right-wrap-3d 的 rotateY 角度

/** 注入科技感装饰层（四角光标 + 边缘霓虹 + 扫描光） */
function injectFx(card) {
    if (card.querySelector(':scope > .card-fx')) return;
    const fx = document.createElement('span');
    fx.className = 'card-fx';
    fx.setAttribute('aria-hidden', 'true');
    fx.innerHTML =
        '<i class="fx-edge"></i>' +
        '<i class="fx-corner is-tl"></i>' +
        '<i class="fx-corner is-tr"></i>' +
        '<i class="fx-corner is-bl"></i>' +
        '<i class="fx-corner is-br"></i>' +
        '<i class="fx-scan"></i>';
    card.appendChild(fx);
}

/**
 * @param {object} gsap  GSAP 实例（由页面从 engine.js 传入，避免重复打包）
 * @returns {Function} 解绑函数
 */
export function setupCardFocus(gsap) {
    if (!gsap) return () => {};
    const cards = gsap.utils.toArray('.left-card, .right-card');
    const cleanups = [];

    cards.forEach((card) => {
        if (card.dataset.fxBound === '1') return;
        card.dataset.fxBound = '1';
        injectFx(card);

        const isLeft = !!card.closest('.left-wrap');
        // 抵消父容器的侧倾，让卡片在悬浮时正对镜头
        const frontAngle = isLeft ? -PARENT_TILT : PARENT_TILT;
        const inward = isLeft ? 30 : -30; // 朝画面中心轻推，视觉上「探出来」
        // 两侧父容器 perspective 不同（500 / 800），按比例给 z 才能得到一致的弹出幅度
        const popZ = isLeft ? 72 : 115;
        const siblings = [...(card.parentElement?.children || [])].filter(
            (el) => el !== card && (el.classList.contains('left-card') || el.classList.contains('right-card'))
        );
        let active = false;

        const enter = () => {
            if (active) return;
            active = true;
            gsap.killTweensOf(card);
            card.classList.add('is-focus');
            gsap.set(card, { zIndex: 30 });
            gsap.to(card, {
                x: inward,
                z: popZ,
                scale: 1.02,
                rotationY: frontAngle,
                duration: 0.62,
                ease: 'power3.out',
                overwrite: 'auto',
            });
            if (siblings.length) {
                gsap.to(siblings, {
                    opacity: 0.34,
                    duration: 0.45,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            }
        };

        const leave = () => {
            if (!active) return;
            active = false;
            card.classList.remove('is-focus');
            gsap.to(card, {
                x: 0,
                z: 0,
                scale: 1,
                rotationY: 0,
                duration: 0.52,
                ease: 'power2.out',
                overwrite: 'auto',
                onComplete: () => gsap.set(card, { zIndex: 4 }),
            });
            if (siblings.length) {
                gsap.to(siblings, { opacity: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
            }
        };

        card.addEventListener('mouseenter', enter);
        card.addEventListener('mouseleave', leave);
        // 触屏：点按也能触发同样的聚焦态
        card.addEventListener('touchstart', enter, { passive: true });
        card.addEventListener('touchend', leave, { passive: true });

        cleanups.push(() => {
            card.removeEventListener('mouseenter', enter);
            card.removeEventListener('mouseleave', leave);
            card.removeEventListener('touchstart', enter);
            card.removeEventListener('touchend', leave);
            card.classList.remove('is-focus');
            delete card.dataset.fxBound;
        });
    });

    return () => cleanups.forEach((fn) => fn());
}
