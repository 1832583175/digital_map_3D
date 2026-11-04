/**
 * ============================================================
 *  SSE 推送中心（Server-Sent Events）
 * ============================================================
 *  为什么用 SSE 而不是 WebSocket：
 *    - 大屏只需要「服务端 → 页面」单向推送，SSE 完全够用
 *    - 浏览器原生支持（EventSource），断线自动重连，零依赖
 *    - 不需要引入 ws 库，整个后端保持 npm install -free
 *
 *  事件约定：
 *    hello     连接建立（只带状态，不带数据，避免客户端循环刷新）
 *    dataset   结构化数据变更（data 里带完整 dataset，客户端刷新后生效）
 *    kpi       仅顶部指标数值变更（客户端原地做数字滚动，不刷新）
 *    ping      心跳
 */
function createHub() {
    const clients = new Set();

    function add(res) {
        clients.add(res);
        res.on('close', () => clients.delete(res));
        return clients.size;
    }

    function send(res, event, data) {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    }

    function broadcast(event, data) {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        for (const res of clients) {
            try {
                res.write(payload);
            } catch (e) {
                clients.delete(res);
            }
        }
        if (clients.size) console.log(`[sse] 已向 ${clients.size} 个客户端推送 ${event}`);
    }

    // 心跳：防止代理/负载均衡掐断空闲连接
    const timer = setInterval(() => {
        for (const res of clients) {
            try {
                res.write(': ping\n\n');
            } catch (e) {
                clients.delete(res);
            }
        }
    }, 25000);
    timer.unref?.();

    return {
        add,
        send,
        broadcast,
        get size() {
            return clients.size;
        },
    };
}

module.exports = { createHub };
