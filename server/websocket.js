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
var redNoteScript = undefined;
websocket.init = function () {
    if (!ws) {
        let ws = new WebSocket(`ws://192.168.1.212:8080/${md5(uuid)}/${appId}/${appkey}`);
        // let ws = new WebSocket('ws://127.0.0.1:8111/0ed64b702ad7a24b4dadb370fa3adebf/1234567890/dsajdioasjdoapsdjopa');

        ws
            .on(WebSocket.EVENT_OPEN, (res, ws) => {
                console.log('WebSocket 已连接');
            })
            .on(WebSocket.EVENT_MESSAGE, (message, ws) => {
                console.log('接收到消息');
                // if (message instanceof okio.ByteString) {
                //     console.log(`消息类型: ByteString`);
                // } else if (typeof message === 'string') {
                //     console.log(`消息类型: String`);
                // } else {
                //     throw TypeError('Should never happen');
                // }
            })
            .on(WebSocket.EVENT_TEXT, (text, ws) => {
                console.info('接收到文本消息:');
                console.info(`text: ${text}`);
                if(!redNoteScript){
                    redNoteScript = engines.execScript("hello world", text);
                    console.log(redNoteScript.getEngine());
                }
            })
            .on(WebSocket.EVENT_BYTES, (bytes, ws) => {
                console.info('接收到字节数组消息:');
                console.info(`utf8: ${bytes.utf8()}`);
                console.info(`base64: ${bytes.base64()}`);
                console.info(`md5: ${bytes.md5()}`);
                console.info(`hex: ${bytes.hex()}`);
            })
            .on(WebSocket.EVENT_CLOSING, (code, reason, ws) => {
                console.log('WebSocket 关闭中');
            })
            .on(WebSocket.EVENT_CLOSED, (code, reason, ws) => {
                console.log('WebSocket 已关闭');
                console.log(`code: ${code}`);
                if (reason) console.log(`reason: ${reason}`);
            })
            .on(WebSocket.EVENT_FAILURE, (err, res, ws) => {
                console.error('WebSocket 连接失败',err,res,ws);
                console.error(err);
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
