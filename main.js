"ui";

const CustomToast = require("./common/custom-toast.js");
const 小红书 = require('./小红书养号.js');
const HomePage = require('./ui/pages/HomePage');
const StatisticsPage = require('./ui/pages/StatisticsPage');
const ProfilePage = require('./ui/pages/ProfilePage');
const NavigationBar = require('./ui/components/NavigationBar');
const 主题 = require('./ui/styles/theme');
const 配置 = require('./ui/config/config-manager');
const SecondPage = require('./ui/pages/SecondPage');
const ThirdPage = require('./ui/pages/ThirdPage');

// 初始化配置管理器
const configManager = 配置('configAA');
let config = configManager.get();

// 初始化主题配置
global.theme = 主题();

// 创建页面实例
const homePage = HomePage(config, function (newConfig) {
    config = configManager.update(newConfig);
});
const statisticsPage = StatisticsPage(config, function (newConfig) {
    config = configManager.update(newConfig);
});


var CurrentVersion = 1.0
var url = "https://share.weiyun.com/K5FzyWiW"
r = http.get(url);
var html = r.body.string();
var moid = html.split('shareInfo":')[1].split("};")[0]
var obj = JSON.parse(moid);
var tulx = obj.note_list[0].html_content;
var re = /<p>(.*)<\/p>/
var a = re.exec(tulx)[1].split("</p><p>")
var LatestVersion = a[1]
var DonloadUrl = a[2].toString()
var UpNotes = a.slice(3)
if (LatestVersion > CurrentVersion) {
    var releaseNotes = "更新内容：\n" + UpNotes ;
    releaseNotes = releaseNotes.replaceAll(',',`\n`)
    console.log(releaseNotes)
    var builder = new android.app.AlertDialog.Builder(activity)
    builder.setTitle("发现新版本 v" + LatestVersion);
    builder.setMessage(releaseNotes);
    builder.setCancelable(false);
 
    //设置正面按钮
    builder.setPositiveButton("复制新版下载地址", new android.content.DialogInterface.OnClickListener({
        onClick: function (dialog, which) {
            setClip(DonloadUrl)
            toast("已复制下载地址")
            app.openUrl(DonloadUrl)
            exit()
        }
    }))
    dialog = builder.create();
    dialog.show();
    dialog.getButton(android.app.AlertDialog.BUTTON_POSITIVE).setTextColor(android.graphics.Color.BLUE);
} else {
    CustomToast.show(`当前是最新版本 ${CurrentVersion}`)
}


// 设置UI布局
ui.layout(`
    <vertical>
        <appbar>
            <toolbar id="toolbar" title="欢迎使用" />
        </appbar>
        <frame id="content" layout_weight="1">
            <vertical id="page1">
                ${homePage.layout}
            </vertical>
            <vertical id="page2" visibility="gone">
                ${statisticsPage.layout}
            </vertical>
            <vertical id="page3" visibility="gone">
                ${ProfilePage()}
            </vertical>
        </frame>
        ${NavigationBar()}
    </vertical>
`);

// 设置事件处理
homePage.setupEvents(ui, configManager,CustomToast);
statisticsPage.setupEvents(ui, configManager);

// 添加导航栏事件处理
ui.tab1.on("click", () => {
    updateTabColors(0);
    showPage(0);
});

ui.tab2.on("click", () => {
    updateTabColors(1);
    showPage(1);
});

ui.tab3.on("click", () => {
    updateTabColors(2);
    showPage(2);
});

// 更新标签页颜色
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

// 显示对应的页面
function showPage(index) {
    const pages = [ui.page1, ui.page2, ui.page3];
    pages.forEach((page, i) => {
        page.attr("visibility", i === index ? "visible" : "gone");
    });
}

// 初始化显示第一个标签页
updateTabColors(0);
showPage(0);

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
