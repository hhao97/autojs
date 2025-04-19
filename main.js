"ui";

const CustomToast = require("./common/custom-toast.js");
const 小红书 = require('./小红书养号.js');
const HomePage = require('./ui/pages/HomePage');
const 主题 = require('./ui/styles/theme');
const 配置 = require('./ui/config/config-manager');

// 初始化配置管理器
const configManager = 配置('configAA');
let config = configManager.get();

// 初始化主题配置
global.theme = 主题();

// 创建HomePage实例
const homePage = HomePage(config, function(newConfig) {
    config = configManager.update(newConfig);
});

// 设置UI布局
ui.layout(`
    <vertical>
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="欢迎使用" />
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                ${homePage.layout}
                <frame>
                    <text text="施工中..." textColor="red" textSize="16sp" />
                </frame>
                <frame>
                    <text text="施工中..." textColor="green" textSize="16sp" />
                </frame>
            </viewpager>
        </vertical>
        <vertical layout_gravity="left" bg="#ffffff" w="280">
            <list id="menu">
                <horizontal bg="?selectableItemBackground" w="*" gravity="center" marginBottom="10">
                    <horizontal>
                        <img w="50" h="50" padding="16" src="{{this.icon}}" tint="${theme.colors.primary}" />
                        <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center" />
                    </horizontal>
                    <text layout_weight="1"></text>
                    <horizontal>
                        <switch checked="{{this.checked}}" id="{{this.id}}"></switch>
                    </horizontal>
                </horizontal>
            </list>
        </vertical>
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

// 设置菜单点击事件
ui.menu.on("item_click", item => {
    switch (item.title) {
        case "退出":
            ui.finish();
            break;
    }
});

// 设置滑动页面的标题
ui.viewpager.setTitles(["养号模式", "开发中", "开发中"]);
// 让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);
// 让工具栏左上角可以打开侧拉菜单

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
