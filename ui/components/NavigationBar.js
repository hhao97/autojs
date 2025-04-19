module.exports = function NavigationBar() {
    return `
        <horizontal id="导航栏" bg="${global.theme.colors.white}" elevation="4dp">
            <vertical id="tab1" layout_weight="1" gravity="center" padding="8" w="*">
                <img w="24" h="24" src="@drawable/ic_home_black_48dp" tint="${global.theme.colors.primary}" />
                <text text="工具" textSize="12sp" textColor="${global.theme.colors.primary}" marginTop="4" gravity="center" />
            </vertical>
            <vertical id="tab2" layout_weight="1" gravity="center" padding="8" w="*" >
                <img w="24" h="24" src="@drawable/ic_android_black_48dp" tint="${global.theme.colors.text.secondary}" />
                <text text="开发中" textSize="12sp" textColor="${global.theme.colors.text.secondary}" marginTop="4" gravity="center" />
            </vertical>
            <vertical id="tab3" layout_weight="1" gravity="center" padding="8" w="*" >
                <img w="24" h="24" src="@drawable/ic_android_black_48dp" tint="${global.theme.colors.text.secondary}" />
                <text text="开发中" textSize="12sp" textColor="${global.theme.colors.text.secondary}" marginTop="4" gravity="center" />
            </vertical>
        </horizontal>
    `;
}; 