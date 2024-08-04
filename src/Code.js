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
        const row = [userId, all_msg[0], all_msg[1], all_msg[2], now];
        sheet.appendRow(row);
        sendReply(reply_token, '登録完了！');
        saveUserState(userId, null);
      } else if (userState === 'Searching') {
        // 場所から検索中の処理
        const query = messageText;
        const results = searchBars(query, userId);
        sendReply(reply_token, results);
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
            sendReply(reply_token, 'どの辺りで探してるの？');
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
              'ゴメンチョットナニイッテルカワカラナイ...😇メニューから選んでみて〜'
            );
            break;
        }
      }
    }
  }
}

function searchBars(query, userId) {
  const sheet =
    SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(BARS_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  let matchingBars = [];

  // 全てのバーを検索
  data.forEach((row, index) => {
    if (index === 0) return; // ヘッダー行をスキップ
    const [registeredUserId, url, number, location, registeredDate] = row;

    // フィルタリング条件
    if (
      query.includes(location) ||
      (number === '1' && query.includes('ひとり')) ||
      (number === '2' && query.includes('ふたり')) ||
      (number >= '3' && query.includes('みんな'))
    ) {
      matchingBars.push({
        userId: registeredUserId,
        url: url,
        number: number,
        location: location,
        registeredDate: registeredDate,
      });
    }
  });

  // ランダムに最大3つの候補を選択
  const selectedBars = selectRandomBars(matchingBars, 3);

  // 結果を整形
  let recommendations = '';
  selectedBars.forEach((bar) => {
    recommendations += `${bar.url}, 人数: ${bar.number}, 場所: ${
      bar.location
    }, 登録日: ${new Date(bar.registeredDate).toLocaleDateString()}\n`;
  });

  return recommendations || '登録されたお店はありません。';
}

function selectRandomBars(bars, maxCount) {
  // ランダムに要素を選ぶ
  const shuffled = bars.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, maxCount);
}
