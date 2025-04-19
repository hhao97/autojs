const Card = require('../components/Card');
const UtilTime = require('../utils/time')

const thread =undefined;
module.exports = function HomePage(config, onConfigChange) {
    // 创建UI布局
    const layout = `
        <frame bg="${global.theme.colors.background}">
            <ScrollView>
                <vertical paddingBottom="30">
                    ${Card("应用选择", `
                        <horizontal padding="10 5" gravity="center_vertical">
                            <text text="小红书" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                            <text text="" layout_weight="1" />
                            <radio checked="true" tint="${global.theme.colors.primary}" />
                        </horizontal>
                    `)}

                    ${Card("基本参数", `
                        <vertical>
                            <horizontal padding="10 0" gravity="center_vertical">
                                <text text="运行时长" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                <text text="" layout_weight="1" />
                                <horizontal>
                                    <input id="运行时长" text="${config.taskRuntime}" inputType="number" textSize="${global.theme.text.size.normal}" />
                                    <text text="分钟" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                </horizontal>
                            </horizontal>

                            <horizontal padding="8 0" marginTop="5" marginBottom="5">
                                <frame w="*" h="1" bg="${global.theme.colors.background}" gravity="center" />
                            </horizontal>

                            <vertical padding="10 0" gravity="center_vertical">
                                <text text="DeepSeek AI 评论 KEY" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                <input id="dsKey" text="${config.dsKey}" singleLine="true" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                            </vertical>

                            <horizontal padding="8 0" marginTop="5" marginBottom="5">
                                <frame w="*" h="1" bg="${global.theme.colors.background}" gravity="center" />
                            </horizontal>

                            <vertical padding="10 0" gravity="center_vertical">
                                <text text="DeepSeek 提示词" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                <input id="提示词" text="${config.prompt}" singleLine="false" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                            </vertical>

                            <horizontal padding="8 0" marginTop="5" marginBottom="5">
                                <frame w="*" h="1" bg="${global.theme.colors.background}" gravity="center" />
                            </horizontal>

                            <vertical padding="10 0" gravity="center_vertical">
                                <text text="搜索词(多个使用英文|分割，随机取值)" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                <input id="搜索词" text="${config.searchKey}" singleLine="false" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                            </vertical>
                        </vertical>
                    `)}

                    ${Card("概率设置", `
                        <vertical>
                            <vertical padding="10 0" gravity="center_vertical" marginTop="10">
                                <horizontal>
                                    <text text="作品点赞概率" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                    <text layout_weight="1"></text>
                                    <text text="${config.commentRate}%" id="rateProgress"></text>
                                </horizontal>
                                <seekbar id="rateSeekbar" max="100" progress="${config.commentRate}" color="${global.theme.colors.primary}" />
                            </vertical>

                            <horizontal padding="8 0" marginTop="5" marginBottom="5">
                                <frame w="*" h="1" bg="${global.theme.colors.background}" gravity="center" />
                            </horizontal>

                            <vertical padding="10 0" gravity="center_vertical">
                                <horizontal>
                                    <text text="评论点赞概率" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                    <text layout_weight="1"></text>
                                    <text text="${config.commentLikeRate}%" id="rateUserProgress"></text>
                                </horizontal>
                                <seekbar id="rateUserSeekbar" max="100" progress="${config.userCommentLikeRate}" color="${global.theme.colors.primary}" />
                            </vertical>

                            <horizontal padding="8 0" marginTop="5" marginBottom="5">
                                <frame w="*" h="1" bg="${global.theme.colors.background}" gravity="center" />
                            </horizontal>

                            <vertical padding="10 0" gravity="center_vertical">
                                <horizontal>
                                    <text text="作品评论概率" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                    <text layout_weight="1"></text>
                                    <text text="${config.commentRate}%" id="rateNoteProgress"></text>
                                </horizontal>
                                <seekbar id="rateNoteSeekbar" max="100" progress="${config.commentRate}" color="${global.theme.colors.primary}" />
                            </vertical>

                            <horizontal padding="8 0" marginTop="5" marginBottom="5">
                                <frame w="*" h="1" bg="${global.theme.colors.background}" gravity="center" />
                            </horizontal>

                            <vertical padding="10 0" gravity="center_vertical">
                                <horizontal>
                                    <text text="插入群聊(评论后)" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                    <text layout_weight="1"></text>
                                    <text text="${config.addGroupToCommentRate}%" id="addGroupToCommentRate"></text>
                                </horizontal>
                                <seekbar id="插入群聊概率" max="100" progress="${config.addGroupToCommentRate}" color="${global.theme.colors.primary}" />
                            </vertical>

                            <horizontal padding="8 0" marginTop="5" marginBottom="5">
                                <frame w="*" h="1" bg="${global.theme.colors.background}" gravity="center" />
                            </horizontal>

                            <vertical padding="10 0" gravity="center_vertical">
                                <horizontal>
                                    <text text="群口令" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                                    <text layout_weight="1"></text>
                                </horizontal>
                                <input id="群口令" hint="请输入群口令" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.primary}" />
                            </vertical>
                        </vertical>
                    `)}

                    <vertical>
                        <frame id="startBtn" w="*" margin="16" gravity="center">
                            <text padding="20 10" id="startBtnText" text="开始" gravity="center" textColor="${global.theme.colors.text.white}" textSize="${global.theme.text.size.large}" />
                        </frame>
                    </vertical>
                    <vertical>
                        <frame id="endBtn" w="*" margin="16 8" gravity="center">
                            <text padding="20 10" text="结束" gravity="center" textColor="${global.theme.colors.text.white}" textSize="${global.theme.text.size.large}" />
                        </frame>
                    </vertical>
                </vertical>
            </ScrollView>
        </frame>
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
        }
    };
}; 