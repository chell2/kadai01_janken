function searchBars(query, userId) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Bars');
  const data = sheet.getDataRange().getValues();
  let barsArray = [];

  // 全てのデータを検索
  data.forEach((row, index) => {
    if (index === 0) return; // ヘッダー行をスキップ
    const [
      registeredUserId,
      url,
      number,
      location,
      thumbnailUrl,
      title,
      registeredDate,
    ] = row;

    // フィルタリング条件
    const num = Number(number); // 数値に変換
    if (
      (query === 'ひとり' && num === 1) ||
      (query === 'ふたり' && num === 2) ||
      (query === 'みんな' && num >= 3) ||
      query.includes(location)
    ) {
      barsArray.push({
        userId: registeredUserId,
        url: url,
        number: number,
        location: location,
        thumbnailUrl: thumbnailUrl,
        title: title,
        registeredDate: registeredDate,
      });
    }
  });

  const selectedBars = selectRandomBars(barsArray, 3);
  const carouselMessage = createCarouselMessage(selectedBars);
  return carouselMessage || '登録されたお店はありません。';
}

function selectRandomBars(bars, maxCount) {
  // ランダムに要素を選ぶ
  const shuffled = bars.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, maxCount);
}

function createCarouselMessage(matchingBarsArray) {
  const columns = matchingBarsArray.map((bar) => {
    return {
      thumbnailImageUrl: bar.thumbnailUrl,
      title: bar.title || bar.location,
      text: `${bar.number}人で行きたい！`, // 想定人数
      actions: [
        {
          type: 'uri',
          label: 'お店情報はこちら',
          uri: bar.url,
        },
      ],
    };
  });

  return {
    type: 'template',
    altText: '検索結果',
    template: {
      type: 'carousel',
      columns: columns,
      imageAspectRatio: 'rectangle',
      imageSize: 'cover',
    },
  };
}
