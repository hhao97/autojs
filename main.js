launchApp("小红书");
sleep(getRandomInt(2000, 5000));


console
    .setSize(0.8, 0.3)
    .setPosition(0.02, 0.001)
    .setTitle('日志')
    .setTitleTextSize(10)
    .setContentTextSize(10)
    .setBackgroundColor('#80000000')
    .setTitleBackgroundAlpha(0.8)
    .setContentBackgroundAlpha(0.5)
    .setExitOnClose(6e3)
    .setTouchable(false)
    .show();

var count = 300;


main();

function main() {
    try {
        while (count--) {
            if (count <= -3) {
                break;
            }
            // 下滑操作
            swipe(device.width / getRandomFloat(1, 4), device.height * getRandomFloat(0.7, 0.9), device.width / getRandomFloat(1, 4), device.height * getRandomFloat(0.1, 0.3), getRandomInt(500, 1000));
            sleep(getRandomInt(2000, 5000));

            let notes = className("android.widget.FrameLayout")
                .find();

            let filteredNotes = notes.filter(function (note) {
                return note.desc() && note.desc().includes("笔记");
            });

            let textNote = filteredNotes.map(function (note) {
                return parseNoteDesc(note.desc(), note.center());
            });

            textNote = textNote.filter(function (note) {
                return note !== null;
            });

            console.log(`找到笔记 ${textNote.length}条`);
            if (textNote.length > 0) {
                enterNote(textNote[getRandomInt(0, textNote.length - 1)]);

                getGoBackByNote();
                swipeDown();
            }
        }
    } catch (e) {
        console.log("脚本出错：" + e);
    }
}



/**
 * 进入图文笔记
 */
function enterNote(textNote) {
    console.log(`点击笔记 ${JSON.stringify(textNote)} x:${textNote.center.x} y:${textNote.center.y}`);
    press(textNote.center.x, textNote.center.y, getRandomInt(100, 300))
    sleep(getRandomInt(2000, 3000));

    let noteText = className("android.widget.TextView").find();
    let length = noteText.length;

    let noteObj = {
        author: noteText[0].text(),
        title: noteText[2].text() == '试试文字发笔记' ? noteText[4].text() : noteText[2].text(),
        content: noteText[3].text() == '去发布' ? noteText[5].text() : noteText[3].text(),
        commentCount: noteText[length - 1].text(),
        likeCount: noteText[length - 3].text(),
        collectCount: noteText[length - 2].text(),
        commentCenter: noteText[length - 1].center(),
        likeCenter: noteText[length - 3].center(),
        collectCenter: noteText[length - 2].center()
    }

    console.log(`笔记内容：${JSON.stringify(noteObj)}`);

    for (let i = 0; i < 3; i++) {
        randomExcute(50, swipeLeft);
        randomExcute(50, swipeRight);
    }

    for (let i = 0; i < 10; i++) {
        randomExcute(50, swipeDown);
    }
}

function randomExcute(rate, func) {
    if (hitProbability(rate)) {
        func();
    }
}


/**
 * 生成指定范围内的随机整数
 * @param {number} min 最小值（包含）
 * @param {number} max 最大值（包含）
 * @returns {number} 生成的随机整数
 */
function getRandomInt(min, max) {
    // 检查输入参数是否有效
    if (typeof min !== 'number' || typeof max !== 'number') {
        return NaN; // 返回 NaN 表示无效输入
    }

    // 确保 min 小于等于 max
    if (min > max) {
        [min, max] = [max, min]; // 交换 min 和 max 的值
    }

    // 生成随机整数
    min = Math.ceil(min); // 将 min 向上取整
    max = Math.floor(max); // 将 max 向下取整
    let random = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`等待：${random}`);
    return random;
}


/**
 * 生成指定范围内的随机小数
 * @param {number} min 最小值（包含）
 * @param {number} max 最大值（包含）
 * @returns {number} 生成的随机小数
 */
function getRandomFloat(min, max) {
    // 检查输入参数是否有效
    if (typeof min !== 'number' || typeof max !== 'number') {
        return NaN; // 返回 NaN 表示无效输入
    }

    // 确保 min 小于等于 max
    if (min > max) {
        [min, max] = [max, min]; // 交换 min 和 max 的值
    }

    // 生成随机小数
    return Math.random() * (max - min) + min;
}




function parseNoteDesc(desc, center) {
    // 使用正则表达式提取信息
    const regex = /^(笔记)\s+(.+?)\s+来自(.+?)\s+(\d+)赞$/;
    const match = desc.match(regex);

    if (match) {
        return {
            noteType: match[1],
            noteTitle: match[2],
            noteAuthor: match[3],
            likeCount: parseInt(match[4]),
            center: center
        };
    } else {
        return null; // 如果解析失败，返回 null
    }
}

/**
 * 获取笔记返回按钮 
 * @returns 笔记返回按钮
 */
function getGoBackByNote() {
    let goBack = className('android.widget.Button').find();
    let filteredNotes = goBack.filter(function (note) {
        // 检查 note 是否有 desc 属性，并且 desc 包含 "笔记"
        return note.desc() && note.desc().includes("返回") && note.center().x == 45.0;
    });
    if (filteredNotes.length > 0) {
        console.log(`找到返回按钮 x:${filteredNotes[0].center().x} y:${filteredNotes[0].center().y}`);
        if (filteredNotes[0]) {
            console.log(`点击返回按钮`);
            press(filteredNotes[0].center().x, filteredNotes[0].center().y, 100)
        }
    }
    return null;
}


function swipeLeft() {
    sleep(getRandomInt(2000, 5000));
    // 获取屏幕宽度和高度
    let screenWidth = device.width;
    let screenHeight = device.height;

    // 计算滑动起始和结束坐标
    let startX = screenWidth * 0.9; // 屏幕右侧偏左的位置
    let startY = screenHeight * 0.3; // 屏幕中间偏上的位置
    let endX = screenWidth * 0.1; // 屏幕左侧偏右的位置
    let endY = startY; // 保持 Y 坐标不变，实现水平滑动

    // 执行滑动操作
    swipe(startX, startY, endX, endY, getRandomInt(800, 1000)); // 500 是滑动持续时间，单位为毫秒
    sleep(getRandomInt(2000, 5000));
}

function swipeRight() {
    sleep(getRandomInt(2000, 5000));
    // 获取屏幕宽度和高度
    let screenWidth = device.width;
    let screenHeight = device.height;

    // 计算滑动起始和结束坐标
    let startX = screenWidth * 0.1; // 屏幕左侧偏右的位置
    let startY = screenHeight * 0.3; // 屏幕中间偏上的位置
    let endX = screenWidth * 0.9; // 屏幕右侧偏左的位置
    let endY = startY; // 保持 Y 坐标不变，实现水平滑动

    // 执行滑动操作
    swipe(startX, startY, endX, endY, getRandomInt(800, 1000)); // 500 是滑动持续时间，单位为毫秒
    sleep(getRandomInt(2000, 5000));
}

function swipeDown() {
    sleep(getRandomInt(2000, 5000));
    swipe(device.width / getRandomFloat(1, 4), device.height * getRandomFloat(0.7, 0.9), device.width / getRandomFloat(1, 4), device.height * getRandomFloat(0.1, 0.3), getRandomInt(500, 1000));
    sleep(getRandomInt(2000, 5000));
}


/**
 *  读取文本中的数字
 * @param {文本} text 
 * @returns 
 */
function extractNumber(text) {
    // 使用正则表达式匹配所有数字
    const matches = text.match(/\d+/g);

    // 如果找到匹配项，则返回第一个匹配项（假设只有一个数字）
    if (matches && matches.length > 0) {
        return parseInt(matches[0]);
    }

    // 如果没有找到匹配项，则返回 null 或 NaN，具体取决于您的需求
    return null; // 或者 NaN
}



function hitProbability(probability) {

    // 处理边界情况
    if (probability === 0) return false;
    if (probability === 100) return true;

    // 生成 0 到 100 之间的随机数（包含 0，不包含 100）
    const randomValue = Math.random() * 100;

    let flag = false;
    // 检查是否命中
    flag = randomValue < probability
    console.log(`命中概率：${probability} 结果：${flag}`);

    return flag;
}