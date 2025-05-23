var handle = {};

handle.eventt = function event(websocket, msg) {
    console.info(`接受消息: ${msg}`);
    let result = "";

    if (msg == "1") {
        result = heartbeat(websocket.session);
    } else {

    }


    doAfter(websocket, result);
}
function doAfter(websocket, msg) {
    let bytes = java.lang.String(msg).getBytes().length;
    websocket.sentBytes += bytes;
}

function heartbeat(ws) {
    let r = {
        cmd: "11", isOk: 1, data: { soc: device.getBattery(), isScreenOn: device.isScreenOn() ? '1' : '0', isCharging: device.isCharging() ? '1' : '0', availMem: device.getAvailMem(), totalMem: device.getTotalMem() }
    };
    let res = JSON.stringify(r);
    ws.send(res);
    return res;
}

module.exports = handle;