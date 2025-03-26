"ui";

var color = "#02685B";

var config = {
    // 用户评论点赞概率
    userCommentLikeRate: '90',
    // 作品点赞概率
    commentLikeRate: '90',
    // 评论概率
    commentRate: '90',
    // deepseek ai 评论 key
    dsKey: '',
    // 脚本允许时长
    runTime: 10
}

ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="示例" />
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                <frame bg='#eee'>
                    <ScrollView>
                        <vertical>
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
                                            <input text='10' inputType="number" textSize='14sp' /><text text='分钟' textSize='14sp' textColor='#333' />
                                        </horizontal>
                                    </horizontal>

                                    <horizontal padding='8 0 ' marginTop='5' marginBottom='5'>
                                        <frame w="*" h="1" bg='#eee' gravity="center"  ></frame>
                                    </horizontal>

                                    <vertical padding='10 0' gravity='center_vertical'>
                                        <text text="DeepSeek AI 评论 KEY" textSize="14sp" textColor='#333' />
                                        <input text='sk-3c15ee56adce455daa553784b251fe4a' singleLine="true" textSize='14sp' textColor='#333' />
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
                                        <seekbar id='rateSeekbar' max='100' progress='90' color='{{color}}' />
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
                                        <seekbar id='rateUserSeekbar' max='100' progress='90' color='{{color}}' />
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
                                        <seekbar id='rateNoteSeekbar' max='100' progress='90' color='{{color}}' />
                                    </vertical>
                                </vertical>
                            </card>
                        

                        <button text='开始' w='auto' layout_gravity='center|bottom' color='#fff' bg='{{color}}'  ></button>
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
            <img w="280" h="200" scaleType="fitXY" src="http://images.shejidaren.com/wp-content/uploads/2014/10/023746fki.jpg" />
            <list id="menu">
                <horizontal bg="?selectableItemBackground" w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" tint="{{color}}" />
                    <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center" />
                </horizontal>
            </list>
        </vertical>
    </drawer>
);

console.log()
const rateProgress = ui.rateSeekbar.getProgress();
ui.rateProgress.setText(`${rateProgress}%`);

ui.rateSeekbar.setOnSeekBarChangeListener({
    onProgressChanged: function (seekbar, p, fromUser) {
        ui.rateProgress.setText(`${p}%`);
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
            toast("还没有设置");
            break;
        case "关于":
            alert("关于", "Auto.js界面模板 v1.0.0");
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

ui.menu.setDataSource([
    {
        title: "选项一",
        icon: "@drawable/ic_android_black_48dp"
    },
    {
        title: "选项二",
        icon: "@drawable/ic_settings_black_48dp"
    },
    {
        title: "选项三",
        icon: "@drawable/ic_favorite_black_48dp"
    },
    {
        title: "退出",
        icon: "@drawable/ic_exit_to_app_black_48dp"
    }
]);

ui.menu.on("item_click", item => {
    switch (item.title) {
        case "退出":
            ui.finish();
            break;
    }
})
