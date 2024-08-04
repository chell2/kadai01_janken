// グローバル定数の宣言
const CHANNEL_ACCESS_TOKEN =
  PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
const SPREADSHEET_ID =
  PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const USER_STATES_SHEET_NAME = 'UserStates';
const BARS_SHEET_NAME = 'Bars';
const REPLY_END_POINT = 'https://api.line.me/v2/bot/message/reply';
