launchApp("小红书");
sleep(getRandomInt(5000, 8000));


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

var count = 30;

var failCount = 5;

function main() {
    try {
        while (count--) {
            if (count <= -3 || failCount <= 0) {
                break;
            }
            // 下滑操作
            swipeDown();
            let textNote = undefined;

            if (isHomePage()) {
                textNote = findRecommandTextNote();
            } else if (isSearchResultPage()) {
                textNote = findSearchTextNote();
            } else {
                console.log("暂不支持的页面，尝试返回");
                getGoBackByNote();
                failCount--;
                continue
            }

            // console.log("textNote--->", textNote);

            console.log(`找到笔记 ${textNote.length}条`,);
            if (textNote.length > 0) {
                enterNote(textNote[getRandomInt(0, textNote.length - 1)]);

                getGoBackByNote();
                swipeDown();
            }
        }
    } catch (e) {
        console.log("脚本出错：", e);
    }
}



/**
 * 进入图文笔记
 */
function enterNote(textNote) {
    sleep(getRandomInt(2000, 3000));
    console.log(`点击笔记 ${JSON.stringify(textNote)} x:${textNote.center.x} y:${textNote.center.y}`);
    press(textNote.center.x, textNote.center.y, getRandomInt(100, 300))
    sleep(getRandomInt(2000, 3000));

    if (isVideoNote()) {
        console.log(`视频笔记，跳过`);
        return
    }

    if (isTextNotePage) {
        let noteObj = getTextNoteContent();

        for (let i = 0; i < 2; i++) {
            randomExcute(50, swipeLeft, '左滑');
            randomExcute(50, swipeRight, '右滑');
        }

        for (let i = 0; i < 10; i++) {
            randomExcute(50, swipeDown, '下滑');
        }

        // ai 评论
        if (hitProbability(30, 'ai 评论')) {
            doComment(noteObj);
        }
    } else {
        console.log(`不是图文笔记详情页,点击返回`);
        getGoBackByNote();
    }


}

/**
 * 获取图文的正文和标题基础信息
 */
function getTextNoteContent() {
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

    if (noteObj.title.includes('/')) {
        return null;
    }

    console.log(`获取笔记内容：${JSON.stringify(noteObj)}`);
    return noteObj;
}

function randomExcute(rate, func, action) {
    if (hitProbability(rate, action)) {
        func();
    }
}

function doComment(noteObj) {
    if (!isTextNotePage) {
        return
    }

    if (!noteObj) {
        return
    }
    let aiResult = callDeepSeek(`笔记标题：${noteObj.title} 笔记内容：${noteObj.content}`);

    let notes = className("android.widget.TextView")
        .find();
    let filteredNotes = notes.filter(function (note) {
        return note.desc() && note.desc().includes("评论框");
    });

    console.log(`filnote`, filteredNotes[0].center().x, filteredNotes[0].center().y)
    press(filteredNotes[0].center().x, filteredNotes[0].center().y)
    sleep(getRandomInt(2000, 3000));

    let editText = className("android.widget.EditText").find();
    press(editText[0].center().x, editText[0].center().y)
    editText.setText(aiResult)

    sleep(getRandomInt(2000, 3000));

    let postView = className("android.widget.ImageView").find();
    console.log(`找到笔记`, device.width - postView[0].center().x, postView[0].center().y);
    press(device.width - postView[0].center().x, postView[0].center().y)
    sleep(getRandomInt(2000, 3000));
}


/**
 * 生成指定范围内的随机整数
 * @param {number} min 最小值（包含）
 * @param {number} max 最大值（包含）
 * @returns {number} 生成的随机整数
 */
function getRandomInt(min, max) {
    // 确保输入是有效的数字，并且最小值小于最大值
    if (typeof min !== 'number' || typeof max !== 'number' || min >= max) {
        return "输入无效";
    }

    // 确保最小值和最大值都是整数
    const roundedMin = Math.ceil(min);
    const roundedMax = Math.floor(max);

    // 生成随机整数
    const randomNumber = Math.floor(Math.random() * (roundedMax - roundedMin + 1)) + roundedMin;
    const result = Math.max(1, randomNumber);
    console.log(`生成随机数：${result}`);
    // 确保随机数是正数
    return result;
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
    sleep(getRandomInt(2000, 3000));
    let goBack = className('android.widget.Button').find();
    let filteredNotes = goBack.filter(function (note) {
        return note.desc() && note.desc().includes("返回");
    });

    if (filteredNotes.length == 0) {
        goBack = className('android.widget.ImageView').find();
        filteredNotes = goBack.filter(function (note) {
            return note.desc() && note.desc().includes("返回");
        });
    }

    if (filteredNotes.length > 0) {
        // console.log(`找到返回按钮 x:${filteredNotes[0].center().x} y:${filteredNotes[0].center().y}`);
        if (filteredNotes[0]) {
            console.log(`点击返回按钮`);
            press(filteredNotes[0].center().x, filteredNotes[0].center().y, 100)
        }
    }
    return null;
}


function swipeLeft() {
    if (!isTextNotePage()) {
        return
    }

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
}

function swipeRight() {
    if (!isTextNotePage()) {
        return
    }
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
}

function swipeDown() {
    sleep(getRandomInt(2000, 5000));
    swipe(device.width / getRandomFloat(1, 4), device.height * getRandomFloat(0.7, 0.9), device.width / getRandomFloat(1, 4), device.height * getRandomFloat(0.1, 0.3), getRandomInt(500, 1000));
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



function hitProbability(probability, action) {

    // 处理边界情况
    if (probability === 0) return false;
    if (probability === 100) return true;

    // 生成 0 到 100 之间的随机数（包含 0，不包含 100）
    const randomValue = Math.random() * 100;

    let flag = false;
    // 检查是否命中
    flag = randomValue < probability
    console.log(`随机动作-${action}：概率：${probability} 是否执行：${flag}`);

    return flag;
}

/**
 * 调用 ai 回复
 */
function callDeepSeek(content) {
    var url = "https://api.deepseek.com/chat/completions";
    // 定义请求头
    var headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk-3c15ee56adce455daa553784b251fe4a",
    };
    // 定义请求选项
    var options = {
        headers: headers,
        timeout: 20000 // 可选：设置超时时间(毫秒)
    };

    r = http.postJson(url, {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "system",
                "content": `你是一个评论机器人，我发你内容你评论。每次评论不能超过 30 个字，不能有产品推荐等任何营销性质的评论，你的回复应该是从普通用户考虑，你的回复不能让别人看出你是ai 评论，所以评论的时候需要利己一点。你的人物设定： 28 岁，女 。`
            },
            {
                "role": "user",
                "content": `${content}`
            }
        ],
        "stream": false
    }, options);

    console.log(`ai结果：`, r.body.string())

    var result = getContentFromJson(r.body.string());

    return result;
}

/**
 * 
 * @param {deepseek 返回结果} jsonString 
 * @returns 
 */
function getContentFromJson(jsonString) {
    try {
        // 将 JSON 字符串解析为 JavaScript 对象
        const jsonObject = JSON.parse(jsonString);

        // 访问 choices 数组中的第一个对象的 message 对象的 content 属性
        if (
            jsonObject &&
            jsonObject.choices &&
            jsonObject.choices.length > 0 &&
            jsonObject.choices[0].message &&
            jsonObject.choices[0].message.content
        ) {
            return jsonObject.choices[0].message.content;
        } else {
            return null; // 如果找不到 content 字段，则返回 null
        }
    } catch (error) {
        console.error("解析 JSON 字符串时出错:", error);
        return null; // 如果解析 JSON 字符串时出错，则返回 null
    }
}


/**
 * 
 * @returns 查询后的笔记筛选
 */
function findSearchTextNote() {
    let notes = className("android.widget.TextView")
        .find();

    let filteredNotes = notes.filter(function (note) {
        return note.text() && note.text().length >= 12;
    });
    filteredNotes = filteredNotes.filter(function (note) {
        return note.center().x < device.width * 0.8 && note.center().y < device.height * 0.8;
    });

    let textNote = filteredNotes.map(function (note) {
        return {
            noteTitle: note.text(),
            center: {
                x: note.center().x,
                y: note.center().y
            }
        };
    });

    // console.log(`笔记数量：`, textNote);
    return textNote;
}

/**
 * 
 * @returns 查询首页推荐栏目的图文笔记
 */
function findRecommandTextNote() {
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
    return textNote;
}

/**
 * 
 * @returns 是否是视频笔记
 */
function isVideoNote() {
    let notes = className("android.widget.ImageView")
        .find();

    let filteredNotes = notes.filter(function (note) {
        return note.desc() && note.desc().includes("搜索");
    });

    let result = filteredNotes != undefined && filteredNotes[0] != undefined && filteredNotes != null && filteredNotes[0] != null;
    if (result) {
        console.log(`视频笔记`);
    }
    return result
}

/**
 * 
 * @returns  是否是首页
 */
function isHomePage() {
    const requiredTexts = ["发现", "关注"];
    const notes = className("android.widget.TextView").find();
    const result = requiredTexts.every(text =>
        notes.some(note => note.text() === text)
    );
    if (result) {
        console.log(`首页`);
    }
    return result;
}

/**
 * 
 * @returns 是否是搜索结果页
 */
function isSearchResultPage() {
    const requiredTexts = ["搜索", "全部", "用户", "话题"];
    const notes = className("android.widget.TextView").find();

    const result = requiredTexts.every(text =>
        notes.some(note => note.text() === text)
    );
    if (result) {
        console.log(`搜索结果页`);
    }
    return result;
}

/**
 * 是否是图文笔记详情页
 */
function isTextNotePage() {
    const requiredTexts = ["分享"];
    const notes = className("android.widget.Button").find();
    const result = requiredTexts.every(text =>
        notes.some(note => note.desc() === text)
    );
    console.log(`是否是图文笔记详情页`, result)
    return result;
}


// console.log(isHomePage());
// console.log(isSearchResultPage());

// getTextNoteContent();
main();
// console.log(isVideoNote())
// getGoBackByNote()
// console.log(isTextNotePage());
