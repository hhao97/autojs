
var socket = null;
var output = null;
var input = null;

function connectSocket(host, port) {
    try {
        var Socket = java.net.Socket;
        socket = new Socket(host, port);

        output = new java.io.PrintWriter(socket.getOutputStream(), true);
        input = new java.io.BufferedReader(new java.io.InputStreamReader(socket.getInputStream()));

        console.log("Socket 已连接到 " + host + ":" + port);
        return true;
    } catch (e) {
        console.error("Socket 连接失败: " + e);
        return false;
    }
}

function sendMessage(msg) {
    if (output) {
        output.println(msg);
        console.log("已发送: " + msg);
    }
}

function readMessage() {
    if (input) {
        var line = input.readLine();
        console.log("收到消息: " + line);
        return line;
    }
    return null;
}

function closeSocket() {
    if (socket) {
        socket.close();
        console.log("Socket 已关闭");
    }
}

module.exports = {
    connectSocket: connectSocket,
    sendMessage: sendMessage,
    readMessage: readMessage,
    closeSocket: closeSocket
};