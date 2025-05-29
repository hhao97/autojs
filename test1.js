
/**
 * 调用 ai 回复
 */
function callDeepSeek(content) {
  // 定义请求头
  var headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer sk-3c15ee56adce455daa553784b251fe4a`,
  };
  // 定义请求选项
  var options = {
    headers: headers,
    timeout: 30000, 
  };

  r = http.postJson(
    "http://192.168.1.212:8081/demo/websocket/list4",
    {
      userContent: content,
      systemContent: "你是一个评论机器人，我发你内容你评论。每次评论不能超过 30 个字，不能有产品推荐等任何营销性质的评论，你的回复应该是从普通用户考虑，你的回复不能让别人看出你是ai 评论，所以评论的时候需要利己一点，评论的内容不需要排版,不能用换行符。你的人物设定： 28 岁，女 。",
    },
    options
  );

  var result = JSON.parse(r.body.string());
  console.log(`ai结果：`, result.data);
  return result;
}

callDeepSeek("最近好像好多返利机器人都不回消息，听说被限制的很多，如果不回消息，可以点头像看看图二这个位置，大部分都会留备用号如果真没有那就要小心了#返利机器人 #返利 #返利机器人跑路");
