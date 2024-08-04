const sheetId = SPREADSHEET_ID;
const sheetName = 'UserStates';

// ユーザーの状態を保存
function saveUserState(userId, state) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === userId) {
      sheet.getRange(i + 1, 2).setValue(state);
      return;
    }
  }

  sheet.appendRow([userId, state]);
}

// ユーザーの状態を取得
function getUserState(userId) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === userId) {
      return data[i][1];
    }
  }

  return null;
}
