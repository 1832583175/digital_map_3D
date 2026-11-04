/**
 * 左右卡片「悬浮聚焦」交互
 * 位移/缩放/旋转交给 GSAP；光效（四角/霓虹/扫描）在 cards.css。
 */
const PARENT_TILT = 6;

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

export function setupCardFocus(gsap) {
    if (!gsap) return () => {};
    const cards = gsap.utils.toArray('.left-card, .right-card');
    const cleanups = [];

    cards.forEach((card) => {
        if (card.dataset.fxBound === '1') return;
        card.dataset.fxBound = '1';
        injectFx(card);

        const isLeft = !!card.closest('.left-wrap');
        const frontAngle = isLeft ? -PARENT_TILT : PARENT_TILT;
        const inward = isLeft ? 30 : -30;
        const popZ = isLeft ? 72 : 115;
        const siblings = [...(card.parentElement?.children || [])].filter(
            (el) => el !== card && (el.classList.contains('left-card') || el.classList.contains('right-card'))
        );

        let active = false;
        let restRect = null;
        let leaveTimer = null;

        // 指针是否还在「卡片未变形前的原始范围」内（留 2px 容差）
        const insideRest = (e) => {
            if (!restRect) return false;
            const M = 2;
            return (
                e.clientX >= restRect.left - M &&
                e.clientX <= restRect.right + M &&
                e.clientY >= restRect.top - M &&
                e.clientY <= restRect.bottom + M
            );
        };

        const onDocMove = (e) => {
            if (active && !insideRest(e)) doLeave();
        };

        const doLeave = () => {
            if (!active) return;
            active = false;
            restRect = null;
            document.removeEventListener('pointermove', onDocMove);
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

        const enter = () => {
            clearTimeout(leaveTimer);
            if (active) return;
            active = true;
            // 关键：在变形之前记下原始范围
            restRect = card.getBoundingClientRect();
            document.addEventListener('pointermove', onDocMove, { passive: true });

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
                gsap.to(siblings, { opacity: 0.34, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
            }
        };

        // mouseleave 仅作为兜底（指针瞬间飞出、没产生 pointermove 的情况）
        const onLeave = () => {
            clearTimeout(leaveTimer);
            leaveTimer = setTimeout(() => {
                if (!restRect) return;
                doLeave();
            }, 120);
        };

        card.addEventListener('mouseenter', enter);
        card.addEventListener('mouseleave', onLeave);
        card.addEventListener('touchstart', enter, { passive: true });
        card.addEventListener('touchend', doLeave, { passive: true });

        cleanups.push(() => {
            clearTimeout(leaveTimer);
            document.removeEventListener('pointermove', onDocMove);
            card.removeEventListener('mouseenter', enter);
            card.removeEventListener('mouseleave', onLeave);
            card.removeEventListener('touchstart', enter);
            card.removeEventListener('touchend', doLeave);
            card.classList.remove('is-focus');
            delete card.dataset.fxBound;
        });
    });

    return () => cleanups.forEach((fn) => fn());
}
