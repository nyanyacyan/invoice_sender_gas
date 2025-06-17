function today_notify_main() {
  // スプシを開く
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // シートを選択
  const sheet = ss.getSheetByName(`${STRINGS.SHEET_MASTER_DATA}`);

  // dataFlameにしているイメージ
  const data = sheet.getDataRange().getValues();

  // ヘッダー行をリストとして取得
  const col_list = data[0]; // ヘッダー行（1行目）
  Logger.log(`col_list: ${col_list}`);

  // row[0]=A列
  for (let i = 1; i < data.length; i++) {

    const row = data[i];  // i行目のデータを取得
    const rowDict = {}; // オブジェクト化する

    // forEach((col, index)のindexは何個目かを示す
    col_list.forEach((col, index) => {
      // 辞書に格納
      rowDict[col] = row[index];
    });

    // 変数に格納
    const status = rowDict[`${SHEET_COL_STRINGS.STATUS}`];
    const same_day = new Date(rowDict[`${SAME_DAY_REMAINDER.COL_DAY}`]);
    const chatworkBool = rowDict[`${SHEET_COL_STRINGS.CHATWORK_BOOl}`]; // チャットワーク送信の有無
    const roomId = rowDict[`${SHEET_COL_STRINGS.ROOM_ID}`]; // ルームID
    const time = rowDict[`${SAME_DAY_REMAINDER.COL_TIME}`]; // 実施時間

    // 今日の日付のみ定義
    const today = new Date();
    const month = today.getMonth() + 1; // 月は0〜11なので+1が必要
    const day = today.getDate();
    const formatted = `${month}月${day}日`;

    const timeObj = rowDict['今週実施時間'];  // 例: Date オブジェクトで 1899-12-30 21:30:00
    const formattedTime = formatTimeOnly(new Date(timeObj));
    Logger.log(`時間のみ: ${formattedTime}`);  // 出力例: "21:30"

    Logger.log(`status: ${status}`)
    Logger.log(`実施日の日付: ${same_day}`);
    Logger.log(`chatworkBool: ${chatworkBool}`);
    Logger.log(`roomId: ${roomId}`);
    Logger.log(`今日の日付: ${formatted}`);

    // ステータスが「請求書欄のステータスがTRUE」または「終了」の場合はスキップ
    if (!isSameDate(same_day, today) || status === `${STRINGS.FALSE_STATUS}` || chatworkBool === false) {
      Logger.log(`スキップ:${same_day} - ${today} - ${status} - チャットワーク送信: ${chatworkBool}`);
      continue; // 送信対象外
    }

    try {

      const msg = `[info][title]${SAME_DAY_REMAINDER.TITLE}[/title]${SAME_DAY_REMAINDER.FIRST_MSG}${formattedTime}${SAME_DAY_REMAINDER.SECOND_MSG}[/info]`;

      Logger.log(`送信メッセージ: ${msg}`);

      // ChatworkでPDFを送信
      sendMessageToChatwork(roomId, msg);
    } catch (e) {
      Logger.log(`エラー発生: ${e}`);
    }
  }
}

function formatTimeOnly(dateObj) {
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  return `「 ${hours}:${minutes}〜 」`;
}
