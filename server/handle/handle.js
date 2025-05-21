var handle = {};

 

handle.event = function event(ws, msg) {
    heartbeat(ws);
}

function heartbeat(ws) {
    const r = {cmd : "1001",isOk : 1};
    ws.send(JSON.stringify(r));
}

module.exports = handle;