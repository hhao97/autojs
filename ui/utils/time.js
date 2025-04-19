// 计算未来时间
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

module.exports = {
    calculateFutureTime
}; 