
let OkHttpClient = okhttp3.OkHttpClient;
let Request = okhttp3.Request;
let RequestBody = okhttp3.RequestBody;
let MediaType = okhttp3.MediaType;
const req = {};
/**
 * 创建一个单例 HTTP 客户端
 */
let httpClient = new OkHttpClient();

/**
 * 封装 POST 请求（发送 JSON 数据）
 * @param {string} url 请求地址
 * @param {object} data 要发送的 JSON 对象
 * @returns {string} 返回响应字符串（同步）
 */
req.post =function httpPostJson(url, data) {
    log("发送 POST 请求: " + url);
    log("请求数据: " + JSON.stringify(data));

    let mediaType = MediaType.parse("application/json; charset=utf-8");
    let body = RequestBody.create(
        new java.lang.String(JSON.stringify(data)).getBytes("UTF-8"),
        mediaType
    );

    let request = new Request.Builder()
        .url(url)
        .post(body)
        .addHeader("Content-Type", "application/json")
        .build();

    let response = httpClient.newCall(request).execute();
    return response.body().string();
}

/**
 * 封装 GET 请求
 * @param {string} url 请求地址（可以带参数）
 * @returns {string} 返回响应字符串（同步）
 */
req.get = function httpGet(url) {
    log("发送 GET 请求: " + url);

    let request = new Request.Builder()
        .url(url)
        .get()
        .build();

    let response = httpClient.newCall(request).execute();
    return response.body().string();
}

module.exports = req;

