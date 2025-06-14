const Card = require("../components/Card");
importClass(android.content.Context);
const server = require("../../server/websocket.js");

setInterval(() => {
  let ws = server.getInstance(config.appId, config.appKey);
  ui.流量.setText(
    ` ↑${(ws.sentBytes / 1024).toFixed(2)}KB ↓${(
      ws.receivedBytes / 1024
    ).toFixed(2)}KB`
  );

  let drawable = new android.graphics.drawable.GradientDrawable();
  drawable.setShape(android.graphics.drawable.GradientDrawable.OVAL);
  drawable.setSize(16, 16);

  if (ws.state == 1) {
    drawable.setColor(android.graphics.Color.parseColor(theme.colors.primary));
    ui.连接状态.setText("已连接");
  } else {
    drawable.setColor(colors.parseColor("#ff213f"));
    ui.连接状态.setText("未连接");
  }
  ui.连接状态圆点.setBackgroundDrawable(drawable);
}, 3000);

function isIgnoringBatteryOptimizations() {
  return context
    .getSystemService(android.content.Context.POWER_SERVICE)
    .isIgnoringBatteryOptimizations(context.packageName);
}

module.exports = function HomePage(config, onConfigChange) {
  // 创建UI布局
  const layout = `
        <frame bg="${global.theme.colors.background}">
            <ScrollView>
            
                <vertical paddingBottom="30">
                
                    ${Card(
                      "权限设置",
                      `
                           <vertical>
                        <Switch margin="10 0" id="autoService" text="无障碍服务" checked="{{auto.service !=null}} "/ >
                            <horizontal padding="8 0" marginTop="5" marginBottom="5">
                                <frame w="*" h="1" bg="${
                                  global.theme.colors.background
                                }" gravity="center" />
                            </horizontal>
                            <Switch margin="10 0" id="悬浮窗" text="悬浮窗口" checked="{{1}} "/ >
                                <horizontal padding="8 0" marginTop="5" marginBottom="5">
                                <frame w="*" h="1" bg="${
                                  global.theme.colors.background
                                }" gravity="center" />
                            </horizontal>
                            <Switch margin="10 0" id="忽略电池优化" text="忽略电池优化" checked="${isIgnoringBatteryOptimizations()}"/ >
                               <horizontal padding="8 0" marginTop="5" marginBottom="5">
                                <frame w="*" h="1" bg="${
                                  global.theme.colors.background
                                }" gravity="center" />
                            </horizontal>
                        </vertical>
                        `
                    )}
                    
                    ${Card(
                      "登录验证",
                      `
                        <vertical>
                            <vertical padding="10 0" gravity="center_vertical">
                                <text text="账号 ID" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                <input id="账号ID" text="${config.appId}" hint="请输入平台获取的账号 ID" singleLine="true"  textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                            </vertical>
                       
                            <vertical padding="10 0" gravity="center_vertical">
                                <text text="AppKey" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                <input id="密钥" text="${config.appKey}"  hint="请输入平台获取的AppKey" singleLine="false" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                            </vertical>

                            <horizontal padding="10 10" gravity="center_vertical" >
                                <text>连接状态：</text> 
                                <view id="连接状态圆点" w="12dp" h="12dp" margin="4dp"/>
                                <text id="连接状态">未连接</text>
                                 <text id="流量"></text>
                            </horizontal>

                            <vertical padding="10 10" gravity="center_vertical" >
                                  <button id="验证登录" text="验证登录" />
                            </vertical>
                        </vertical>
                    `
                    )}
                    <vertical>
                        <frame id="endBtn" w="*" margin="16 8" gravity="center">
                            <text padding="20 10" text="结束运行" gravity="center" textColor="${
                              global.theme.colors.text.white
                            }" textSize="${global.theme.text.size.large}" />
                        </frame>
                    </vertical>
                </vertical>
            </ScrollView>
        </frame>
    `;

  // 返回布局和事件处理函数
  return {
    layout: layout,
    setupEvents: function (ui, configManager, customToast) {
      // 设置按钮样式

      let gradientDrawableRed =
        new android.graphics.drawable.GradientDrawable();
      gradientDrawableRed.setColor(
        android.graphics.Color.parseColor(theme.colors.secondary)
      );
      gradientDrawableRed.setCornerRadius(25);

      let gradientDrawableRed1 =
        new android.graphics.drawable.GradientDrawable();
      gradientDrawableRed1.setColor(colors.parseColor("#ffffff"));
      gradientDrawableRed1.setCornerRadius(25);
      gradientDrawableRed1.setStroke(1, colors.parseColor("#CCCCCC"));

      ui.endBtn.setBackground(gradientDrawableRed);
      ui.验证登录.setBackgroundDrawable(gradientDrawableRed1);
      ui.验证登录.setTextColor(colors.parseColor("#000000"));

      let drawable = new android.graphics.drawable.GradientDrawable();
      drawable.setColor(colors.parseColor("#ff213f"));
      drawable.setShape(android.graphics.drawable.GradientDrawable.OVAL);
      drawable.setSize(16, 16);
      ui.连接状态圆点.setBackgroundDrawable(drawable);

      //开启无障碍服务
      ui.autoService.on("check", function (checked) {
        if (checked && auto.service == null) {
          app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS",
          });
        }
        if (!checked && auto.service != null) {
          auto.service.disableSelf();
        }
      });

      ui.悬浮窗.on("check", function (checked) {
        if (!checked) {
          customToast.show("悬浮窗口权限必须开启");
          app.startActivity({
            packageName: "com.android.settings",
            className:
              "com.android.settings.Settings$AppDrawOverlaySettingsActivity",
            data: "package:" + context.getPackageName().toString(),
          });
        }
      });

      if (android.provider.Settings.canDrawOverlays(context)) {
        ui.悬浮窗.setChecked(true);
      } else {
        ui.悬浮窗.setChecked(false);
      }

      ui.忽略电池优化.on("check", function (checked) {
        if (!checked) {
          app.startActivity(
            new android.content.Intent()
              .setAction(
                android.provider.Settings
                  .ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
              )
              .setData(android.net.Uri.parse("package:" + context.packageName))
          );
        }
      });

      ui.验证登录.on("click", () => {
        config.appKey = ui.密钥.text();
        config.appId = ui.账号ID.text();
        configManager.update(config);
        customToast.show("已更新账号信息");
      });

      // 结束按钮点击事件
      ui.endBtn.on("click", () => {
        engines.stopAll();
      });
    },
  };
};
