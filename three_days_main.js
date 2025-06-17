function main_three_days_notify() {
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
    const three_days_ago = new Date(rowDict[`${THREE_DAYS_STRINGS.COL_NAME}`]);
    const chatworkBool = rowDict[`${SHEET_COL_STRINGS.CHATWORK_BOOl}`]; // チャットワーク送信の有無
    const roomId = rowDict[`${SHEET_COL_STRINGS.ROOM_ID}`]; // ルームID
    // const gssUrl = rowDict[`${SHEET_COL_STRINGS.GSS_URL}`]; // ファイル名

    // 今日の日付のみ定義
    const today = new Date();

    Logger.log(`status: ${status}`)
    Logger.log(`3日前の日付: ${three_days_ago}`)
    Logger.log(`chatworkBool: ${chatworkBool}`);
    Logger.log(`roomId: ${roomId}`);
    // Logger.log(`gssUrl: ${gssUrl}`);

    // ステータスが「請求書欄のステータスがTRUE」または「終了」の場合はスキップ
    if (!isSameDate(three_days_ago, today) || status === `${STRINGS.FALSE_STATUS}` || chatworkBool === false) {
      Logger.log(`スキップ: ${three_days_ago} - 今日の日付: ${today}`);
      continue; // 送信対象外
    }

    try {

      const msg = `[info][title]${THREE_DAYS_STRINGS.TITLE}[/title]${THREE_DAYS_STRINGS.MSG}[/info]`;

      Logger.log(`送信メッセージ: ${msg}`);

      // ChatworkでPDFを送信
      sendMessageToChatwork(roomId, msg);
    } catch (e) {
      Logger.log(`エラー発生: ${e}`);
    }
  }
}


function isSameDate(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
