function fetchThumbnail(url) {
  if (url.includes('instagram.com')) {
    // InstagramのURLの場合、デフォルトのサムネイル画像を返す
    return DEFAULT_IMAGE_URL;
  } else {
    // 通常のURLからサムネイル画像を取得
    return fetchAndCacheThumbnail(url);
  }
}

function fetchAndCacheThumbnail(url) {
  const cache = CacheService.getScriptCache();
  const cacheKey = encodeURIComponent(url); // キャッシュキーとしてURLをエンコード
  const cachedThumbnail = cache.get(cacheKey);

  if (cachedThumbnail) {
    return cachedThumbnail;
  }

  try {
    const options = {
      muteHttpExceptions: true,
      followRedirects: true,
      timeout: 5000, // タイムアウトを5秒に設定
    };
    const response = UrlFetchApp.fetch(url, options);
    const html = response.getContentText();
    const regex = /<meta property="og:image" content="(.*?)"/;
    const match = html.match(regex);

    if (match) {
      const thumbnailUrl = match[1];
      const imageResponse = UrlFetchApp.fetch(thumbnailUrl, options);
      const blob = imageResponse.getBlob();
      const imageWidth = blob.getDataAsString().match(/width="(\d+)"/)[1];
      const imageSize = blob.getBytes().length;

      if (parseInt(imageWidth, 10) > WIDTH_LIMIT || imageSize > SIZE_LIMIT) {
        // サイズ制限を確認
        const defaultThumbnail = DEFAULT_IMAGE_URL;
        cache.put(cacheKey, defaultThumbnail, CACHE_EXPIRATION); // デフォルト画像をキャッシュ
        return defaultThumbnail;
      }

      cache.put(cacheKey, thumbnailUrl, CACHE_EXPIRATION); // 正常な取得の場合、キャッシュを更新
      return thumbnailUrl;
    } else {
      const defaultThumbnail = DEFAULT_IMAGE_URL;
      cache.put(cacheKey, defaultThumbnail, CACHE_EXPIRATION); // デフォルト画像をキャッシュ
      return defaultThumbnail;
    }
  } catch (e) {
    Logger.log('Timeout or Error fetching URL: ' + e);
    const defaultThumbnail = DEFAULT_IMAGE_URL;
    cache.put(cacheKey, defaultThumbnail, CACHE_EXPIRATION); // タイムアウトやエラー発生時にデフォルト画像をキャッシュ
    return defaultThumbnail;
  }
}

function getImageWidth(blob) {
  // 画像の横幅を取得する関数
  const image = Utilities.newBlob(blob.getBytes()).getDataAsString();
  const widthMatch = image.match(/width="(\d+)"/);
  return widthMatch ? parseInt(widthMatch[1], 10) : 0;
}
