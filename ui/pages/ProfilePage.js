module.exports = function ProfilePage() {
    return `
        <frame bg="${global.theme.colors.background}">
            <vertical padding="16">
                <text text="个人中心" textSize="${global.theme.text.size.large}" textColor="${global.theme.colors.text.primary}" />
                <text text="功能开发中..." textSize="${global.theme.text.size.normal}" textColor="${global.theme.colors.text.secondary}" marginTop="16" />
            </vertical>
        </frame>
    `;
}; 