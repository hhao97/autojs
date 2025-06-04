importClass(java.io.FileOutputStream);
importClass(java.io.IOException);
importClass(java.io.File);
importClass(java.io.InputStream);
importClass(okhttp3.OkHttpClient);
importClass(okhttp3.Request);
importClass(okhttp3.Response);
const client = new OkHttpClient();
const JSON_MEDIA_TYPE = MediaType.parse("application/json; charset=utf-8");

var config = {
  savePath: "/sdcard/云控素材/",
  imageUrls: [
    "http://nnjc.oss-cn-shenzhen.aliyuncs.com/2025/05/19/01c41db3a1fe4999a6cfdaf97171e8d6.png",
    "http://nnjc.oss-cn-shenzhen.aliyuncs.com/2025/05/19/0e38bc382c01413fb01eea1617178b8d.webp",
    "http://nnjc.oss-cn-shenzhen.aliyuncs.com/2025/05/19/21bb80a5848546cea829f86a572b78a9.png",
  ],
  title: "测试",
  content: "车还是一些",
  isDraft: 1,
  configId: "56",
  taskId: "1",
  url: "http://192.168.1.212:8081/auto/log",
};


run();
var dia = undefined;
function run() {
  try {
    postJson("开始");
    launchApp("小红书");
    sleep(5000);

    dia = dialogs
      .build({
        title: "发布笔记",
        content: "启动中...",
      })
      .on("show", (dialog) => {})
      .show();

    deleteFolderRecursive(config.savePath);

    sleep(1000);

    for (let i = 0; i < config.imageUrls.length; i++) {
      dia.setContent(`下载图片素材中...${i + 1}/${config.imageUrls.length}`);
      downloadImage(config.imageUrls[i], config.savePath);
      sleep(1000);
    }

    sleep(1000);
    dia.dismiss();
    sleep(1000);
    clickPostButton();
    sleep(1000);
    clickAll();
    sleep(1000);
    clickAssert();
    sleep(1000);
    chooseImage();
    sleep(1000);
    className("android.widget.TextView").desc("下一步").findOne(3000).click();
    sleep(1000);
    className("android.widget.TextView").text("下一步").findOne(3000).click();
    sleep(1000);

    if (config.title) {
      var title = className("android.widget.EditText")
        .text("添加标题")
        .findOne(3000);
      title.setText(config.title);
    }
    sleep(1000);
    let content = className("android.widget.EditText").depth(15).findOne();
    content.setText(config.content);

    if (config.isDraft && config.isDraft == 1) {
      className("android.widget.TextView").text("存草稿").findOne(3000).click(); // 存草稿
      sleep(1000);
      // 确认存草稿
      if (
        className("android.widget.TextView").text("确定").findOne(3000).click()
      ) {
        postJson("发布笔记按钮已点击");
      }
    } else {
      // 点击发布按钮
      if (
        className("android.widget.Button")
          .text("发布笔记")
          .findOne(3000)
          .click()
      ) {
        postJson("发布笔记按钮已点击");
      }
    }
    postJson("完成");
  } catch (e) {
    postJson("失败:" + e);
  }
}

function downloadImage(url, path) {
  try {
    let fileName = url.substring(url.lastIndexOf("/") + 1);
    if (!path.endsWith("/")) path += "/";
    let fullPath = path + fileName;

    // 创建目录（如果不存在）
    if (!files.exists(path)) {
      files.createWithDirs(path);
      postJson("目录已创建：" + path);
    } else {
      postJson("目录已存在：" + path);
    }

    // 创建 OkHttp 请求
    let request = new Request.Builder().url(url).build();

    let response = client.newCall(request).execute();
    postJson(response.body());
    if (response.isSuccessful()) {
      let inputStream = response.body().bytes();

      files.writeBytes(fullPath, inputStream);

      postJson("图片已保存到：" + fullPath);
      media.scanFile(fullPath);
    } else {
      postJson("下载失败，状态码: " + response.code());
    }
    response.close();
  } catch (e) {
    postJson("下载出错: " + e, 0);
  }
}

function deleteFolderRecursive(folderPath) {
  if (!files.exists(folderPath)) {
    postJson("目录不存在");
    return;
  }

  let file = new java.io.File(folderPath);
  if (file.isDirectory()) {
    let filesList = file.listFiles();
    if (filesList != null) {
      for (let i = 0; i < filesList.length; i++) {
        let child = filesList[i];
        if (child.isDirectory()) {
          deleteFolderRecursive(child.getAbsolutePath()); // 递归删除子目录
        } else {
          child.delete(); // 删除文件
        }
      }
    }
  }
  // 删除空目录本身
  let success = file.delete();
  if (success) {
    postJson("目录删除失败：" + folderPath);
    dia.setContent("目录已删除：" + folderPath);
  } else {
    postJson("目录删除失败：" + folderPath);
    dia.setContent("目录删除失败：" + folderPath);
  }
}

function clickPostButton() {
  var post = className("android.widget.ImageView").depth(11).findOne(3000);
  if (post == null) {
    postJson("未找到发布按钮");
    return;
  }
  if (click(post.center().x, post.center().y)) {
    postJson("点击了发布按钮");
  }
}

function chooseImage() {
  // 选择所有的图片
  var images = className("android.widget.ImageView").depth(19).find();
  images.forEach((image) => {
    postJson("选择图片 " + image.center().x + ", " + image.center().y);
    click(image.center().x, image.center().y);
    sleep(1000);
  });
}

function clickAll() {
  var all = className("android.widget.TextView").text("全部").findOne(3000);
  if (all == null) {
    className("android.widget.ImageView").desc("关闭").findOne(3000).click();
    postJson("关闭了发布按钮");
    return;
  }
  click(all.center().x, all.center().y);
}

function clickAssert() {
  var assert = className("android.widget.TextView")
    .text("云控素材")
    .findOne(3000);
  if (assert == null) {
    className("android.widget.ImageView").desc("关闭").findOne(3000).click();
    postJson("关闭了图片素材选择窗口");
    return;
  }
  click(assert.center().x, assert.center().y);
}

function postJson(message, state) {
  // 确保是字符串
  let jsonString = JSON.stringify({
    configId: config.configId,
    taskId: config.taskId,
    date: new Date().getTime(),
    message: message,
    state: state || 1,
  });

  // 构建请求体
  let body = RequestBody.create(
    JSON_MEDIA_TYPE,
    java.lang.String.valueOf(jsonString)
  );

  // 构建请求
  let request = new Request.Builder().url(config.url).post(body).build();

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
