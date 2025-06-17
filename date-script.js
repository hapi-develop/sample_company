document.addEventListener('DOMContentLoaded', () => {
  const displayElement = document.getElementById('date-display');

  if (displayElement) {
    const now = new Date();
    
    // 'ja-JP'ロケールと'Asia/Tokyo'タイムゾーンを使用して日付をフォーマット
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'long',
      timeZone: 'Asia/Tokyo',
    };
    
    const formatter = new Intl.DateTimeFormat('ja-JP', options);
    const parts = formatter.formatToParts(now);
    
    let year, month, day, weekday;
    
    for (const part of parts) {
      switch (part.type) {
        case 'year':
          year = part.value;
          break;
        case 'month':
          month = part.value;
          break;
        case 'day':
          day = part.value;
          break;
        case 'weekday':
          weekday = part.value;
          break;
      }
    }

    if (year && month && day && weekday) {
      displayElement.textContent = `本日は${year}年${month}月${day}日${weekday}です。`;
    } else {
      displayElement.textContent = '日付の取得に失敗しました。';
    }
  }
}); 