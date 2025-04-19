// 主题配置
const theme = {
    colors: {
        primary: "#02685B",
        secondary: "#999999",
        background: "#eee",
        white: "#ffffff",
        text: {
            primary: "#333333",
            secondary: "#666666",
            white: "#ffffff"
        }
    },
    card: {
        margin: "15",
        elevation: "10",
        cornerRadius: "10"
    },
    text: {
        size: {
            small: "12sp",
            normal: "14sp",
            large: "16sp"
        }
    },
    padding: {
        small: "5",
        normal: "10",
        large: "15"
    }
};

// 导出获取主题的函数
module.exports = function() {
    return theme;
}; 