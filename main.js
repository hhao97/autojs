launchApp("小红书");
sleep(getRandomInt(5000, 8000));
var count = 3;

main();

function main() {
    try {
        while (count--) {
            if (count <= -3) {
                break;
            }
            // 下滑操作
            swipe(device.width / getRandomFloat(1,4), device.height * getRandomFloat(0.7,0.9), device.width / getRandomFloat(1,4), device.height * getRandomFloat(0.1,0.3), getRandomInt(500, 1000));
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
                return note !== null;});

            console.log(`找到笔记 ${textNote.length}条`);
            if (textNote.length > 0) {
                sleep(getRandomInt(2000, 5000));
                enterNote(textNote[0]);
                sleep(getRandomInt(2000, 5000));

                let goBack = getGoBackByNote();
                if (goBack) {
                    press(goBack.center().x, goBack.center().y, 100)
                }
                swipe(device.width / getRandomFloat(1,4), device.height * getRandomFloat(0.7,0.9), device.width / getRandomFloat(1,4), device.height * getRandomFloat(0.1,0.3), getRandomInt(500, 1000));
            }
        }
    } catch (e) {
        console.log("脚本出错：" + e);
    }
}



/**
 * 进入笔记
 */
function enterNote(textNote) {
    console.log(`点击笔记 ${JSON.stringify(textNote)} x:${textNote.center.x} y:${textNote.center.y}`);
    press(textNote.center.x, textNote.center.y, getRandomInt(100, 300))
    sleep(getRandomInt(2000, 5000));
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
    console.log(`生成随机数：${random}`);
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
        return filteredNotes[0];
    }
    return null;
}