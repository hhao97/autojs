var handle = {};

const taskQueue = require('../task-queue.js');

handle.eventt = function event(websocket, msg) {
    console.info(`接受消息: ${msg}`);
    let result = "";

    if (msg == "1") {
        result = heartbeat(websocket.session);
    } else {
        result = JSON.parse(msg);
        switch (result.cmd) {

            case "1000": break;
            case "1008": // 任务队列
                result = tasks(websocket.session, result);
                break;
            case "2000":
                result = runScipt(websocket.session, result);break;
            default:
                console.warn(`未知命令: ${result.cmd}`);
                result = JSON.stringify({ cmd: "error", message: "未知命令" });
                console.info(`处理消息: ${result}`);
        }

        doAfter(websocket, result);
    }
}

function doAfter(websocket, msg) {
    let bytes = java.lang.String(msg).getBytes().length;
    websocket.sentBytes += bytes;
}

// 心跳
function heartbeat(ws) {
    let r = {
        cmd: "11", isOk: 1, data: { soc: device.getBattery(), isScreenOn: device.isScreenOn() ? '1' : '0', isCharging: device.isCharging() ? '1' : '0', availMem: device.getAvailMem(), totalMem: device.getTotalMem() }
    };
    let res = JSON.stringify(r);
    ws.send(res);
    return res;
}

// 任务队列
function tasks(ws, result) {
    taskQueue.load(result);
    var result = { cmd: "1009", isOk: 1 };
    var r = JSON.stringify(result);
    ws.send(r);
    return r;
}

function runScipt(ws, result) {
    let script = result.script;
    engines.execScript("result", script);
}

module.exports = handle;