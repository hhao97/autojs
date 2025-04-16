var websocket = {};
var ws = null;


var uuid = device.fingerprint;
function md5(string){
	var res=java.math.BigInteger(1,java.security.MessageDigest.getInstance("MD5").digest(java.lang.String(string).getBytes())).toString(16);
	while(res.length<32)res="0"+res;
	return res;
}

websocket.init = function () {
    if (!ws) {
        ws = new WebSocket(`wss://qevlmydabayn.sealosgzg.site/websocket/${md5(uuid)}`);
        ws
            .on(WebSocket.EVENT_OPEN, (res, ws) => {
                console.log('WebSocket 已连接');
            })
            .on(WebSocket.EVENT_MESSAGE, (message, ws) => {
                console.log('接收到消息', message);
                // if (message instanceof okio.ByteString) {
                //     console.log(`消息类型: ByteString`);
                // } else if (typeof message === 'string') {
                //     console.log(`消息类型: String`);
                // } else {
                //     throw TypeError('Should never happen');
                // }
            })
            .on(WebSocket.EVENT_TEXT, (text, ws) => {
                console.info(`text: ${text}`);
            })
            .on(WebSocket.EVENT_BYTES, (bytes, ws) => {
            })
            .on(WebSocket.EVENT_CLOSING, (code, reason, ws) => {
                console.log('WebSocket 关闭中',code,reason);
            })
            .on(WebSocket.EVENT_CLOSED, (code, reason, ws) => {
                console.log('WebSocket 已关闭');
                console.log(`code: ${code}`);
                if (reason) console.log(`reason: ${reason}`);
            })
            .on(WebSocket.EVENT_FAILURE, (err, res, ws) => {
                console.error('WebSocket 连接失败');
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
