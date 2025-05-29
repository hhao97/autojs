// 下载远程图片并保存到本地
// let imageUrl = "https://jdb-oss.g4a.cn/jdb24/images/home/liuyanghe.png"; // 替换为你自己的图片 URL
let savePath = "/sdcard/云控素材/"; // 要保存的本地路径

let imageUrl = "https://jdb-oss.g4a.cn/jdb24/images/home/score.png"; // 替换为你自己的图片 URL

// // 方法1：使用 http.get + writeBytes
// function downloadImage(url, path) {

//     let fileName = url.substring(url.lastIndexOf("/") + 1);

//     // 如果目录不存在，就创建它
//     if (!files.exists(path)) {
//         files.create(path);
//         toast("目录已创建：" + path);
//     } else {
//         toast("目录已存在");
//     }


//     let res = http.get(url);
//     if (res.statusCode === 200) {
//         let bytes = res.body.bytes();
//         files.writeBytes(path + fileName, bytes);
//         toast("图片已保存到：" + path);
//         media.scanFile(path);
//     } else {
//         toast("下载失败，状态码：" + res.statusCode);
//     }
// }


// downloadImage(imageUrl, savePath);

// // 点击发布按钮
// var post = className("android.widget.ImageView").depth(11).findOne(3000);
// click(post.center().x, post.center().y);

// function deleteFolderRecursive(folderPath) {
//     if (!files.exists(folderPath)) {
//         toast("目录不存在");
//         return;
//     }

//     let file = new java.io.File(folderPath);
//     if (file.isDirectory()) {
//         let filesList = file.listFiles();
//         if (filesList != null) {
//             for (let i = 0; i < filesList.length; i++) {
//                 let child = filesList[i];
//                 if (child.isDirectory()) {
//                     deleteFolderRecursive(child.getAbsolutePath()); // 递归删除子目录
//                 } else {
//                     child.delete(); // 删除文件
//                 }
//             }
//         }
//     }
//     // 删除空目录本身
//     let success = file.delete();
//     if (success) {
//         toast("目录已删除：" + folderPath);
//     } else {
//         toast("目录删除失败：" + folderPath);
//     }
// }

// // 用法
// let targetDir = "/sdcard/0528";
// deleteFolderRecursive(targetDir);

// // 选择所有的图片
// var images = className("android.widget.ImageView").depth(19).find();
// images.forEach((image) => {
//     console.log("ImageView found: " + image.center().x + ", " + image.center().y);
//     click(image.center().x, image.center().y);
//     sleep(1000);
// })

// // 点击下一步按钮
// className("android.widget.TextView").desc("下一步").findOne(3000).click();

// // 点击下一步
// className("android.widget.TextView").text("下一步").findOne(3000).click();


// var title = className("android.widget.EditText").text("添加标题").findOne(3000);
// title.setText("凑的还可以哈～完美的618");


// let content = className("android.widget.EditText").depth(15).findOne();
// console.log(content);
// // let text = "返利怎么做#懂的自然懂 #活在自己的时区";

// content.setText("#主打的就是省钱[话题]# #每天都在买买买[话题]# #购物清单[话题]#\n哈哈哈哈哈，太开心了🥳谢谢马爸爸"); // 清空旧内容
// // sleep(300);

// // // 模拟逐字输入（避免用 content.text()）
// // let currentText = "";
// // for (let i = 0; i < text.length; i++) {
// //     currentText += text[i];
// //     content.setText(currentText);
// //     sleep(80); // 适当延迟，模拟手打字节，触发话题识别
// // }

// // className("android.widget.Button").text("发布笔记").findOne(3000).click(); // 点击发布按钮
// className("android.widget.TextView").text("存草稿").findOne(3000).click(); // 存草稿
// className("android.widget.TextView").text("确定").findOne(3000).click();// 确认存草稿


// var all =className("android.widget.TextView").text("全部").findOne(3000);
// if(all == null){
//     className("android.widget.ImageView").desc("关闭").findOne(3000).click();
//     console.log("关闭了弹窗");
//     return ;
// }
// click(all.center().x, all.center().y);

// sleep(1000);

// var assert = className("android.widget.TextView").text("云控素材").findOne(3000);
// if(assert == null){
//     className("android.widget.ImageView").desc("关闭").findOne(3000).click();
//     console.log("关闭了弹窗");
//     return ;
// }
// click(assert.center().x, assert.center().y);



// let dia = dialogs.build({
//     title: "发布笔记",
//     content: "正在获取素材资源",
// }).on("show", (dialog) => {
//     toast("对话框显示了");
// }).show();

// setTimeout(() => {
//     ui.run(() => {
//         dia.setContent("正在准备发布素材...");
//     });
// }, 2000);

// sleep(2000);
// dia.dismiss();



// importClass(java.io.FileOutputStream);
// importClass(java.io.IOException);
// importClass(java.io.File);
// importClass(java.io.InputStream);
// importClass(okhttp3.OkHttpClient);
// importClass(okhttp3.Request);
// importClass(okhttp3.Response);




// // 初始化 OkHttpClient（可复用）
let client = new OkHttpClient();

// function downloadImage(url, path) {
//     let fileName = url.substring(url.lastIndexOf("/") + 1);
//     if (!path.endsWith("/")) path += "/";
//     let fullPath = path + fileName;

//     // 创建目录（如果不存在）
//     if (!files.exists(path)) {
//         files.createWithDirs(path);
//         console.log("目录已创建：" + path);
//     } else {
//         console.log("目录已存在：" + path);
//     }

//     // 创建请求
//     let request = new Request.Builder().url(url).build();
//     try {
//         let response = client.newCall(request).execute();
//         if (response.isSuccessful()) {
//             let inputStream = response.body().byteStream();
//             let file = new File(fullPath);
//             let fos = new FileOutputStream(file);

//             let buffer = util.java.array('byte', 1024);
//             let len;
//             while ((len = inputStream.read(buffer)) !== -1) {
//                 fos.write(buffer, 0, len);
//             }

//             fos.flush();
//             fos.close();
//             inputStream.close();
//             console.log("图片已保存到：" + fullPath);
//             media.scanFile(file);
//         } else {
//             console.error("下载失败，状态码: " + response.code());
//         }
//     } catch (e) {
//         console.error("下载出错: " + e);
//     }
// }

// downloadImage("https://jdb-oss.g4a.cn/jdb24/images/home/liuyanghe.png", "/sdcard/云控素材/");


// 测试手机为红米note10 pro，autojsPro版本8.8.22-common

function downloadImage(url, path) {
    let fileName = url.substring(url.lastIndexOf("/") + 1);
    if (!path.endsWith("/")) path += "/";
    let fullPath = path + fileName;

    // 创建目录（如果不存在）
    if (!files.exists(path)) {
        files.createWithDirs(path);
        console.log("目录已创建：" + path);
    } else {
        console.log("目录已存在：" + path);
    }

    // 创建 OkHttp 请求
    let request = new Request.Builder().url(url).build();
    try {
        let response = client.newCall(request).execute();
        console.log(response.body());
        if (response.isSuccessful()) {
            let inputStream = response.body().bytes();

            files.writeBytes(fullPath, inputStream);

            console.log("图片已保存到：" + fullPath);
            media.scanFile(fullPath);
        } else {
            console.error("下载失败，状态码: " + response.code());
        }
        response.close();
    } catch (e) {
        console.error("下载出错: " + e);
    }
}
 
downloadImage(imageUrl, savePath);