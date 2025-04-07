"ui";

const CustomToast = require("./common/custom-toast.js");
var rednote = require('./小红书养号.js');


var color = "#02685B";
var config = {
    app: "小红书",
    // 用户评论点赞概率
    userCommentLikeRate: '50',
    // 作品点赞概率
    commentLikeRate: '50',
    // 评论概率
    commentRate: '50',
    // deepseek ai 评论 key
    dsKey: 'sk-3c15ee56adce455daa553784b251fe4a',
    prompt: '你是一个评论机器人，我发你内容你评论。每次评论不能超过 30 个字，不能有产品推荐等任何营销性质的评论，你的回复应该是从普通用户考虑，你的回复不能让别人看出你是ai 评论，所以评论的时候需要利己一点，评论的内容不需要排版,不能用换行符。你的人物设定： 28 岁，女 。',
    // 脚本允许时长(分钟)
    taskRuntime: '10',
    searchKey: '省钱|好物|母婴|生娃|育儿|怀孕',
    endTime: ''
}


ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="欢迎使用" />
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                <frame bg='#eee'>
                    <ScrollView>
                        <vertical paddingBottom='30'>
                            <card cardBackgroundColor='#fff' margin="15" cardElevation='10' cardCornerRadius='10'>
                                <vertical>
                                    <horizontal bg='{{color}}' gravity="center" padding='5'>
                                        <text text="应用选择" textSize="14sp" textColor='#fff' />
                                    </horizontal>

                                    <horizontal padding='10 5' gravity='center_vertical'>
                                        <text text="小红书" textSize="14sp" textColor='#000' />
                                        <text text="" layout_weight='1' />
                                        <radio checked='true' tint='{{color}}' />
                                    </horizontal>
                                </vertical>

                            </card>

                            <card cardBackgroundColor='#fff' margin="15 10" cardElevation='10' cardCornerRadius='10'>
                                <vertical>
                                    <horizontal bg='{{color}}' gravity="center" padding='5'>
                                        <text text="基本参数" textSize="14sp" textColor='#fff' />
                                    </horizontal>

                                    <horizontal padding='10 0' gravity='center_vertical'>
                                        <text text="运行时长" textSize="14sp" textColor='#333' />
                                        <text text="" layout_weight='1' />
                                        <horizontal>
                                            <input id='运行时长' text='{{config.taskRuntime}}' inputType="number" textSize='14sp' /><text text='分钟' textSize='14sp' textColor='#333' />
                                        </horizontal>
                                    </horizontal>

                                    <horizontal padding='8 0 ' marginTop='5' marginBottom='5'>
                                        <frame w="*" h="1" bg='#eee' gravity="center"  ></frame>
                                    </horizontal>

                                    <vertical padding='10 0' gravity='center_vertical'>
                                        <text text="DeepSeek AI 评论 KEY" textSize="14sp" textColor='#333' />
                                        <input text='{{config.dsKey}}' singleLine="true" textSize='14sp' textColor='#333' />
                                    </vertical>

                                    <horizontal padding='8 0 ' marginTop='5' marginBottom='5'>
                                        <frame w="*" h="1" bg='#eee' gravity="center"  ></frame>
                                    </horizontal>

                                    <vertical padding='10 0' gravity='center_vertical'>
                                        <text text="DeepSeek 提示词" textSize="14sp" textColor='#333' />
                                        <input text='{{config.prompt}}' singleLine="false" textSize='14sp' textColor='#333' />
                                    </vertical>

                                    <horizontal padding='8 0 ' marginTop='5' marginBottom='5'>
                                        <frame w="*" h="1" bg='#eee' gravity="center"  ></frame>
                                    </horizontal>

                                    <vertical padding='10 0' gravity='center_vertical'>
                                        <text text="搜索词(不填则刷首页推荐" textSize="14sp" textColor='#333' />
                                        <input text='{{config.searchKey}}' singleLine="false" textSize='14sp' textColor='#333' />
                                    </vertical>

                                </vertical>

                            </card>

                            <card cardBackgroundColor='#fff' margin="15 10" cardElevation='10' cardCornerRadius='10'>
                                <vertical>
                                    <horizontal bg='{{color}}' gravity="center" padding='5'>
                                        <text text="概率设置" textSize="14sp" textColor='#fff' />
                                    </horizontal>

                                    <vertical padding='10 0' gravity='center_vertical' marginTop='10'>
                                        <horizontal>
                                            <text text="作品点赞概率" textSize="14sp" textColor='#333' />
                                            <text layout_weight='1'></text>
                                            <text text="{{config.commentRate}}%" id='rateProgress'></text>
                                        </horizontal>
                                        <seekbar id='rateSeekbar' max='100' progress='{{config.commentRate}}' color='{{color}}' />
                                    </vertical>

                                    <horizontal padding='8 0 ' marginTop='5' marginBottom='5'>
                                        <frame w="*" h="1" bg='#eee' gravity="center"  ></frame>
                                    </horizontal>

                                    <vertical padding='10 0' gravity='center_vertical'>
                                        <horizontal>
                                            <text text="评论点赞概率" textSize="14sp" textColor='#333' />
                                            <text layout_weight='1'></text>
                                            <text text="{{config.commentLikeRate}}%" id='rateUserProgress'></text>
                                        </horizontal>
                                        <seekbar id='rateUserSeekbar' max='100' progress='{{config.userCommentLikeRate}}' color='{{color}}' />
                                    </vertical>

                                    <horizontal padding='8 0 ' marginTop='5' marginBottom='5'>
                                        <frame w="*" h="1" bg='#eee' gravity="center"  ></frame>
                                    </horizontal>

                                    <vertical padding='10 0' gravity='center_vertical'>
                                        <horizontal>
                                            <text text="作品评论概率" textSize="14sp" textColor='#333' />
                                            <text layout_weight='1'></text>
                                            <text text="{{config.commentRate}}%" id='rateNoteProgress'></text>
                                        </horizontal>
                                        <seekbar id='rateNoteSeekbar' max='100' progress='{{config.commentRate}}' color='{{color}}' />
                                    </vertical>
                                </vertical>
                            </card>

                            <vertical>
                                <frame id="startBtn" w="*" margin="16" gravity="center">
                                    <text padding='20 10' id="startBtnText" text="开始" gravity="center" textColor="white" textSize="16sp" />
                                </frame>
                            </vertical>
                            <vertical>
                                <frame id="endBtn" w="*" margin="16 8" gravity="center">
                                    <text padding='20 10' text="结束" gravity="center" textColor="white" textSize="16sp" />
                                </frame>
                            </vertical>
                        </vertical>
                    </ScrollView>
                </frame>

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
                <horizontal bg="?selectableItemBackground" w="*" gravity='center' marginBottom='10'>
                    <horizontal>
                        <img w="50" h="50" padding="16" src="{{this.icon}}" tint="{{color}}" />
                        <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center" />
                    </horizontal>
                    <text layout_weight='1'></text>
                    <horizontal>
                        <switch checked="{{this.checked}}" id='{{this.id}}'></switch>
                    </horizontal>
                </horizontal>
            </list>
        </vertical>
    </drawer>
);

let gradientDrawable = new android.graphics.drawable.GradientDrawable();
gradientDrawable.setColor(android.graphics.Color.parseColor(color));
gradientDrawable.setCornerRadius(25);
let gradientDrawableRed = new android.graphics.drawable.GradientDrawable();
gradientDrawableRed.setColor(android.graphics.Color.parseColor('#999999'));
gradientDrawableRed.setCornerRadius(25);


// 将圆角背景应用到按钮
ui.startBtn.setBackground(gradientDrawable);
ui.endBtn.setBackground(gradientDrawableRed);



var thread = undefined;

ui.运行时长.on("textChanged", function (text, oldText, view) {
    console.log("文本从 " + oldText + " 变为 " + text);
});

// 设置按钮点击事件
ui.startBtn.on("click", () => {
    if (thread) {
        return
    }

    config.taskRuntime = $ui.运行时长.text();

    config.endTime = calculateFutureTime(config.taskRuntime);
    CustomToast.show('脚本结束时间: ' + config.endTime)

    console.log(`脚本执行时间 ${config.taskRuntime} 分`)
    ui.startBtnText.setText('执行中...')
    thread = threads.start(function () {
        //程序开始运行之前判断无障碍服务
        if (auto.service == null) {
            CustomToast.show("请先开启无障碍服务！");
            return;
        }

        console
            .setSize(0.8, 0.3)
            .setPosition(0.02, 0.001)
            .setTitle('日志(加音量键可开关日志浮窗)')
            .setTitleTextSize(10)
            .setContentTextSize(10)
            .setBackgroundColor('#80000000')
            .setTitleBackgroundAlpha(0.8)
            .setContentBackgroundAlpha(0.5)
            .setExitOnClose(6e3)
            .setTouchable(false)
            .show();

        rednote.run(config);
    });


    const timeout = parseInt(config.taskRuntime) * 60 * 1000;

    let timer = setTimeout(() => {
        thread.interrupt();
        thread = undefined;
        ui.startBtnText.setText('开始');
        console.hide();
        CustomToast.show("自动程序已关闭",8000);
    }, timeout);
});



function calculateFutureTime(minutes) {
    // 获取当前时间
    const now = new Date();

    // 将分钟数转换为毫秒
    const millisecondsToAdd = minutes * 60 * 1000;

    // 计算未来的时间
    const futureTime = new Date(now.getTime() + millisecondsToAdd);

    // 格式化日期和时间
    const year = futureTime.getFullYear();
    const month = String(futureTime.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
    const day = String(futureTime.getDate()).padStart(2, '0');
    const hours = String(futureTime.getHours()).padStart(2, '0');
    const minutesFormatted = String(futureTime.getMinutes()).padStart(2, '0');
    const seconds = String(futureTime.getSeconds()).padStart(2, '0');

    // 返回格式化的日期和时间字符串
    return `${year}-${month}-${day} ${hours}:${minutesFormatted}:${seconds}`;
}

ui.endBtn.on("click", () => {
    if (thread) {
        ui.startBtnText.setText('开始')
        thread.interrupt();
        thread = undefined;
    }
});

ui.rateSeekbar.setOnSeekBarChangeListener({
    onProgressChanged: function (seekbar, p, fromUser) {
        ui.rateProgress.setText(`${p}%`);
    }
});

ui.rateNoteSeekbar.setOnSeekBarChangeListener({
    onProgressChanged: function (seekbar, p, fromUser) {
        ui.rateNoteProgress.setText(`${p}%`);
    }
});

ui.rateUserSeekbar.setOnSeekBarChangeListener({
    onProgressChanged: function (seekbar, p, fromUser) {
        ui.rateUserProgress.setText(`${p}%`);
    }
});


//创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu => {
    menu.add("设置");
    menu.add("关于");
});

//监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item) => {

    switch (item.getTitle()) {
        case "设置":
            console.launch();
            break;
        case "关于":
            CustomToast.show('show')
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);

//设置滑动页面的标题
ui.viewpager.setTitles(["养号模式", "开发中", "开发中"]);
//让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);

//让工具栏左上角可以打开侧拉菜单
ui.toolbar.setupWithDrawer(ui.drawer);



let menuItems = [
    { title: "无障碍服务", id: '无障碍服务', checked: auto.service, icon: "@drawable/ic_android_black_48dp" },
    { title: "日志窗口", id: '日志窗口', checked: console.isShowing(), icon: "@drawable/ic_android_black_48dp" },
];


// $ui.post(() => {
//     ui.无障碍服务.on("check", function (checked) {
//         // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
//         if (checked && auto.service == null) {
//             app.startActivity({
//                 action: "android.settings.ACCESSIBILITY_SETTINGS"
//             });
//             CustomToast.show("请开启无障碍服务");
//         }
//         if (!checked && auto.service != null) {
//             auto.service.disableSelf();
//         }
//     });

//     ui.日志窗口.on("check", function (checked) {
//         if (checked) {
//             console
//                 .setSize(0.8, 0.3)
//                 .setPosition(0.02, 0.001)
//                 .setTitle('日志(加音量键可开关日志浮窗)')
//                 .setTitleTextSize(10)
//                 .setContentTextSize(10)
//                 .setBackgroundColor('#80000000')
//                 .setTitleBackgroundAlpha(0.8)
//                 .setContentBackgroundAlpha(0.5)
//                 .setExitOnClose(6e3)
//                 .setTouchable(false)
//                 .show();
//         } else {
//             console.hide();
//         }
//     });

//     ui.emitter.on("resume", function () {
//         ui.无障碍服务.checked = auto.service != null;
//         ui.日志窗口.checked = console.isShowing()
//     });
// }, 1000);

// console.log(`无障碍服务`, auto.service != null)
// events.observeKey();
// events.setTouchEventTimeout(3000)



// events.on('volume_down', () => {
//     console.hide();
//     if (thread && thread.isAlive()) {
//         thread.interrupt()
//     }
//     exit();
// });


ui.menu.setDataSource(menuItems.map(item => {
    let menuItem = {
        id: item.id,
        title: item.title,
        checked: item.checked
    };
    if (item.icon) {
        menuItem.icon = item.icon;
    }
    return menuItem;
}));


ui.menu.on("item_click", item => {
    switch (item.title) {
        case "退出":
            ui.finish();
            break;
    }
})
