function fetchTitle(url) {
  const maxTitleLength = 30; // タイトルの最大文字数
  if (url.includes('instagram.com')) {
    // Instagramの場合URLからからタイトルを取得
    let title = extractInstagramUsername(url);
    // タイトルが長すぎる場合は切り取る
    if (title.length > maxTitleLength) {
      title = title.substring(0, maxTitleLength) + '...'; // 末尾に省略符号
    }
    return title;
  } else {
    // 通常のURLの場合OpenGraphタグからタイトルを取得
    let title = fetchOpenGraphTitle(url);
    if (title.length > maxTitleLength) {
      title = title.substring(0, maxTitleLength) + '...';
    }
    return title;
  }
}

function extractInstagramUsername(url) {
  // InstagramのURLパターンにマッチする正規表現
  const regex = /https:\/\/www\.instagram\.com\/([^\/\?]+)/;
  const match = url.match(regex);
  if (match) {
    return match[1]; // ユーザー名を返す
  }
  return null; // マッチしなかった場合
}

function fetchOpenGraphTitle(url) {
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const html = response.getContentText();
    const regex = /<meta property="og:title" content="(.*?)"/;
    const match = html.match(regex);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  } catch (e) {
    Logger.log('Error fetching URL: ' + e);
    return 'タイトルが取得できませんでした';
  }
}
