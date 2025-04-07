"ui";
importClass(android.view.View);

ui.statusBarColor(colors.TRANSPARENT);
const resources = context.getResources();
const statusBarHeight = resources.getDimensionPixelSize(resources.getIdentifier('status_bar_height', 'dimen', 'android'));
const scale = resources.getDisplayMetrics().density;
var dp2px = dp => {
    return Math.floor(dp * scale + 0.5);
};
var px2dp = px => {
    return Math.floor(px / scale + 0.5);
};

var SystemUiVisibility = ve => {
    var option = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | (ve ? View.SYSTEM_UI_FLAG_LAYOUT_STABLE : View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
    activity.getWindow().getDecorView().setSystemUiVisibility(option);
};


var ButtonLayout = function() {
    importClass(android.graphics.Color);
    importClass("androidx.core.graphics.drawable.DrawableCompat");
    util.extend(ButtonLayout, ui.Widget);

    function ButtonLayout() {
        ui.Widget.call(this);
        this.defineAttr("leftDrawable", (view, attr, value, defineSetter) => {
            view.widget.mLeftDrawable = value;
            var lDrawable = context.getResources().getDrawable(getResourceID(value));
            lDrawable.setBounds(0, 0, view.widget.mLeftDrawableSize, view.widget.mLeftDrawableSize);
            let wrappedDrawable = DrawableCompat.wrap(lDrawable);
            DrawableCompat.setTint(wrappedDrawable, Color.parseColor("#FFFFFF"));
            view.setCompoundDrawables(lDrawable, null, null, null);
        });
    };
    ButtonLayout.prototype.mLeftDrawable = null;
    ButtonLayout.prototype.mLeftDrawableSize = dp2px(20);
    ButtonLayout.prototype.render = function() {
        return (
            <TextView   bg="?attr/selectableItemBackground"  gravity="left|center_vertical"     textColor="#FFFFFF"     textStyle="normal"      typeface="monospace"     padding="20 10"     drawablePadding="20" />
        );
    };

    function getResourceID(name) {
        var resource = context.getResources();
        return resource.getIdentifier(name, "drawable", context.getPackageName());
    };
    ui.registerWidget("button-layout", ButtonLayout);
    return ButtonLayout;
}();

ui.layout(
    <viewpager   id="viewpager"   bg="#426e6d"  >
        {/**drawer侧边栏 */}
        <relative    id="关闭侧面"   w="*"  clickable="true"   >
            <relative   id="drawerToolbar"   marginTop="10"   paddingTop="{{statusBarHeight}}px"  >
                <img    id="icon"    w="40"   h="40"   margin="20 0"   scaleType="fitXY"   circle="true"   src="https://pic.rmb.bdstatic.com/678bb17b2094432ef9e3d30019a3277e.jpeg" />
                <text   id="title"  layout_toRightOf="icon"  layout_alignParentTop="true"   w="auto"    h="auto"   text="Miroslava SavitsKaya"   textSize="16sp"   textStyle="bold"    textColor="#ffffff"  typeface="monospace" />
                <text    id="subtitle"    layout_below="title"    layout_toRightOf="icon"    w="auto"    h="auto"   text="Active status"   textSize="12sp"   textStyle="bold"   textColor="#7fffffff"   typeface="monospace" />
            </relative>
            
            <frame   id="drawerFrame"  layout_below="drawerToolbar"  layout_above="drawerHorizontal"   h="*"  >
                <list id="drawerList"  w="auto"  h="auto" padding="0 20" layout_gravity="center_vertical"  >
                    <button-layout   w="*"  text="{{this.text}}"  leftDrawable="{{this.drawable}}" />
                </list>
            </frame>
            
            <horizontal   id="drawerHorizontal"  paddingBottom="{{statusBarHeight}}px"  layout_alignParentBottom="true" >
                <button-layout  id="settingsBtn"   text="Sttings"   leftDrawable="ic_settings_black_48dp" />
                <View   bg="#ffffff"   w="2px"  h="16"  layout_gravity="center_vertical" />
                <button-layout  id="logBtn"   text="Log out"   drawablePadding="0" />
            </horizontal>
            
        </relative>
        
        {/**界面 */}
        <card   id="card"  cardElevation="0"   cardCornerRadius="0"  cardBackgroundColor="#FFFFFF" >
            <vertical >
                <toolbar w="*"   h="auto"  marginTop="10"   paddingTop="{{statusBarHeight}}px"   >
                    <text    w="*"  h="auto"    text="Se7en"     textSize="21sp"    textStyle="bold|italic"    textColor="#3f000000"    typeface="monospace"   gravity="center" />
                    <img   id="打开侧面"  w="40"   h="40"  margin="20 0"    scaleType="fitXY"  circle="true"   layout_gravity="right"  src="https://pic.rmb.bdstatic.com/678bb17b2094432ef9e3d30019a3277e.jpeg" />
                </toolbar>
                <card w="*"  h="*" marginTop="20"   marginBottom="-30" paddingBottom="30"   cardElevation="0dp"   cardCornerRadius="30dp" cardBackgroundColor="#f6f6f6"  >
                </card>
            </vertical>
        </card>
        
    </viewpager>
);


SystemUiVisibility(false);
ui.viewpager.overScrollMode = View.OVER_SCROLL_NEVER; //删除滑动到底的阴影
ui.viewpager.currentItem = 1; //跳转到1号子页面
ui.viewpager.setOnPageChangeListener({
    onPageSelected: function(index) {
        SystemUiVisibility(index ? false : true);
    }
});
ui.viewpager.setPageTransformer(true, new MyPageTransform()); //设置viewpager切换动画


var items = [{
        text: "Adoption",
        drawable: "ic_pets_black_48dp"
    },
    {
        text: "Donation",
        drawable: "ic_folder_shared_black_48dp"
    },
    {
        text: "Add pet",
        drawable: "ic_games_black_48dp"
    },
    {
        text: "Favorites",
        drawable: "ic_favorite_black_48dp"
    },
    {
        text: "Messages",
        drawable: "ic_email_black_48dp"
    },
    {
        text: "Profile",
        drawable: "ic_person_black_48dp"
    }
];
ui.drawerList.setDataSource(items);
ui.drawerList.overScrollMode = View.OVER_SCROLL_NEVER;
ui.drawerList.on("item_click", (item) => { //列表控件点击事件
    engines.execScript(
        "new Actvity",
        `'ui';var Config=engines.myEngine().execArgv;eval(Config.load)();`, {
            arguments: {
                load: newActivity.toString(),
                config: {
                    title: item.text
                }
            }
        }
    );
});

ui.settingsBtn.on("click", () => {
    toastLog("Settings");
});

ui.logBtn.on("click", () => {
    toastLog("Log out");
});


ui.关闭侧面.on("click", () => {
    ui.viewpager.currentItem = 1
    toastLog("关闭侧面")
});

ui.打开侧面.on("click", () => {
    ui.viewpager.currentItem = 0
    toastLog("打开侧面")
});

/**
 * 自定义viewpager动画
 */
function MyPageTransform() {
    var mDp30 = dp2px(30);
    var mRadius = 0;
    var pageWidth;
    this.transformPage = (function(view, position) {
        pageWidth = view.getWidth();
        if (position < -1) {
            view.setAlpha(0);
        } else if (position <= 0) {
            view.setTranslationX(pageWidth * position);
        } else if (position <= 1) {
            view.setTranslationX((pageWidth * 0.5) * -position);
            view.setScaleX(1 - (0.3 * position));
            view.setScaleY(1 - (0.3 * position));
            if (mRadius != parseInt(mDp30 * position)) { //圆角切换
                ui.card.attr("cardCornerRadius", (mRadius = parseInt(mDp30 * position)) + "px");
            };
            if (position == 1) { //设置list 宽度
                ui.drawerList.attr("w", parseInt(pageWidth * 0.65) + "px");
            };
        } else {
            view.setAlpha(0);
        }
    });
};



function newActivity() { //新界面
    ui.layout(
        <vertical>
            <appbar >
                <toolbar id="toolbar" title="{{Config.config.title}}" />
            </appbar>
            <vertical   h="*"  gravity="center_vertical">
                <text   h="auto"   text="new Actvity"  textSize="24sp"   gravity="center_horizontal" />
                <text     h="auto"     text="{{Config.config.title}}"      textSize="32sp"     textStyle="bold"   alpha="0.7"      gravity="center_horizontal" />
            </vertical>
        </vertical>
    );
    activity.setSupportActionBar(ui.toolbar);
    activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    ui.toolbar.setNavigationOnClickListener({
        onClick: function() {
            ui.finish();
        }
    });

}