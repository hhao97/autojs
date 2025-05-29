var handle = {};

const taskQueue = require("../task-queue.js");

handle.eventt = function event(websocket, msg) {
  console.info(`接受消息: ${msg}`);
  let result = "";

  if (msg == "1") {
    result = heartbeat(websocket.session);
  } else {
    result = JSON.parse(msg);
    switch (result.cmd) {
      case "1000":
        break;
      case "2001":
        result = capture(websocket.session, result);
        break;
      case "1008":
        result = runScipt(websocket.session, result);
        break;
      case "2003":
        result = enginesAll(websocket.session);
        break;
      case "2005":
        result = enginesStop(websocket.session,result.msg);
        break;
      default:
        console.warn(`未知命令: ${result.cmd}`);
        result = JSON.stringify({ cmd: "error", message: "未知命令" });
        console.info(`处理消息: ${result}`);
    }

    doAfter(websocket, result);
  }
};

function doAfter(websocket, msg) {
  let bytes = java.lang.String(msg).getBytes().length;
  websocket.sentBytes += bytes;
}

// 心跳
function heartbeat(ws) {
  let r = {
    cmd: "11",
    isOk: 1,
    data: {
      soc: device.getBattery(),
      isScreenOn: device.isScreenOn() ? "1" : "0",
      isCharging: device.isCharging() ? "1" : "0",
      availMem: device.getAvailMem(),
      totalMem: device.getTotalMem(),
    },
  };
  let res = JSON.stringify(r);
  ws.send(res);
  return res;
}

// 获取截图
function capture(ws, result) {
  try {
    var img = captureScreen();
    var base64 = images.toBase64(img, (format = "jpeg"), (quality = 3));
    var result = JSON.stringify({
      cmd: "2002",
      isOk: 1,
      data: "data:image/jpeg;base64," + base64,
    });
    ws.send(result);
    return result;
  } catch (e) {
    console.error("截图失败: ", e);
    result = { cmd: "2002", isOk: 0, msg: e.toString() };
    ws.send(JSON.stringify(result));
    return result;
  }
}
// 执行脚本
function runScipt(ws, result) {
  let script = result.script;
  engines.execScript(result.msg, script);
}

// 查询当前执行任务
function enginesAll(ws) {
  let enginesList = engines.all();
  let data = enginesList.map((e) => ({
    id: e.id,
    source: e.source,
  }));
  let result = {
    cmd: "2004",
    isOk: 1,
    data: JSON.stringify(data),
  };
  var r = JSON.stringify(result);
  ws.session.send(r);
  return r;
}

function enginesStop(ws, result) {
  var data = "";
  engines.all().forEach((e) => {
    if (e.id == result.id) {
      data = e.forceStop();
      return;
    }
  });
  let r = JSON.stringify({
    cmd: "2006",
    isOk: 1,
    data: data,
  });
  ws.session.send(r);
  return r;
}

module.exports = handle;
