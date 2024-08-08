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
    const userText = json.events[i].message.text;

    if (messageType === 'text') {
      const userState = getUserState(userId);

      if (userState === 'Registering') {
        // 登録中の処理
        // メッセージを改行ごとに分割
        const all_msg = userText.split('\n');
        const sheet =
          SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Bars');
        // お店のサムネイル画像のURLを取得
        const thumbnailUrl = fetchThumbnail(all_msg[0]);
        // タイトルが長すぎる場合は切り取る
        const title = fetchTitle(all_msg[0]);
        const now = new Date();
        const row = [
          userId,
          all_msg[0],
          all_msg[1],
          all_msg[2],
          thumbnailUrl,
          title,
          now,
        ];
        sheet.appendRow(row);
        sendReply(reply_token, '登録完了！');
        saveUserState(userId, null);
      } else if (userState === 'Searching') {
        // 場所から検索中の処理
        const carousel = searchBars(userText, userId);
        sendCarouselMessage(reply_token, carousel);
        saveUserState(userId, null);
      } else {
        // 通常のメッセージ処理
        switch (userText) {
          case 'きろく':
            sendReply(
              reply_token,
              '・お店のURL\n・利用したい人数（数字のみ）\n・場所\nを入力してね！\n\n例えばこんな感じ\n↓ ↓ ↓\nhttp://example.com/\n2\n渋谷'
            );
            saveUserState(userId, 'Registering');
            break;
          case 'さがす':
            sendReply(reply_token, 'どの辺りで探してるの？');
            saveUserState(userId, 'Searching');
            break;
          case 'ひとり':
          case 'ふたり':
          case 'みんな':
            const carousel = searchBars(userText, userId);
            sendCarouselMessage(reply_token, carousel);
            break;
          default:
            sendReply(
              reply_token,
              'ゴメンチョットナニイッテルカワカラナイ...😇メニューから選んでみて〜'
            );
            break;
        }
      }
    }
  }
}
