const handle = require("./handle/handle");

var websocket = {};
var ws = null;


function md5(string) {
    var res = java.math.BigInteger(1, java.security.MessageDigest.getInstance("MD5").digest(java.lang.String(string).getBytes())).toString(16);
    while (res.length < 32) res = "0" + res;
    return res;
}
var uuid = device.fingerprint + device.height + device.width;
var appId = "1234567890";
var appkey = "dsajdioasjdoapsdjopa";
websocket.state = 0;
websocket.lastTime= new Date();

websocket.init = function () {
    if (!ws) {
        let ws = new WebSocket(`ws://192.168.1.210:8080/${md5(uuid)}/${appId}/${appkey}`);
        // let ws = new WebSocket('ws://127.0.0.1:8111/0ed64b702ad7a24b4dadb370fa3adebf/1234567890/dsajdioasjdoapsdjopa');

        ws
            .on(WebSocket.EVENT_OPEN, (res, ws) => {
                console.log('WebSocket 已连接');
                websocket.state  = 1;
                websocket.lastTime = new Date();
            })
            .on(WebSocket.EVENT_MESSAGE, (message, ws) => {
                // console.log('接收到消息',message);
            })
            .on(WebSocket.EVENT_TEXT, (text, ws) => {
                console.info(`接收到文本消息: ${text}`);

                websocket.state  = 1;
                websocket.lastTime = new Date();

                handle.event(ws ,text)
             
            })
            .on(WebSocket.EVENT_BYTES, (bytes, ws) => {
                console.info('接收到字节数组消息:');
            })
            .on(WebSocket.EVENT_CLOSING, (code, reason, ws) => {
                console.log('WebSocket 关闭');
                websocket.state = 0;
            })
            .on(WebSocket.EVENT_CLOSED, (code, reason, ws) => {
                console.log('WebSocket 已关闭');
                websocket.state = 0;
                console.log(`code: ${code}`);
                if (reason) console.log(`reason: ${reason}`);
            })
            .on(WebSocket.EVENT_FAILURE, (err, res, ws) => {
                console.error('WebSocket 连接失败', err, res, ws);
                console.error(err);
                websocket.state = 0;
            });
    }

}

websocket.getInstance = function () {
    if (!ws) {
        websocket.init();
    }
    return ws;
};

module.exports = websocket;
