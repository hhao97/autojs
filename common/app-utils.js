const utils= {}

//关闭程序
utils.killAPP =function killAPP(packageName){
    wait(() => {
        app.openAppSetting(packageName)
        return textContains("结束运行"||"强行停止").findOne(2000);
    },2,500,{
        then(){
            click("结束运行"||"强行停止");
            if (textContains("确定").findOne(1500)) {
                click("确定");
                console.log("结束小米社区");
            }else{
                console.log("程序未运行");
            }
            sleep(500);
        },
        else(){
            console.log("未找到结束运行按钮，退出");
        },
    });
}
// killAPP("com.xiaomi.vipaccount");


module.exports = utils;
