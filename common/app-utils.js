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


utils.syncWaitForFunction = function syncWaitForFunction(func,params, timeoutMs) {
    /**
     * 同步等待给定的函数执行完成或超时。
     *
     * @param {Function} func - 要执行的函数。
     * @param {number} timeoutMs - 等待超时的时间，单位为毫秒。
     * @throws {Error} 如果函数执行超时。
     * @returns {*} 函数的返回值。
     */
    const startTime = Date.now();
    let result;
    let error = null;
    let completed = false;
  
    try {
      result = func(params);
      completed = true;
    } catch (e) {
      error = e;
      completed = true;
    }
  
    while (!completed && Date.now() - startTime < timeoutMs) {
      // 简单地忙等待，实际应用中可能需要更优雅的处理方式，
      // 但在纯同步的上下文中，这是实现同步等待的一种方式。
      // 注意：过度使用忙等待会阻塞事件循环，影响性能。
    }
  
    if (!completed) {
      throw new Error(`Function execution timed out after ${timeoutMs}ms`);
    }
  
    if (error) {
      throw error;
    }
  
    return result;
  }

module.exports = utils;
