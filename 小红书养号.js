var count = 100;
var failCount = 0;
var rednote = {};
// var config = {
//   app: "小红书",
//   userCommentLikeRate: 70,
//   commentLikeRate: 53,
//   commentRate: 100,
//   addGroupToCommentRate: 100,
//   dsKey: "sk-3c15ee56adce455daa553784b251fe4a",
//   prompt:
//     "你是一个评论机器人，我发你内容你评论。每次评论不能超过 30 个字，不能有产品推荐等任何营销性质的评论，你的回复应该是从普通用户考虑，你的回复不能让别人看出你是ai 评论，所以评论的时候需要利己一点，评论的内容不需要排版,不能用换行符。你的人物设定： 28 岁，女 。",
//   url: "",
//   taskRuntime: 30,
//   searchKey: "省钱|好物|母婴|生娃|育儿",
//   endTime: "2025-04-19 18:24:42",
//   groupLink: "",
// };
var config = {
  gather: "0",
  prompt:
    "你是一个评论机器人，我发你内容你评论。每次评论不能超过 30 个字，不能有产品推荐等任何营销性质的评论，你的回复应该是从普通用户考虑，你的回复不能让别人看出你是ai 评论，所以评论的时候需要利己一点，评论的内容不需要排版,不能用换行符。你的人物设定： 28 岁，女 。",
  comment: "",
  gapTimes: "1000,3000",
  gapTimes1: "1000",
  gapTimes2: "3000",
  groupLink: "",
  serachKey: ["1", "2"],
  commentRate: 50,
  commentType: "2",
  scrollHNums: "3,10",
  scrollVNums: "3,10",
  scrollHNums1: "3",
  scrollHNums2: "10",
  scrollVNums1: "3",
  scrollVNums2: "10",
  commentLikeRate: 50,
  userCommentLikeRate: 50,
  addGroupToCommentRate: 0,
};

rednote.run = function () {
  console.log("参数配置:", config);
  launchApp(config.app);
  sleep(random(5000, 8000));
  main();
};

rednote.run();

function main() {
  try {
    //程序开始运行之前判断无障碍服务
    if (auto.service == null) {
      CustomToast.show("请先开启无障碍服务！");
      return;
    }

    console
      .setSize(0.8, 0.3)
      .setPosition(0.02, 0.001)
      .setTitle("日志")
      .setTitleTextSize(10)
      .setContentTextSize(10)
      .setBackgroundColor("#80000000")
      .setTitleBackgroundAlpha(0.8)
      .setContentBackgroundAlpha(0.5)
      .setExitOnClose(6e3)
      .setTouchable(false)
      .show();

    if (!requestScreenCapture()) {
      CustomToast.show("请求截图失败,请点允许");
      return;
    }

    while (count--) {
      console.log(
        `最大剩余次数：${count} 失败次数：${failCount} 结束时间 ${config.endTime}`
      );

      if (count <= -3 || failCount >= 10) {
        console.log("结束运行");
        break;
      }

      // 下滑操作
      for (let i = 0; i < 5; i++) {
        randomExcute(50, swipeDown, "下滑");
      }

      let textNote = undefined;

      if (config.searchKey && config.searchKey.length > 0) {
        doSearch(searchKeys[random(0, searchKeys.length - 1)]);
      }

      if (isHomePage()) {
        textNote = findRecommandTextNote();
      } else if (isSearchResultPage()) {
        for (let i = 0; i < 6; i++) {
          randomExcute(50, swipeDown, "下滑");
        }
        textNote = findSearchTextNote();
      } else {
        console.log("暂不支持的页面，尝试返回");
        getGoBackByNote();
        continue;
      }

      console.log(`找到笔记 ${textNote.length}条`);
      if (textNote.length > 0) {
        enterNote(textNote[random(0, textNote.length - 1)]);
        getGoBackByNote();
        swipeDown();
      }
    }
  } catch (e) {
    console.log("脚本出错：", e, "当前运行错误次数", failCount);
    if (failCount >= 0) {
      main();
      failCount++;
    }
  }
}

/**
 * 进入图文笔记
 */
function enterNote(textNote) {
  try {
    sleep(random(config.gapTimes[0], config.gapTimes[1]));
    console.log(`列表页点击笔记 ${JSON.stringify(textNote)}`);
    click(textNote.center.x, textNote.center.y);
    sleep(random(config.gapTimes[0], config.gapTimes[1]));

    if (isTextNotePage() && !isVideoNote()) {
      let noteObj = getTextNoteContent();

      for (let i = 0; i < 5; i++) {
        randomExcute(50, swipeLeft, "左滑");
        randomExcute(50, swipeRight, "右滑");
      }

      for (let i = 0; i < 10; i++) {
        randomExcute(50, swipeDown, "下滑");
      }

      // ai 评论
      randomExcute(config.commentRate, doComment, "ai 评论", noteObj);

      // 随机笔记点赞
      randomExcute(config.commentLikeRate, doLikeByNote, "笔记点赞", noteObj);

      // 随机用户评论点赞
      randomExcute(config.userCommentLikeRate, doLikeByUser, "点赞");
    }
  } catch (e) {
    console.log(`进入笔记出错`, e);
  }
}

/**
 * 获取图文的正文和标题基础信息
 */
function getTextNoteContent() {
  sleep(random(config.gapTimes[0], config.gapTimes[1]));

  let noteText = className("android.widget.TextView").find();
  let length = noteText.length;

  let content = className("android.widget.TextView").depth(15).find();
  let contents = content.map((e) => {
    return e.text() && e.text().replace(/[\r\n]+/g, "");
  });

  let noteObj = {
    author: noteText[0].text(),
    content: contents.join(),
    commentCount: noteText[length - 1].text(),
    likeCount: noteText[length - 3].text(),
    collectCount: noteText[length - 2].text(),
    commentCenter: noteText[length - 1].center(),
    likeCenter: noteText[length - 3].center(),
    collectCenter: noteText[length - 2].center(),
  };

  console.log(`获取笔记内容：${JSON.stringify(noteObj)}`);
  return noteObj;
}

function randomExcute(rate, func, action, param) {
  if (hitProbability(rate)) {
    var start = new Date().getTime();
    func(param);
    var end = new Date().getTime();
    console.log(
      `随机动作-${action} 执行-` + `${action} 耗时`,
      `${end - start}ms`
    );
  }
}

function doComment(noteObj) {
  if (!isTextNotePage()) {
    console.log(`不在笔记详情页不评论`, noteObj);
    return;
  }

  if (!noteObj) {
    console.log(`笔记内容获取为空，不评论`, noteObj);
    return;
  }

  let aiResult = callDeepSeek(`笔记内容：${noteObj.content}`);
  if (!aiResult || aiResult.length <= 0) {
    console.log(`ai 评论内容获取失败，不评论`, noteObj);
    return;
  }

  let notes = className("android.widget.TextView").find();
  let filteredNotes = notes.filter(function (note) {
    return note.desc() && note.desc().includes("评论框");
  });
  if (!filteredNotes && filteredNotes.length <= 0) {
    console.log("未找到评论框按钮");
    return;
  }

  click(filteredNotes[0].center().x, filteredNotes[0].center().y);
  sleep(random(config.gapTimes[0], config.gapTimes[1]));

  let editText = className("android.widget.EditText").find();
  click(editText[0].center().x, editText[0].center().y);
  editText.setText(aiResult);

  sleep(random(config.gapTimes[0], config.gapTimes[1]));

  randomExcute(
    config.addGroupToCommentRate,
    addGroupToComment,
    "插入我加入的群聊",
    editText[0]
  );

  doSend();

  sleep(random(config.gapTimes[0], config.gapTimes[1]));
}
function doSend() {
  sleep(random(config.gapTimes[0], config.gapTimes[1]));

  var 发送 = images.read("images/小红-评论-发送.jpg");
  var p = findImage(captureScreen(), 发送);
  if (p) {
    console.log("图片识别-点击发送按钮", click(p.x, p.y));
    return;
  } else {
    console.log("截图识图-没有找到发送按钮");
  }

  var sendBtn = className("android.widget.TextView").text("发送").findOne(5000);
  if (sendBtn) {
    console.log(
      "文本识别-点击发送按钮",
      click(
        random(sendBtn.center().x - 20, sendBtn.center().x + 20),
        random(sendBtn.center().y - 20, sendBtn.center().y + 20)
      )
    );
  }
}

/**
 * 评论插入 我进入的群
 */
function addGroupToComment(editText) {
  if (config.groupLink.length > 0) {
    console.log(
      "优先使用群口令",
      editText.setText(editText.getText() + config.groupLink)
    );
    return;
  }

  var comment = className("android.widget.ImageView").indexInParent(3).find();
  console.log("点击 + 号", comment.click());
  sleep(random(config.gapTimes[0], config.gapTimes[1]));

  var viewGroup = className("android.widget.TextView")
    .text("群聊")
    .findOne(5000);
  if (!viewGroup) {
    console.log(`未找到群聊按钮`);
    return;
  }

  click(viewGroup.center().x, viewGroup.center().y);
  sleep(random(config.gapTimes[0], config.gapTimes[1]));

  var groupChatBtn = className("android.widget.TextView")
    .text("我加入的")
    .findOne(5000);
  if (!groupChatBtn) {
    console.log(`未找到我加入的群聊按钮`);
    return;
  }

  click(groupChatBtn.center().x, groupChatBtn.center().y);
  sleep(random(config.gapTimes[0], config.gapTimes[1]));

  var addGroupToChat = className("android.widget.TextView").text("添加").find();
  var index = random(0, addGroupToChat.length - 1);
  click(addGroupToChat[index].center().x, addGroupToChat[index].center().y);
}

/**
 * 生成指定范围内的随机小数
 * @param {number} min 最小值（包含）
 * @param {number} max 最大值（包含）
 * @returns {number} 生成的随机小数
 */
function getRandomFloat(min, max) {
  // 检查输入参数是否有效
  if (typeof min !== "number" || typeof max !== "number") {
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
      center: center,
    };
  } else {
    return null; // 如果解析失败，返回 null
  }
}

/**
 * 模拟“返回”或“关闭”操作，并处理找不到明确按钮的情况。
 *
 * @returns {boolean} 如果成功执行了返回或关闭操作，则返回 true；否则返回 false。
 */
function getGoBackByNote() {
  if (back()) {
    console.log(`按下返回按钮`);
    return;
  }

  sleep(random(config.gapTimes[0], config.gapTimes[1]));
  let filteredNotes = className("android.widget.Button").desc("返回").find();

  if (filteredNotes.length == 0) {
    filteredNotes = className("android.widget.ImageView").desc("返回").find();
  }

  if (filteredNotes.length > 0) {
    if (filteredNotes[0]) {
      console.log(`点击返回按钮`);
      filteredNotes[0].click();
      return;
    }
  }

  if (isLiveRoom()) {
    // 直播间退出
    if (className("android.widget.Button").desc("关闭").find().click()) {
      sleep(random(config.gapTimes[0], config.gapTimes[1]));
      className("android.widget.Button").text("退出").findOnce().click();
    }
  }
  return null;
}

function swipeLeft() {
  if (!isTextNotePage()) {
    return;
  }

  sleep(random(config.gapTimes[0], config.gapTimes[1]));
  // 获取屏幕宽度和高度
  let screenWidth = device.width;
  let screenHeight = device.height;

  // 计算滑动起始和结束坐标
  let startX = screenWidth * 0.9; // 屏幕右侧偏左的位置
  let startY = screenHeight * 0.3; // 屏幕中间偏上的位置
  let endX = screenWidth * 0.1; // 屏幕左侧偏右的位置
  let endY = startY; // 保持 Y 坐标不变，实现水平滑动

  // 执行滑动操作
  swipe(startX, startY, endX, endY, random(800, 1000)); // 500 是滑动持续时间，单位为毫秒
}

function swipeRight() {
  if (!isTextNotePage()) {
    return;
  }
  sleep(random(config.gapTimes[0], config.gapTimes[1]));
  // 获取屏幕宽度和高度
  let screenWidth = device.width;
  let screenHeight = device.height;

  // 计算滑动起始和结束坐标
  let startX = screenWidth * 0.1; // 屏幕左侧偏右的位置
  let startY = screenHeight * 0.3; // 屏幕中间偏上的位置
  let endX = screenWidth * 0.9; // 屏幕右侧偏左的位置
  let endY = startY; // 保持 Y 坐标不变，实现水平滑动

  // 执行滑动操作
  swipe(startX, startY, endX, endY, random(800, 1000)); // 500 是滑动持续时间，单位为毫秒
}

function swipeDown() {
  sleep(random(config.gapTimes[0], config.gapTimes[1]));
  swipe(
    device.width / getRandomFloat(1, 4),
    device.height * getRandomFloat(0.7, 0.9),
    device.width / getRandomFloat(1, 4),
    device.height * getRandomFloat(0.1, 0.3),
    random(500, 1000)
  );
}

function hitProbability(probability) {
  // 处理边界情况
  if (probability === 0) return false;
  if (probability === 100) return true;

  // 生成 0 到 100 之间的随机数（包含 0，不包含 100）
  const randomValue = Math.random() * 100;

  let flag = false;
  // 检查是否命中
  flag = randomValue < probability;

  return flag;
}

/**
 * 调用 ai 回复
 */
function callDeepSeek(content) {
  // 定义请求头
  var headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.dsKey}`,
  };
  // 定义请求选项
  var options = {
    headers: headers,
    timeout: 30000,
  };

  r = http.postJson(
    config.url,
    {
      userContent: content,
      systemContent: config.prompt,
    },
    options
  );

  console.log(`ai结果：`, r.body.string());

  var result = JSON.parse(r.body.string());

  if (r.statusCode != 200) {
    console.error(`ai请求失败，状态码：${r.body}`);
    return "";
  }

  return result.data || "";
}

/**
 *
 * @returns 查询后的笔记筛选
 */
function findSearchTextNote() {
  let filteredNotes = className("android.widget.TextView").depth(13).find();

  filteredNotes = filteredNotes.filter(function (note) {
    return note.text() && note.text().length >= 10;
  });

  filteredNotes = filteredNotes.filter(function (note) {
    return (
      note.center().x < device.width * 0.8 &&
      note.center().y < device.height * 0.8
    );
  });

  let textNote = filteredNotes.map(function (note) {
    return {
      noteTitle: note.text(),
      center: {
        x: note.center().x,
        y: note.center().y,
      },
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
  let notes = className("android.widget.FrameLayout").find();

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
  let notes = className("android.widget.ImageView").desc("搜索").exists();

  if (notes) {
    console.log("当前视频笔记页，暂不支持");
  }

  console.log(`是否是视频笔记`, notes);
  return notes;
}

/**
 *
 * @returns  是否是首页
 */
function isHomePage() {
  const requiredTexts = ["发现", "首页"];
  const notes = className("android.widget.TextView").find();
  const result = requiredTexts.every((text) =>
    notes.some((note) => note.text() === text)
  );

  console.log(`是否是首页`, result);
  return result;
}

/**
 *
 * @returns 是否是搜索结果页
 */
function isSearchResultPage() {
  const notes = className("android.widget.TextView").text("筛选").exists();
  var result =
    notes ||
    (className("android.widget.TextView").text("全部").exists() &&
      className("android.widget.TextView").text("用户").exists() &&
      className("android.widget.TextView").text("话题").exists() &&
      className("android.widget.TextView").text("商品").exists());
  console.log(`是否是搜索结果页`, result);
  return result;
}

/**
 * 是否是图文笔记详情页
 */
function isTextNotePage() {
  const notes = className("android.widget.Button").desc("分享").exists();
  return notes;
}

/**
 * 是否是消息列表页
 */
function isMessagePage() {
  return textContains("消息").exists() && textContains("发现群聊").exists();
}

/**
 * 给笔记点赞
 */
function doLikeByNote(noteObj) {
  if (isTextNotePage()) {
    if (!noteObj) {
      noteObj = getTextNoteContent();
    }
    sleep(random(config.gapTimes[0], config.gapTimes[1]));
    click(noteObj.likeCenter.x, noteObj.likeCenter.y);
    console.log(`点赞笔记`, noteObj.likeCenter.x, noteObj.likeCenter.y);
  }
}

/**
 * 给用户点赞
 */
function doLikeByUser() {
  if (isTextNotePage()) {
    sleep(random(config.gapTimes[0], config.gapTimes[1]));
    const likeView = className("android.widget.ImageView").find();

    filteredNotes = likeView.filter(function (note) {
      return note.center().y < device.height * 0.6;
    });
    filteredNotes = findMostFrequentX(filteredNotes);
    if (filteredNotes.length > 0) {
      const randomIdx = random(0, filteredNotes.length - 1);
      // console.log(`找到点赞按钮`, filteredNotes[randomIdx].center().x, filteredNotes[randomIdx].center().y);
      sleep(random(config.gapTimes[0], config.gapTimes[1]));
      click(
        filteredNotes[randomIdx].center().x,
        filteredNotes[randomIdx].center().y
      );
    }
  }
}

/**
 * 找到评论区的点赞按钮
 */
function findMostFrequentX(filteredNotes) {
  if (isTextNotePage()) {
    const xCounts = {};
    const xObjects = {};
    let maxCount = 0;
    let mostFrequentX = null;

    // 统计 x 值的计数，并存储每个 x 值对应的对象
    filteredNotes.forEach((obj) => {
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
        filteredNotes.forEach((obj) => {
          const x = obj.center().x;
          if (x === mostFrequentX) {
            mostFrequentObjects.push(obj);
          }
        });
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
      console.log("搜索按钮未找到");
    }

    click(searchBtn[0].center().x, searchBtn[0].center().y);
    console.log(`点击搜索按钮`);
    sleep(random(config.gapTimes[0], config.gapTimes[1]));

    const searchInput = className("android.widget.EditText").find();
    searchInput = searchInput.filter(function (note) {
      return note.text() && note.text().includes("搜索");
    });
    searchInput[0].setText(serachKey);
    console.log(`设置搜索内容：${serachKey}`);
    sleep(random(config.gapTimes[0], config.gapTimes[1]));

    const doSearchBtn = className("android.widget.Button").find();

    const doSearchBtnT = doSearchBtn.filter(function (note) {
      return note.text() && note.text() == "搜索";
    });

    click(doSearchBtnT[0].center().x, doSearchBtnT[0].center().y);
    console.log(`点击搜索按钮`);

    sleep(random(config.gapTimes[0], config.gapTimes[1]));
  }
}

function isLiveRoom() {
  let flag = textContains("看过").exists() || textContains("人气榜").exists();
  if (flag) {
    console.log("当前直播间页面，暂不支持");
    getGoBackByNote();
  }
  return flag;
}

// isLiveRoom()

// console.log(isHomePage());
// isSearchResultPage();
// isTextNotePage();
// isHomePage();
// isVideoNote();

// getTextNoteContent();

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
// sleep(random(5000, 8000));
// main();
// isMessagePage();

// doLikeByUser();
// console.log(isMessagePage())
// var rednote = {}

// findSearchTextNote();

// getGoBackByNote();
