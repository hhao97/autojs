const Card = require('../components/Card');

module.exports = function StatisticsPage() {
    const layout = `
        <frame bg="${global.theme.colors.background}">
            <vertical>
                <horizontal gravity="center" bg="${global.theme.colors.white}" elevation="2dp">
                    <text id="stats_tab1" text="今日数据" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.primary}" padding="16 8" />
                    <text id="stats_tab2" text="本周数据" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.secondary}" padding="16 8" />
                    <text id="stats_tab3" text="本月数据" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.secondary}" padding="16 8" />
                </horizontal>
                <frame id="stats_content" layout_weight="1">
                    <android.widget.HorizontalScrollView id="stats_scroll" w="*" h="*">
                        <horizontal id="stats_viewpager" w="*" h="*">
                            <frame id="stats_page1" w="*" h="*">
                                <vertical gravity="center" >
                                    <text text="今日数据" textSize="20sp" gravity="center" padding="16"/>
                                    <text text="123" textSize="16sp" gravity="center"/>
                                </vertical>
                            </frame>
                            <frame id="stats_page2" w="*" h="*">
                                <vertical gravity="center">
                                    <text text="本周数据" textSize="20sp" gravity="center" padding="16"/>
                                    <text text="123" textSize="16sp" gravity="center"/>
                                </vertical>
                            </frame>
                            <frame id="stats_page3" w="*" h="*">
                                <vertical gravity="center">
                                    <text text="本月数据" textSize="20sp" gravity="center" padding="16"/>
                                    <text text="123" textSize="16sp" gravity="center"/>
                                </vertical>
                            </frame>
                        </horizontal>
                    </android.widget.HorizontalScrollView>
                </frame>
            </vertical>
        </frame>
    `;

    return {
        layout: layout,
        setupEvents: function (ui, configManager) {
            const statsTabs = [ui.stats_tab1, ui.stats_tab2, ui.stats_tab3];
            const statsPages = [ui.stats_page1, ui.stats_page2, ui.stats_page3];
            const activeColor = global.theme.colors.primary;
            const inactiveColor = global.theme.colors.text.secondary;
            let currentPage = 0;
            let startX = 0;
            let currentX = 0;
            let isScrolling = false;

            // 初始化页面显示
            statsPages.forEach((page, index) => {
                if (index !== 0) {
                    page.attr("visibility", "gone");
                }
            });

            // 设置标签点击事件
            statsTabs.forEach((tab, index) => {
                tab.on("click", () => {
                    switchToPage(index);
                });
            });

            // 设置滑动事件
            ui.stats_scroll.on("touch_down", (e) => {
                startX = e.getX();
                currentX = e.getX();
                isScrolling = false;
            });

            ui.stats_scroll.on("touch_move", (e) => {
                currentX = e.getX();
                const diff = currentX - startX;
                if (Math.abs(diff) > 10) {
                    isScrolling = true;
                }
            });

            ui.stats_scroll.on("touch_up", (e) => {
                if (!isScrolling) return;
                
                const diff = currentX - startX;
                if (Math.abs(diff) > 100) { // 滑动距离超过100像素时切换页面
                    if (diff > 0 && currentPage > 0) {
                        // 向右滑动，切换到上一页
                        switchToPage(currentPage - 1);
                    } else if (diff < 0 && currentPage < statsPages.length - 1) {
                        // 向左滑动，切换到下一页
                        switchToPage(currentPage + 1);
                    }
                }
            });

            // 切换页面的函数
            function switchToPage(index) {
                currentPage = index;
                // 更新标签颜色
                statsTabs.forEach((t, i) => {
                    t.attr("textColor", i === index ? activeColor : inactiveColor);
                });
                // 更新页面显示
                statsPages.forEach((page, i) => {
                    page.attr("visibility", i === index ? "visible" : "gone");
                });
                // 滑动到对应页面
                ui.stats_scroll.scrollTo(index * ui.stats_scroll.getWidth(), 0);
            }
        }
    };
}; 