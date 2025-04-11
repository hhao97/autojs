let LOGFLOAT = false;
/**
 * 日志悬浮窗按钮组件
 * @param {Number} x 坐标x
 * @param {Number} y 坐标y
 * @param {Function} executeMethod 需要执行的方法
 */
function 日志显示(x, y, executeMethod) {
  if (LOGFLOAT) {
    return toastLog('已启动悬浮窗');
  }
  LOGFLOAT = true;
  if (typeof x != 'number') x = 0;
  if (typeof y != 'number') y = 10;
  let floatyLogW = floaty.rawWindow(
    <card id="main" h="150" cardBackgroundColor="#b3000000" cardCornerRadius="8dp" cardElevation="1dp" gravity="center_vertical">
      <vertical paddingLeft="5" paddingRight="5" w="*">
        <horizontal margin="15 5 15 0">
          <horizontal h="auto" w="0" layout_weight="1">
            <text id="title" text="" textSize="13dp" textColor="#FFD700" textStyle="bold" style="Widget/AppCompat.Button.Borderless" />
            <text id="label" text="" textSize="13dp" textColor="#1E90FF" textStyle="bold" style="Widget/AppCompat.Button.Borderless" marginLeft="10" />
          </horizontal>
          <Chronometer id="runTime" textSize="13dp" textColor="#03D96A" w="auto" style="Widget/AppCompat.Button.Borderless" textStyle="bold" />
        </horizontal>
        <button gravity="center_horizontal" textColor="#DC143C" w="*" h="13" textStyle="bold" />
        <console id="console" w="*" h="*" padding="5" />
      </vertical>
    </card>
  );

  let controller = floaty.rawWindow(
    <vertical h="150" id="main">
      <text layout_weight="5" id="start" textStyle="bold" gravity="center" w="22dp" text="启动" bg="#00a86b" />
      <text layout_weight="5" id="hide" textStyle="bold" gravity="center" w="22dp" text="日志" bg="#FF8E12" />
      <text layout_weight="5" id="stop" textStyle="bold" gravity="center" w="22dp" text="结束" bg="#ee4d2d" />
    </vertical>
  );
  let hideButton = controller.hide;
  let startButton = controller.start;
  let stopButton = controller.stop;
  let runTimeView = floatyLogW.runTime;
  let floatConsole = floatyLogW.console;

  let _thread = null;

  setFloatyTitle = function (title) {
    ui.run(() => {
      floatyLogW.title.setText(title);
    });
  };
  setFloatyLabel = function (label) {
    ui.run(() => {
      floatyLogW.label.setText(label);
    });
  };
  setFloatyOnStatus = function (enabled) {
    $ui.post(() => {
      if (floatyLogW && controller && runTimeView && startButton) {
        if (enabled) {
          // 开
          runTimeView.setBase(android.os.SystemClock.elapsedRealtime());
          runTimeView.start();
          startButton.setText('停止');
          startButton.attr('background', '#05a7f4');
        } else {
          runTimeView.stop();
          startButton.setText('启动');
          startButton.attr('background', '#00a86b');
        }
      }
    });
  };
  function dateFormat(date, fmt_str) {
    return java.text.SimpleDateFormat(fmt_str).format(new Date(date || new Date()));
  }

  ui.run(() => {
    runTimeView.setFormat('[运行时长 %s ]');
    runTimeView.setBase(android.os.SystemClock.elapsedRealtime());

    floatConsole.setConsole(runtime.console); // 设置控制台
    floatConsole.setInputEnabled(false); // 控制台输入框禁用
    floatConsole.setColor('V', '#ffff00');
    floatConsole.setColor('I', '#ffffff');
    floatConsole.setColor('D', '#ffff00');
    floatConsole.setColor('W', '#673ab7');
    floatConsole.setColor('E', '#ff0000');
    floatConsole.setTextSize(13);

    floatyLogW.setTouchable(false);
    floatyLogW.setSize(-1, -2);
    floatyLogW.setPosition(3000, 3000);
    controller.setPosition(0, y);
  });
  controller.stop.click(() => {
    $app.launchPackage(context.getPackageName()); // 返回脚本应用界面
    toast('停止本次任务');
    // exit()
    if (_thread) {
      _isStop = true;
      _thread.interrupt();
    }
    $threads.shutDownAll();
    floatyLogW.close();
    controller.close();
    LOGFLOAT = false;
  });
  controller.hide.click(() => {
    hideButton.setEnabled(false);
    setTimeout(() => {
      hideButton.setEnabled(true);
    }, 3000);

    if (hideButton.text() == '隐藏') {
      let animator = android.animation.ObjectAnimator.ofFloat(floatyLogW.main, 'translationX', 0, -1500);
      let mTimeInterpolator = new android.view.animation.DecelerateInterpolator();
      animator.setInterpolator(mTimeInterpolator);
      animator.setDuration(3000); //动画时间
      animator.start();
      setTimeout(() => {
        ui.post(() => {
          floatyLogW.setPosition(3000, 3000);
          hideButton.attr('text', '日志');
          hideButton.attr('background', '#FF8E12');
        });
      }, 2000);
    } else if (hideButton.text() == '日志') {
      setTimeout(() => {
        ui.post(() => {
          hideButton.setText('隐藏');
          hideButton.attr('background', '#d1c7b7');
          floatyLogW.setSize($device.width - 60, floatyLogW.getHeight());
          floatyLogW.setPosition(0 + 60, y);
        });
      }, 200);
      let animator = android.animation.ObjectAnimator.ofFloat(floatyLogW.main, 'translationX', -1500, 0);
      let mTimeInterpolator = new android.view.animation.DecelerateInterpolator(); // 头快尾慢
      animator.setInterpolator(mTimeInterpolator);
      animator.setDuration(3000); //动画时间
      animator.start();
    }
  });
  controller.start.click(() => {
    if (_thread ? !_thread.isAlive() : true) {
      //线程没有运行
      if (controller) setFloatyOnStatus(true);
      _isStop = false;
      //新建一个线程，赋值给变量_thread
      _thread = threads.start(function () {
        try {
          printLog('Task started');
          executeMethod();
          if (controller) setFloatyOnStatus(false);
          printLog('Task finished');
        } catch (e) {
          let info = $debug.getStackTrace(e);
          if (info.includes('com.stardust.autojs.runtime.exception.ScriptInterruptedException')) {
            printInfo(`Task Stop`);
          } else {
            printError('Task error:', e);
            printError('程序运行失败' + info);
          }
          // _this.log("程序运行失败>>打开软件右上角>>查看日志");
          setFloatyOnStatus(false);
        }
        //运行完毕修改按钮文字
        setFloatyOnStatus(false);
      });
    } else {
      setFloatyOnStatus(false);
      //线程正在运行
      _isStop = true;
      _thread && _thread.interrupt();
      //中断线程;
    }
  });
  printInfo = function (msg) {
    console.info('[' + dateFormat(new Date(), 'HH:mm:ss') + '] ' + msg);
  };
  printLog = function (msg) {
    console.log('[' + dateFormat(new Date(), 'HH:mm:ss') + '] ' + msg);
  };
  printError = function (msg) {
    console.error('[' + dateFormat(new Date(), 'HH:mm:ss') + '] ' + msg);
  };
}

日志显示(0, 60, function(){ log("这是需要运行的函数")});
setFloatyTitle('微信小程序自动下单');