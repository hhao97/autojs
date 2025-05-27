const handle = require("./handle/handle");

var websocket = {
    state: 0,
    lastTime: new Date().getTime(),
    session: null,
    sentBytes: 0,
    receivedBytes: 0,
};

function md5(string) {
    var res = java.math.BigInteger(1, java.security.MessageDigest.getInstance("MD5").digest(java.lang.String(string).getBytes())).toString(16);
    while (res.length < 32) res = "0" + res;
    return res;
}
var uuid = device.fingerprint + device.height + device.width;
var appId = "1234567890";
var appkey = "dsajdioasjdoapsdjopa";

websocket.init = function () {
    if (!websocket.session) {
        websocket.session = new WebSocket(`ws://192.168.1.212:8081/${md5(uuid)}/${appId}/${appkey}`);
        websocket.session
            .on(WebSocket.EVENT_OPEN, (res, ws) => {
                websocket.state = 1;
                websocket.lastTime = new Date().getTime();;
            })
            .on(WebSocket.EVENT_MESSAGE, (message, ws) => {
            })
            .on(WebSocket.EVENT_TEXT, (text, ws) => {

                websocket.state = 1;
                websocket.lastTime = new Date().getTime();;
                websocket.receivedBytes += java.lang.String(text).getBytes().length;
                handle.eventt(websocket, text)
            })
            .on(WebSocket.EVENT_BYTES, (bytes, ws) => {
                console.info('接收到字节数组消息:');
            })
            .on(WebSocket.EVENT_CLOSING, (code, reason, ws) => {
                console.log('WebSocket 关闭');
                close();
            })
            .on(WebSocket.EVENT_CLOSED, (code, reason, ws) => {
                console.log('WebSocket 已关闭');
                close();
                console.log(`code: ${code}`);
                if (reason) console.log(`reason: ${reason}`);
            })
            .on(WebSocket.EVENT_FAILURE, (err, res, ws) => {
                console.error('WebSocket 连接失败', err, res, ws);
                close();
            });
    }

}

function close() {
    websocket.state = 0;
    if (websocket.session != null) {
        websocket.session.close(WebSocket.CODE_CLOSE_NORMAL, '超时关闭');
        websocket.session = null;
    }

    console.log("关闭 ws 连接");
}

websocket.getInstance = function () {
    let now = new Date().getTime();
    let gap = now - websocket.lastTime;
    // console.log(`心跳检测 是否登录${websocket.state} 间隔${gap} 僵尸${gap > 60 * 1000} 发送${(websocket.sentBytes).toFixed(2)} 接受${(websocket.receivedBytes).toFixed(2)}`);

    // 如果超过一分钟没有收到消息，则认为连接断开
    if (gap > 60 * 1000) {
        close();
    }

    if (websocket.state == 0) {
        websocket.init();
        console.log("新建 ws 连接");
    }

    return websocket;
};

module.exports = websocket;
