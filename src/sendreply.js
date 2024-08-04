// テキストメッセージ送信
function sendReply(replyToken, message) {
  const payload = JSON.stringify({
    replyToken: replyToken,
    messages: [{ type: 'text', text: message }],
  });

  UrlFetchApp.fetch(REPLY_END_POINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    payload: payload,
  });
}
