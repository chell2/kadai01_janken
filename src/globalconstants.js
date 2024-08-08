// グローバル定数の宣言
const CHANNEL_ACCESS_TOKEN =
  PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
const SPREADSHEET_ID =
  PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const REPLY_END_POINT = 'https://api.line.me/v2/bot/message/reply';
const DEFAULT_IMAGE_URL =
  'https://raw.githubusercontent.com/chell2/kadai01_janken/main/img/logo.png';
const SIZE_LIMIT = 1048576; // 1MB = 1048576 bytes
const WIDTH_LIMIT = 1024; // 最大横幅サイズ1024px
const CACHE_EXPIRATION = 21600; // キャッシュ保存期間 (6時間)