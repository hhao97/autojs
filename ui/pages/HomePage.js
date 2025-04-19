const Card = require('../components/Card');
const UtilTime = require('../utils/time')

const thread =undefined;
module.exports = function HomePage(config, onConfigChange) {
    // 创建UI布局
    const layout = `
        <vertical padding="16">
            <horizontal gravity="center" marginBottom="16">
                <text id="tab1" text="小红书" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.primary}" padding="8" />
                <text id="tab2" text="抖音" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.secondary}" padding="8" />
                <text id="tab3" text="快手" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.secondary}" padding="8" />
                <text id="tab4" text="微信" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.secondary}" padding="8" />
            </horizontal>
            <frame id="content" layout_weight="1">
                <vertical id="page1">
                    <text text="小红书内容" textSize="${global.theme.text.size.large}" textColor="${global.theme.colors.text.primary}" />
                    <!-- 其他小红书相关的内容 -->
                </vertical>
                <vertical id="page2" visibility="gone">
                    <text text="抖音内容" textSize="${global.theme.text.size.large}" textColor="${global.theme.colors.text.primary}" />
                    <!-- 其他抖音相关的内容 -->
                </vertical>
                <vertical id="page3" visibility="gone">
                    <text text="快手内容" textSize="${global.theme.text.size.large}" textColor="${global.theme.colors.text.primary}" />
                    <!-- 其他快手相关的内容 -->
                </vertical>
                <vertical id="page4" visibility="gone">
                    <text text="微信内容" textSize="${global.theme.text.size.large}" textColor="${global.theme.colors.text.primary}" />
                    <!-- 其他微信相关的内容 -->
                </vertical>
            </frame>
        </vertical>
    `;

    // 返回布局和事件处理函数
    return {
        layout: layout,
        setupEvents: function(ui, configManager) {
            // 设置群口令的值
            ui.post(() => {
                ui.群口令.setText(config.groupLink);
            });

            // 搜索词输入监听
            ui.搜索词.addTextChangedListener(new android.text.TextWatcher({
                afterTextChanged: function(s) {
                    config.searchKey = s;
                    configManager.update(config);
                },
                beforeTextChanged: function(s, start, count, after) {},
                onTextChanged: function(s, start, before, count) {}
            }));

            // 群口令输入监听
            ui.群口令.addTextChangedListener(new android.text.TextWatcher({
                afterTextChanged: function(s) {
                    config.groupLink = s;
                    configManager.update(config);
                },
                beforeTextChanged: function(s, start, count, after) {},
                onTextChanged: function(s, start, before, count) {}
            }));

            // 提示词输入监听
            ui.提示词.addTextChangedListener(new android.text.TextWatcher({
                afterTextChanged: function(s) {
                    config.prompt = s;
                    configManager.update(config);
                },
                beforeTextChanged: function(s, start, count, after) {},
                onTextChanged: function(s, start, before, count) {}
            }));

            // 运行时长输入监听
            ui.运行时长.on("textChanged", function(text) {
                config.taskRuntime = text;
                configManager.update(config);
            });

            // 概率设置监听
            ui.rateSeekbar.setOnSeekBarChangeListener({
                onProgressChanged: function(seekbar, p, fromUser) {
                    ui.rateProgress.setText(`${p}%`);
                    config.commentLikeRate = p;
                    configManager.update(config);
                }
            });

            ui.rateNoteSeekbar.setOnSeekBarChangeListener({
                onProgressChanged: function(seekbar, p, fromUser) {
                    ui.rateNoteProgress.setText(`${p}%`);
                    config.commentRate = p;
                    configManager.update(config);
                }
            });

            ui.rateUserSeekbar.setOnSeekBarChangeListener({
                onProgressChanged: function(seekbar, p, fromUser) {
                    ui.rateUserProgress.setText(`${p}%`);
                    config.userCommentLikeRate = p;
                    configManager.update(config);
                }
            });

            ui.插入群聊概率.setOnSeekBarChangeListener({
                onProgressChanged: function(seekbar, p, fromUser) {
                    ui.addGroupToCommentRate.setText(`${p}%`);
                    config.addGroupToCommentRate = p;
                    configManager.update(config);
                }
            });

            // 开始按钮点击事件
            ui.startBtn.on("click", () => {
                if (thread) {
                    return;
                }

                config.taskRuntime = ui.运行时长.text();
                config.prompt = ui.提示词.text();
                config.searchKey = ui.搜索词.text();

                configManager.update(config);

                config.endTime = UtilTime.calculateFutureTime(config.taskRuntime);
                CustomToast.show('脚本结束时间: ' + config.endTime);

                console.log(`脚本执行时间 ${config.taskRuntime} 分`);
                ui.startBtnText.setText('执行中...');
                thread = threads.start(function() {
                    //程序开始运行之前判断无障碍服务
                    if (auto.service == null) {
                        CustomToast.show("请先开启无障碍服务！");
                        return;
                    }

                    console
                        .setSize(0.8, 0.3)
                        .setPosition(0.02, 0.001)
                        .setTitle('日志')
                        .setTitleTextSize(10)
                        .setContentTextSize(10)
                        .setBackgroundColor('#80000000')
                        .setTitleBackgroundAlpha(0.8)
                        .setContentBackgroundAlpha(0.5)
                        .setExitOnClose(6e3)
                        .setTouchable(false)
                        .show();

                    if (!requestScreenCapture()) {
                        CustomToast.show("请求截图失败,请点允许");
                        return;
                    }

                    小红书.run(config);
                });

                const timeout = parseInt(config.taskRuntime) * 60 * 1000;

                let timer = setTimeout(() => {
                    thread.interrupt();
                    thread = undefined;
                    ui.startBtnText.setText('开始');
                    console.hide();
                    console.log("自动程序已关闭", 8000);
                    CustomToast.show("自动程序已关闭", 8000);
                }, timeout);
            });

            // 结束按钮点击事件
            ui.endBtn.on("click", () => {
                if (thread) {
                    ui.startBtnText.setText('开始');
                    thread.interrupt();
                    thread = undefined;
                }
            });

            // 设置标签页点击事件
            ui.tab1.on("click", () => {
                updateTabs(0);
                showPage(0);
            });

            ui.tab2.on("click", () => {
                updateTabs(1);
                showPage(1);
            });

            ui.tab3.on("click", () => {
                updateTabs(2);
                showPage(2);
            });

            ui.tab4.on("click", () => {
                updateTabs(3);
                showPage(3);
            });

            // 更新标签页颜色
            function updateTabs(activeTab) {
                const tabs = [ui.tab1, ui.tab2, ui.tab3, ui.tab4];
                const activeColor = global.theme.colors.primary;
                const inactiveColor = global.theme.colors.text.secondary;

                tabs.forEach((tab, index) => {
                    tab.attr("textColor", index === activeTab ? activeColor : inactiveColor);
                });
            }

            // 显示对应的页面
            function showPage(index) {
                const pages = [ui.page1, ui.page2, ui.page3, ui.page4];
                pages.forEach((page, i) => {
                    page.attr("visibility", i === index ? "visible" : "gone");
                });
            }

            // 初始化显示第一个页面
            updateTabs(0);
            showPage(0);
        }
    };
}; 