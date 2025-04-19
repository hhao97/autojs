/**
 * 计算未来时间
 * @param {number} minutes 要增加的分钟数
 * @returns {string} 格式化后的时间字符串
 */
function calculateFutureTime(minutes) {
    const now = new Date();
    const future = new Date(now.getTime() + minutes * 60000);
    return formatDateTime(future);
}

/**
 * 格式化日期时间
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的时间字符串
 */
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
    calculateFutureTime,
    formatDateTime
}; 