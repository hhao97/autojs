// 直接使用全局主题变量
module.exports = function Card(title, content) {
    return `
        <card cardBackgroundColor="${global.theme.colors.white}" 
              margin="${global.theme.card.margin}" 
              cardElevation="${global.theme.card.elevation}" 
              cardCornerRadius="${global.theme.card.cornerRadius}">
            <vertical>
                <horizontal bg="${global.theme.colors.primary}" gravity="center" padding="${global.theme.padding.small}">
                    <text text="${title}" textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.white}" />
                </horizontal>
                ${content}
            </vertical>
        </card>
    `;
}; 