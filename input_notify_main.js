function input_notify_main() {
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
    const chatworkBool = rowDict[`${SHEET_COL_STRINGS.CHATWORK_BOOl}`]; // チャットワーク送信の有無
    const roomId = rowDict[`${SHEET_COL_STRINGS.ROOM_ID}`]; // ルームID
    const gssUrl = rowDict[`${SHEET_COL_STRINGS.GSS_URL}`]; // ファイル名
    const time = rowDict[`${SAME_DAY_REMAINDER.COL_TIME}`]; // 実施時間


    Logger.log(`status: ${status}`)
    Logger.log(`chatworkBool: ${chatworkBool}`);
    Logger.log(`roomId: ${roomId}`);
    Logger.log(`gssUrl: ${gssUrl}`);
    Logger.log(`実施時間: ${time}`);

    // ステータスが「請求書欄のステータスがTRUE」または「終了」の場合はスキップ
    if (status === `${STRINGS.FALSE_STATUS}` || chatworkBool === false) {
      Logger.log(`スキップ: ${status} - チャットワーク送信: ${chatworkBool}`);
      continue; // 送信対象外
    }

    try {

      const msg = `[info][title]${INPUT_GSS_NOTIFY.TITLE}[/title]${INPUT_GSS_NOTIFY.MSG}${gssUrl}[/info]`;

      Logger.log(`送信メッセージ: ${msg}`);

      // ChatworkでPDFを送信
      sendMessageToChatwork(roomId, msg);
    } catch (e) {
      Logger.log(`エラー発生: ${e}`);
    }
  }
}

