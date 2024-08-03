const CHANNEL_ACCESS_TOKEN =
  PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
const SPREADSHEET_ID =
  PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const USER_STATES_SHEET_NAME = 'UserStates';
const RESTAURANTS_SHEET_NAME = 'Restaurants';
const REPLY_END_POINT = 'https://api.line.me/v2/bot/message/reply';

function doPost(e) {
  if (typeof e === 'undefined') {
    Logger.log('undefined');
    return;
  }
  const receiveJSON = JSON.parse(e.postData.contents);

  for (let i = 0; i < receiveJSON.events.length; i++) {
    const event = receiveJSON.events[i];
    const replyToken = event.replyToken;
    const timeStamp = event.timestamp;
    const userID = event.source.userId;

    if (event.type == 'message') {
      const messageId = event.message.id;
      const messageType = event.message.type;
      switch (messageType) {
        case 'text':
          const postText = event.message.text;
          Logger.log(postText);
          if (~postText.indexOf('きろく')) {
            replyMessage(
              replyToken,
              createTextMessage('お店のURLをおしえて〜!')
            );
          } else if (~postText.indexOf('さがす')) {
            // さがすコード
            replyMessage(replyToken, createTextMessage('探しました！'));
          } else {
            const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
              USER_STATES_SHEET_NAME
            );
            const lastRow = sheet.getLastRow();
            let rowNum = findRowByUserId(sheet, userId);
            if (!rowNum) {
              sheet.appendRow([userId, userMessage]);
              replyMessage(
                replyToken,
                createTextMessage(
                  '利用したい人数は？（「1」「2」など数字でおしえてね'
                )
              );
            } else {
              const range = sheet.getRange(rowNum, 2, 1, sheet.getLastColumn());
              const values = range.getValues()[0];
              if (!values[1]) {
                sheet.getRange(rowNum, 3).setValue(userMessage);
                replyMessage(
                  replyToken,
                  createTextMessage(
                    'お店の場所は？（「原宿」「渋谷」など最寄駅で登録するといいかも！）'
                  )
                );
              } else {
                sheet.getRange(rowNum, 4).setValue(userMessage);
                replyMessage(replyToken, createTextMessage('登録完了！'));
              }
            }
          }
          break;
        case 'location':
          // const latitude = event.message.latitude;
          // const longitude = event.message.longitude;
          break;
      }
    } else {
      return;
    }
  }
}

function createTextMessage(text) {
  const textMessage = [
    {
      type: 'text',
      text: text,
    },
  ];
  return textMessage;
}

function replyMessage(replyToken, messages) {
  UrlFetchApp.fetch(REPLY_END_POINT, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    method: 'post',
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: messages,
    }),
  });
}
