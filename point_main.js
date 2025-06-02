function mainPointSendMsg() {
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
    const customerName = rowDict[`${SHEET_COL_STRINGS.CUSTOMER_NAME}`];
    const chatworkBool = rowDict[`${SHEET_COL_STRINGS.CHATWORK_BOOl}`]; // チャットワーク送信の有無
    const roomId = rowDict[`${SHEET_COL_STRINGS.ROOM_ID}`];
    const gssUrl = rowDict[`${SHEET_COL_STRINGS.GSS_URL}`]; // ファイル名


    Logger.log(`status: ${status}`)
    Logger.log(`customerName: ${customerName}`);
    Logger.log(`chatworkBool: ${chatworkBool}`);
    Logger.log(`roomId: ${roomId}`);
    Logger.log(`priceNoTax: ${gssUrl}`);

    // 属性を取得→個人かどうか
    const type = rowDict[`${SHEET_COL_STRINGS.INVOICE_TYPE}`]; // 請求先種別
    const suffix = type === "個人" ? "様" : "御中"; // 個人なら様、それ以外なら御中
    const fullName = `  ${customerName} ${suffix}`; // 宛名にsuffixを追加
    Logger.log(`fullName: ${fullName}`);
    Logger.log(`status: ${status}, chatworkBool: ${chatworkBool}`);

    // ステータスが「請求書欄のステータスがTRUE」または「終了」の場合はスキップ
    if (status === `${STRINGS.FALSE_STATUS}`|| chatworkBool === false) {
      Logger.log(`スキップ: ${customerName} - ステータス: ${status}, チャットワーク送信: ${chatworkBool}`);
      continue; // 送信対象外
    }

    try {

      const msg = `[info][title]${STRINGS.POINT_MSG_TITLE}[/title]${STRINGS.POINT_SEND_MSG}${gssUrl}[/info]`;

      Logger.log(`送信メッセージ: ${msg}`);

      // ChatworkでPDFを送信
      sendMessageToChatwork(roomId, msg);
    } catch (e) {
      Logger.log(`エラー発生: ${e}`);
    }
  }
}

