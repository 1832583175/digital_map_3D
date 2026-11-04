/**
 * 左右卡片「悬浮聚焦」交互
 * 全局唯一焦点：指针在哪个卡片范围内，就只有它亮起，其余全部压暗。
 */
const PARENT_TILT = 6;
const DIM = 0.34;
const HIT_MARGIN = 6;

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
    if (!cards.length) return () => {};

    cards.forEach((card) => {
        if (card.dataset.fxBound === '1') return;
        card.dataset.fxBound = '1';
        injectFx(card);
    });

    let focused = null;
    let frame = 0;

    // 命中判定：当前聚焦的卡片用它「变形前」的矩形，其余用实时矩形
    const hitTest = (x, y) => {
        for (const card of cards) {
            const r =
                card === focused && card.__restRect ? card.__restRect : card.getBoundingClientRect();
            const m = card === focused ? HIT_MARGIN : 0;
            if (x >= r.left - m && x <= r.right + m && y >= r.top - m && y <= r.bottom + m) return card;
        }
        return null;
    };

    const focusCard = (card) => {
        if (card === focused) return;
        const prev = focused;
        focused = card;

        // 除了目标卡片，其余一律压暗；目标为空则全部恢复
        cards.forEach((c) => {
            if (c === card) return;
            gsap.to(c, {
                opacity: card ? DIM : 1,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        });

        if (prev) {
            prev.classList.remove('is-focus');
            prev.__restRect = null;
            gsap.to(prev, {
                x: 0,
                z: 0,
                scale: 1,
                rotationY: 0,
                duration: 0.52,
                ease: 'power2.out',
                overwrite: 'auto',
                onComplete: () => gsap.set(prev, { zIndex: 4 }),
            });
        }

        if (card) {
            const isLeft = !!card.closest('.left-wrap');
            card.__restRect = card.getBoundingClientRect();
            gsap.killTweensOf(card);
            // 关键：新卡片可能还停留在「被上一张压暗」的状态，先恢复亮度
            gsap.to(card, { opacity: 1, duration: 0.3, overwrite: 'auto' });
            card.classList.add('is-focus');
            gsap.set(card, { zIndex: 30 });
            gsap.to(card, {
                x: isLeft ? 30 : -30,
                z: isLeft ? 72 : 115,
                scale: 1.02,
                rotationY: isLeft ? -PARENT_TILT : PARENT_TILT,
                duration: 0.62,
                ease: 'power3.out',
                overwrite: 'auto',
            });
        }
    };

    const onPointerMove = (e) => {
        const x = e.clientX;
        const y = e.clientY;
        if (frame) return;
        frame = requestAnimationFrame(() => {
            frame = 0;
            focusCard(hitTest(x, y));
        });
    };

    const onPointerDown = (e) => {
        if (e.pointerType === 'touch') focusCard(hitTest(e.clientX, e.clientY));
    };

    const onResize = () => {
        cards.forEach((c) => {
            c.__restRect = null;
        });
        if (focused) focused.__restRect = focused.getBoundingClientRect();
    };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
        cancelAnimationFrame(frame);
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('resize', onResize);
        cards.forEach((c) => {
            c.classList.remove('is-focus');
            c.__restRect = null;
            delete c.dataset.fxBound;
        });
    };
}
