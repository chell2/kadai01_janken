// e:受信メッセージ
function doPost(e) {
  if (typeof e === 'undefined') {
    Logger.log('undefined');
    return;
  }

  const json = JSON.parse(e.postData.contents);
  for (let i = 0; i < json.events.length; i++) {
    const reply_token = json.events[i].replyToken;
    const userId = json.events[i].source.userId;
    const messageType = json.events[i].message.type;
    const messageText = json.events[i].message.text;

    if (messageType === 'text') {
      const userText = messageText;
      const userState = getUserState(userId);

      if (userState === 'Registering') {
        // 登録中の処理
        // メッセージを改行ごとに分割
        const all_msg = userText.split('\n');
        const sheet =
          SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Bars');
        const now = new Date();
        sheet.appendRow(all_msg);
        sendReply(reply_token, '登録完了！');
        saveUserState(userId, null);
      } else if (userState === 'Searching') {
        // 場所から検索中の処理
        sendReply(reply_token, '検索結果を表示〜');
        saveUserState(userId, null);
      } else {
        // 通常のメッセージ処理
        switch (userText) {
          case 'きろく':
            sendReply(
              reply_token,
              'お店のURL、利用したい人数（数字のみ）、場所を順に入力してね'
            );
            saveUserState(userId, 'Registering');
            break;
          case 'さがす':
            sendReply(reply_token, 'どの場所でさがす？');
            saveUserState(userId, 'Searching');
            break;
          case 'ひとり':
            sendReply(reply_token, 'さくっと結果を表示');
            break;
          case 'ふたり':
            sendReply(reply_token, 'しっぽり結果を表示');
            break;
          case 'みんな':
            sendReply(reply_token, 'わいわい結果を表示');
            break;
          default:
            sendReply(
              reply_token,
              'ゴメンチョットナニイッテルカワカラナイ...😇 メニューから選んでみて〜'
            );
            break;
        }
      }
    }
  }
}
