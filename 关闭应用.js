importClass(java.io.FileOutputStream);
importClass(java.io.IOException);
importClass(java.io.File);
importClass(java.io.InputStream);
importClass(okhttp3.OkHttpClient);
importClass(okhttp3.Request);
importClass(okhttp3.Response);
importClass(okhttp3.MediaType);

var config = {
    appName: "小红书",
    configId: "1234567890",
    taskId: "1234567890",
    url: ""
}


killApp(config.appName);

function killApp(appName) {//填写包名或app名称都可以
    var name = getPackageName(appName);//通过app名称获取包名
    if (!name) {//如果无法获取到包名，判断是否填写的就是包名
        if (getAppName(appName)) {
            name = appName;//如果填写的就是包名，将包名赋值给变量
        } else {
            return false;
        }
    }

    app.openAppSetting(name);//通过包名打开应用的详情页(设置页)
    sleep(1000);//等待应用设置界面加载完成
    postJson("正在关闭应用：" + app.getAppName(name));//打印正在关闭的应用名称

    if (!text(app.getAppName(name)).findOne(3000)) {
        postJson("没有进入应用设置界面，可能是因为没有安装该应用或应用名称不正确");
        return false;
    }

    sleep(500);//稍微休息一下，不然看不到运行过程，自己用时可以删除这行
    let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*)/).findOne(1000);//在app的应用设置界面找寻包含“强”，“停”，“结”，“行”的控件
    //特别注意，应用设置界面可能存在并非关闭该app的控件，但是包含上述字样的控件，如果某个控件包含名称“行”字
    //textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/)改为textMatches(/(.*强.*|.*停.*|.*结.*)/)
    //或者结束应用的控件名为“结束运行”直接将textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/)改为text("结束运行")

    is_sure.click();
    sleep(1000);
    let is_sure_2 = textMatches(/(.*强.*|.*停.*|.*结.*|.*确.*|.*定.*)/).find(3000);
    is_sure_2.forEach((item) => {
        sleep(1000);
        item.click();
    });

}

const JSON_MEDIA_TYPE = MediaType.parse("application/json; charset=utf-8");
let client = new OkHttpClient();
function postJson(message) {

    // 确保是字符串
    let jsonString = JSON.stringify({
        configId: config.configId,
        taskId: config.taskId,
        date: new Date().getTime(),
        message: message
    });

    // 构建请求体
    let body = RequestBody.create(JSON_MEDIA_TYPE, jsonString);

    // 构建请求
    let request = new Request.Builder()
        .url(config.url)
        .post(body)
        .build();

    // 执行请求
    try {
        let response = client.newCall(request).execute();
        if (response.isSuccessful()) {
            return response.body().string();
        } else {
            console.error("请求失败，状态码: " + response.code());
        }
    } catch (e) {
        console.error("请求出错: " + e);
    }
    return null;
}