function searchBars(query, userId) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Bars');
  const data = sheet.getDataRange().getValues();
  let barsArray = [];

  // 全てのデータを検索
  data.forEach((row, index) => {
    if (index === 0) return; // ヘッダー行をスキップ
    const [registeredUserId, url, number, location, registeredDate] = row;

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
        registeredDate: registeredDate,
      });
    }
  });

  const selectedBars = selectRandomBars(barsArray, 3);

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
