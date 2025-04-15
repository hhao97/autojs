
/**
 * 
 * @returns 是否是搜索结果页
 */
function isSearchResultPage() {
    const notes = className("android.widget.TextView").text('筛选').exists();
    var result = notes || (className("android.widget.TextView").text('全部').exists() &&
        className("android.widget.TextView").text('用户').exists() &&
        className("android.widget.TextView").text('话题').exists() &&
        className("android.widget.TextView").text('商品').exists())
    console.log(`是否是搜索结果页`, result)
    return result;
}



if(!requestScreenCapture()){
    toast("请求截图失败");
    exit();
}
sleep(5000)
captureScreen("/sdcard/screencapture" + 2222 + ".png");

var wx = images.read("images/小红书-评论-加号.jpg");
var 发送 = images.read("images/小红-评论-发送.jpg");

var p = findImage(captureScreen(), 发送);
// var result  = images.matchTemplate(dat,wx)
// console.log(result.matches)
// result.matches.forEach(match => {
    // log("point = " + match.point + ", similarity = " + match.similarity);
// });

if(p){
    toast("在桌面找到了微信图标啦: " + p);
    click(p.x,p.y)
}else{
    toast("在桌面没有找到微信图标");
}

wx.recycle();

// addGroupToComment()

// var father = className("android.view.ViewGroup").indexInParent(4).childCount(6).depth(8).findOne(3000);
// father.children().forEach(element => {
//     console.log(element.center())  
//     sleep(3000)
//     click(element.center().x,element.center().y)
// })

// click(father.lastChild().center().x,father.lastChild().center().y)
// click(father.child(4).center().x,father.child(4).center().y)



function doSend() {
    sleep(random(2000, 3000));
    // var sendBtn = className("android.widget.TextView").text("发送").findOne(5000);
    // if (sendBtn) {
    //     console.log(sendBtn.center())
    //     click(random(sendBtn.center().x - 20, sendBtn.center().x + 20),
    //         random(sendBtn.center().y - 20, sendBtn.center().y + 20))
    //     return;
    // } 
    // var 发送 = images.read("images/小红-评论-发送.jpg");
    // var p = findImage(captureScreen(), 发送);
    // if(p){
    //     toast("在桌面找到了微信图标啦: " + p);
    //     click(p.x,p.y)
    // }else{
    //     toast("在桌面没有找到微信图标");
    // }
    
}