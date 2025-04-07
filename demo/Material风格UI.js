'ui';
const Snackbar = com.google.android.material.snackbar.Snackbar;
activity.setTheme(com.google.android.material.R$style.Theme_Material3_Light_NoActionBar);

var testPage = ui.inflate(
  <vertical>
    <appbar bg="#42b983">
      <toolbar id="toolbar" title="五云学习 - Material3 风格"></toolbar>
    </appbar>
    <vertical id="root" padding="10" bg="#efefef" w="*" h="*">
      <text>卡片</text>
      <com.google.android.material.card.MaterialCardView>
        <vertical padding="10">
          <text>卡片</text>
        </vertical>
      </com.google.android.material.card.MaterialCardView>

      <View h="10" />
      <horizontal>
        <com.google.android.material.card.MaterialCardView w="0" layout_weight="1">
          <vertical padding="10">
            <text>卡片1</text>
          </vertical>
        </com.google.android.material.card.MaterialCardView>
        <com.google.android.material.card.MaterialCardView w="0" layout_weight="1" marginLeft="10">
          <vertical padding="10">
            <text>卡片2</text>
          </vertical>
        </com.google.android.material.card.MaterialCardView>
      </horizontal>

      <View h="10" />
      <text>按钮</text>
      <com.google.android.material.button.MaterialButton id="action" icon="@drawable/ic_aspect_ratio_black_48dp" iconGravity="4" iconTint="#ff0000" strokeColor="#ff0000" backgroundTint="#42b983" strokeWidth="1dp" cornerRadius="10dp" w="*" text="按钮  " marginTop="10" textSize="14" />
      <com.google.android.material.button.MaterialButton id="main" icon="@drawable/ic_home_black_48dp" iconGravity="2" iconTint="#ff0000" strokeColor="#ff0000" backgroundTint="#42b983" strokeWidth="1dp" cornerRadius="10dp" w="*" text="进入首页" marginTop="10" textSize="14" />

      <View h="10" />
      <text>滑块</text>
      <com.google.android.material.slider.Slider valueFrom="0.0" valueTo="100.0" />

      <com.google.android.material.textfield.TextInputLayout hint="输入框">
        <com.google.android.material.textfield.TextInputEditText />
      </com.google.android.material.textfield.TextInputLayout>

      <com.google.android.material.card.MaterialCardView backgroundTint="#42b983" marginTop="10">
        <vertical>
          <horizontal padding="10">
            <text gravity="left|center" textSize="18" textStyle="bold" textColor="black" w="0" layout_weight="1">
              无障碍服务
            </text>
            <Switch id="accessibilityService" thumbTint="#ff0000" trackTint="#42b983" />
          </horizontal>
          <horizontal padding="10">
            <text gravity="left|center" textSize="18" textStyle="bold" textColor="black" w="0" layout_weight="1">
              悬浮窗
            </text>
            <Switch id="overlayPermission" scaleY="0.9" scaleX="0.9" />
          </horizontal>
          <horizontal padding="10">
            <text gravity="left|center" textSize="18" textStyle="bold" textColor="black" w="0" layout_weight="1">
              定位
            </text>
            <Switch id="locationPermission" />
          </horizontal>
          <horizontal padding="10">
            <text gravity="left|center" textSize="18" textStyle="bold" textColor="black" w="0" layout_weight="1">
              文件访问
            </text>
            <Switch id="fileAccessPermission" />
          </horizontal>
          <horizontal padding="10">
            <text gravity="left|center" textSize="18" textStyle="bold" textColor="black" w="0" layout_weight="1">
              后台弹出界面
            </text>
            <Switch id="backgroundPopupPermission" />
          </horizontal>
          <horizontal padding="10">
            <text gravity="left|center" textSize="16" textStyle="bold" textColor="black" w="0" layout_weight="1">
              允许通知
            </text>
            <Switch id="notificationPermission" />
          </horizontal>
        </vertical>
      </com.google.android.material.card.MaterialCardView>
    </vertical>
  </vertical>
);
var mainPage = ui.inflate(
  <vertical layout_gravity="center">
    <text textSize="20" gravity="center">
      Hi~ welcome to 首页
    </text>
  </vertical>
);

ui.statusBarColor('#42b983');
ui.setContentView(testPage);
testPage.action.on('click', function () {
  Snackbar.make(testPage.action, '显示Snackbar', Snackbar.LENGTH_SHORT).show();
});
testPage.main.on('click', function () {
  ui.setContentView(mainPage);
  ui.emitter.once('back_pressed', function (e) {
    e.consumed = true;
    ui.setContentView(testPage);
  });
});