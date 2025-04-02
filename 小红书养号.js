var count = 100;
var failCount = 0;
var errorCount = 3;

var config = {
    app: "小红书",
    // 用户评论点赞概率
    userCommentLikeRate: '50',
    // 作品点赞概率
    commentLikeRate: '50',
    // 评论概率
    commentRate: '50',
    // deepseek ai 评论 key
    dsKey: 'sk-3c15ee56adce455daa553784b251fe4a',
    prompt: '你是一个评论机器人，我发你内容你评论。每次评论不能超过 30 个字，不能有产品推荐等任何营销性质的评论，你的回复应该是从普通用户考虑，你的回复不能让别人看出你是ai 评论，所以评论的时候需要利己一点，评论的内容不需要排版。你的人物设定： 28 岁，女 。',
    // 脚本允许时长(分钟)
    taskRuntime: '10',
    searchKey: '省钱|好物|母婴|生娃|育儿|怀孕',
    endTime: ''
}

function main() {
    try {
        while (count--) {
            if (count <= -3 || failCount >= 10) {
                break;
            }

            console.log(`最大剩余次数：${count} 失败次数：${failCount} 结束时间 ${config.endTime}`);

            // 下滑操作
            swipeDown();
            swipeDown();
            swipeDown();

            let textNote = undefined;

            if (config.searchKey != '') {
                const searchKeys = config.searchKey.split('|')
                doSearch(searchKeys[getRandomInt(0, searchKeys.length - 1)]);
            }

            if (isHomePage()) {
                textNote = findRecommandTextNote();
            } else if (isSearchResultPage()) {
                textNote = findSearchTextNote();
            } else {
                console.log("暂不支持的页面，尝试返回");
                getGoBackByNote();
                failCount++;
                continue
            }

            console.log(`找到笔记 ${textNote.length}条`,);
            if (textNote.length > 0) {
                enterNote(textNote[getRandomInt(0, textNote.length - 1)]);

                getGoBackByNote();
                swipeDown();
            }
        }
    } catch (e) {
        console.log("脚本出错：", e, "当前运行错误次数", errorCount);
        if (errorCount > 0) {
            // main();
            errorCount--;
        }
    }
}



/**
 * 进入图文笔记
 */
function enterNote(textNote) {
    try {
        sleep(getRandomInt(2000, 3000));
        console.log(`列表页点击笔记 ${JSON.stringify(textNote)}`);
        press(textNote.center.x, textNote.center.y, getRandomInt(100, 300))
        sleep(getRandomInt(2000, 3000));

        if (isVideoNote()) {
            console.log(`视频笔记，跳过`);
            return
        }

        if (isTextNotePage) {
            let noteObj = getTextNoteContent();

            for (let i = 0; i < 10; i++) {
                randomExcute(50, swipeLeft, '左滑');
                randomExcute(50, swipeRight, '右滑');
            }

            for (let i = 0; i < 10; i++) {
                randomExcute(50, swipeDown, '下滑');
            }

            // ai 评论
            randomExcute(config.commentRate, doComment, 'ai 评论', noteObj);

            // 随机笔记点赞
            randomExcute(config.commentLikeRate, doLikeByNote, '笔记点赞', noteObj);

            // 随机用户评论点赞
            randomExcute(config.userCommentLikeRate, doLikeByUser, '点赞');

        } else {
            console.log(`不是图文笔记详情页,点击返回`);
            getGoBackByNote();
        }


    } catch (e) {
        console.log(`进入笔记出错`, e);
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

function randomExcute(rate, func, action, param) {
    if (hitProbability(rate, action)) {
        func(param);
    }

    if (isVideoNote()) {
        getGoBackByNote()
    }
}

function doComment(noteObj) {
    if (!isTextNotePage) {
        console.log(`不在笔记详情页不评论`, noteObj)
        return
    }

    if (!noteObj) {
        console.log(`笔记内容获取为空，不评论`, noteObj)
        return
    }
    let aiResult = callDeepSeek(`笔记标题：${noteObj.title} 笔记内容：${noteObj.content}`);

    let notes = className("android.widget.TextView")
        .find();
    let filteredNotes = notes.filter(function (note) {
        return note.desc() && note.desc().includes("评论框");
    });
    if (!filteredNotes && filteredNotes.length <= 0) {
        console.log("未找到评论框按钮")
        return
    }

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
            return
        }
    }

    console.log(`按下返回按钮`, back())
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
    if (flag) {
        console.log(`随机动作-${action} 执行 `);
    }

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
        "Authorization": `Bearer ${config.dsKey}`,
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
                "content": `${config.prompt}`
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
    let notes = className("android.widget.ImageView").desc('搜索')
        .exists();


    console.log(`是否是视频笔记`, notes)
    return notes
}

/**
 * 
 * @returns  是否是首页
 */
function isHomePage() {
    const requiredTexts = ["发现", "首页"];
    const notes = className("android.widget.TextView").find();
    const result = requiredTexts.every(text =>
        notes.some(note => note.text() === text)
    );

    console.log(`是否是首页`, result)
    return result;
}

/**
 * 
 * @returns 是否是搜索结果页
 */
function isSearchResultPage() {
    const notes = className("android.widget.TextView").text('筛选').exists();
    console.log(`是否是搜索结果页`, notes)
    return notes;
}

/**
 * 是否是图文笔记详情页
 */
function isTextNotePage() {
    const notes = className("android.widget.Button").desc("分享").exists();
    console.log(`是否是图文笔记详情页`, notes)
    return notes;
}

/**
 * 是否是消息列表页
 */
function isMessagePage() {
    return textContains('消息').exists() && textContains('发现群聊').exists()
}


/**
 * 给笔记点赞
 */
function doLikeByNote(noteObj) {
    if (isTextNotePage) {
        if (!noteObj) {
            noteObj = getTextNoteContent();
        }
        sleep(getRandomInt(2000, 3000));
        press(noteObj.likeCenter.x, noteObj.likeCenter.y, 100)
        console.log(`点赞笔记`, noteObj.likeCenter.x, noteObj.likeCenter.y);
    }
}

/**
 * 给用户点赞
 */
function doLikeByUser() {
    if (isTextNotePage) {
        sleep(getRandomInt(2000, 3000));
        const likeView = className("android.widget.ImageView").find();

        filteredNotes = likeView.filter(function (note) {
            return note.center().y < device.height * 0.6;
        });
        filteredNotes = findMostFrequentX(filteredNotes)
        if (filteredNotes.length > 0) {
            const randomIdx = getRandomInt(0, filteredNotes.length - 1);
            console.log(`找到点赞按钮`, filteredNotes[randomIdx].center().x, filteredNotes[randomIdx].center().y);
            sleep(getRandomInt(2000, 3000));
            press(filteredNotes[randomIdx].center().x, filteredNotes[randomIdx].center().y, 100)
        }
    }
}


/**
 * 找到评论区的点赞按钮
 */
function findMostFrequentX(filteredNotes) {
    if (isTextNotePage) {

        const xCounts = {};
        const xObjects = {};
        let maxCount = 0;
        let mostFrequentX = null;

        // 统计 x 值的计数，并存储每个 x 值对应的对象
        filteredNotes.forEach(obj => {
            const x = obj.center().x;
            xCounts[x] = (xCounts[x] || 0) + 1;
            xObjects[x] = obj; // 存储每个 x 值对应的对象
            if (xCounts[x] > maxCount) {
                maxCount = xCounts[x];
                mostFrequentX = x;
            }
        });

        // 创建一个数组，仅包含出现次数最多的对象
        const mostFrequentObjects = [];
        if (mostFrequentX !== null) {
            // 检查是否有任何 x 值出现超过一次
            if (maxCount > 1) {
                // 遍历 filteredNotes ,将出现次数最多的x值存储到数组
                filteredNotes.forEach(obj => {
                    const x = obj.center().x;
                    if (x === mostFrequentX) {
                        mostFrequentObjects.push(obj);
                    }
                })
            }
        }

        // // 输出结果
        // console.log('xCounts:', xCounts);
        // console.log('mostFrequentX:', mostFrequentX);
        // console.log('mostFrequentObjects:', mostFrequentObjects);

        //返回结果
        return mostFrequentObjects;
    }
}

/**
 * 发起搜索
 * @param {*} serachKey 
 */
function doSearch(serachKey) {
    if (isHomePage()) {
        const btn = className("android.widget.Button").find();
        const searchBtn = btn.filter(function (note) {
            return note.desc() && note.desc() == "搜索";
        });

        if (!searchBtn && searchBtn.length <= 0) {
            console.log('搜索按钮未找到')
        }

        press(searchBtn[0].center().x, searchBtn[0].center().y, 100)
        console.log(`点击搜索按钮`);
        sleep(getRandomInt(3000, 5000));

        const searchInput = className("android.widget.EditText").find();
        searchInput = searchInput.filter(function (note) {
            return note.text() && note.text().includes("搜索");
        });
        searchInput[0].setText(serachKey);
        console.log(`设置搜索内容：${serachKey}`);
        sleep(getRandomInt(3000, 5000));

        const doSearchBtn = className("android.widget.Button").find();

        const doSearchBtnT = doSearchBtn.filter(function (note) {
            return note.text() && note.text() == "搜索";
        });

        press(doSearchBtnT[0].center().x, doSearchBtnT[0].center().y, 300);
        console.log(`点击搜索按钮`);

        sleep(getRandomInt(3000, 5000));
    }
}


// module.exports = rednote;

// console.log(isHomePage());
// isSearchResultPage();
// isTextNotePage();
// isHomePage();
// isVideoNote();


getTextNoteContent();
// console.log(isVideoNote())
// getGoBackByNote()
// console.log(isTextNotePage());
// doLikeByUser()
// getGoBackByNote();

// isMessagePage();
// doLikeByNote();
// isTextNotePage()

// isVideoNote();

// launchApp('小红书');
// sleep(getRandomInt(5000, 8000));
// main();
// isMessagePage();

doLikeByUser();
// console.log(isMessagePage())
// var rednote = {}
// rednote.run = function (arg) {
//     config = arg;
//     console.log('参数配置:', config)
//     launchApp(config.app);
//     sleep(getRandomInt(5000, 8000));
//     main();
// }
