"ui";

const CustomToast = require("./common/custom-toast.js");
const 小红书 = require('./小红书养号.js');
const HomePage = require('./ui/pages/HomePage');
const 主题 = require('./ui/styles/theme');
const 配置 = require('./ui/config/config-manager');
const SecondPage = require('./ui/pages/SecondPage');
const ThirdPage = require('./ui/pages/ThirdPage');

// 初始化配置管理器
const configManager = 配置('configAA');
let config = configManager.get();

// 初始化主题配置
global.theme = 主题();

// 创建HomePage实例
const homePage = HomePage(config, function (newConfig) {
    config = configManager.update(newConfig);
});

// 设置UI布局
ui.layout(`
    <vertical>
        <appbar>
            <toolbar id="toolbar" title="欢迎使用" />
        </appbar>
        <frame id="content" layout_weight="1">
            ${homePage.layout}
        </frame>
        <horizontal bg="${global.theme.colors.white}" elevation="4dp">
            <vertical id="tab1" layout_weight="1" gravity="center" padding="8" w="*">
                <img w="24" h="24" src="@drawable/ic_home_black_48dp" tint="${global.theme.colors.primary}" />
                <text text="工具" textSize="12sp" textColor="${global.theme.colors.primary}" marginTop="4" gravity="center" />
            </vertical>
            <vertical id="tab2" layout_weight="1" gravity="center" padding="8" w="*" >
                <img w="24" h="24" src="@drawable/ic_android_black_48dp" tint="${global.theme.colors.text.secondary}" />
                <text text="统计" textSize="12sp" textColor="${global.theme.colors.text.secondary}" marginTop="4" gravity="center" />
            </vertical>
            <vertical id="tab3" layout_weight="1" gravity="center" padding="8" w="*" >
                <img w="24" h="24" src="@drawable/ic_android_black_48dp" tint="${global.theme.colors.text.secondary}" />
                <text text="我的" textSize="12sp" textColor="${global.theme.colors.text.secondary}" marginTop="4" gravity="center" />
            </vertical>
        </horizontal>
    </vertical>
`);

// 设置按钮样式
let gradientDrawable = new android.graphics.drawable.GradientDrawable();
gradientDrawable.setColor(android.graphics.Color.parseColor(theme.colors.primary));
gradientDrawable.setCornerRadius(25);

let gradientDrawableRed = new android.graphics.drawable.GradientDrawable();
gradientDrawableRed.setColor(android.graphics.Color.parseColor(theme.colors.secondary));
gradientDrawableRed.setCornerRadius(25);

ui.startBtn.setBackground(gradientDrawable);
ui.endBtn.setBackground(gradientDrawableRed);

// 设置事件处理
homePage.setupEvents(ui, configManager);

// 定义更新底部导航栏颜色的函数
function updateTabColors(activeTab) {
    const tabs = [ui.tab1, ui.tab2, ui.tab3];
    const activeColor = global.theme.colors.primary;
    const inactiveColor = global.theme.colors.text.secondary;

    tabs.forEach((tab, index) => {
        const color = index === activeTab ? activeColor : inactiveColor;
        tab.getChildAt(0).attr("tint", color);
        tab.getChildAt(1).attr("textColor", color);
    });
}

// 设置底部导航栏点击事件
ui.tab1.on("click", () => {
    updateTabColors(0);

    // 加载第一个页面
    const homePage = HomePage(config, function (newConfig) {
        config = configManager.update(newConfig);
    });
    ui.content.removeAllViews();
    ui.content.addView(ui.inflate(homePage.layout));
    homePage.setupEvents(ui, configManager);
});

ui.tab2.on("click", () => {
    updateTabColors(1);

    // 加载第二个页面
    const secondPage = SecondPage();
    ui.content.removeAllViews();
    ui.content.addView(ui.inflate(secondPage.layout));
    secondPage.setupEvents(ui);
});

ui.tab3.on("click", () => {
    updateTabColors(2);

    // 加载第三个页面
    const thirdPage = ThirdPage();
    ui.content.removeAllViews();
    ui.content.addView(ui.inflate(thirdPage.layout));
    thirdPage.setupEvents(ui);
});

// 创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu => {
    menu.add("设置");
    menu.add("关于");
});

// 监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "设置":
            console.launch();
            break;
        case "关于":
            CustomToast.show('show');
            break;
    }
    e.consumed = true;
});

activity.setSupportActionBar(ui.toolbar);
