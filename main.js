function main() {
  // スプシを開く
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // シートを選択
  const sheet = ss.getSheetByName(`${STRINGS.SHEET_MASTER_DATA}`);

  // dataFlameにしているイメージ
  const data = sheet.getDataRange().getValues();

  // 年と月、表記を定義
  const today = new Date();  // 今日の日付を取得
  const year = today.getFullYear();  // 年を取得
  const month = String(today.getMonth() ).padStart(2, '0'); // 0始まりなので+1
  const yearMonthKey = `${year}_${month}`; // 例: "2024-05"

  const priceColName = `${yearMonthKey}${TAIL_STRINGS.PRICE}`;
  const invoiceColName = `${yearMonthKey}${TAIL_STRINGS.INVOICE}`;
  const pointColName = `${yearMonthKey}${TAIL_STRINGS.POINT}`;
  Logger.log(`priceColName: ${priceColName}`);
  Logger.log(`invoiceColName: ${invoiceColName}`);
  Logger.log(`invoiceColName: ${pointColName}`);

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
    const priceNoTax = rowDict[priceColName];
    const sendBool = rowDict[invoiceColName];
    const fileName = rowDict[`${SHEET_COL_STRINGS.FILE_NAME}`]; // ファイル名
    const point = rowDict[pointColName]

    Logger.log(`status: ${status}`)
    Logger.log(`customerName: ${customerName}`);
    Logger.log(`chatworkBool: ${chatworkBool}`);
    Logger.log(`roomId: ${roomId}`);
    Logger.log(`priceNoTax: ${priceNoTax}`);
    Logger.log(`sendBool: ${sendBool}`);

    // 属性を取得→個人かどうか
    type = rowDict[`${SHEET_COL_STRINGS.INVOICE_TYPE}`]; // 請求先種別
    const suffix = type === "個人" ? "様" : "御中"; // 個人なら様、それ以外なら御中
    const fullName = `  ${customerName} ${suffix}`; // 宛名にsuffixを追加
    Logger.log(`fullName: ${fullName}`);
    Logger.log(`sendBool: ${sendBool}, status: ${status}, chatworkBool: ${chatworkBool}, point: ${point}`);

    // ステータスが「請求書欄のステータスがTRUE」または「終了」の場合はスキップ
    if (sendBool === true || status === `${STRINGS.FALSE_STATUS}`|| chatworkBool === false) {
      Logger.log(`スキップ: ${customerName} - ステータス: ${status}, 請求書欄: ${sendBool}, チャットワーク送信: ${chatworkBool}`);
      continue; // 送信対象外
    }

    try {
      Logger.log(`請求書PDFを生成開始: ${customerName} - ${priceNoTax}`);
      // 請求書PDFを生成
      const blob = createInvoicePdf({customerName: fullName, priceNoTax: priceNoTax, point: point});
      Logger.log(`請求書PDFを生成完了: ${customerName} - ${priceNoTax}`);

      const msg = `[info][title]${STRINGS.INVOICE_TITLE}[/title]${STRINGS.INVOICE_MESSAGE}[/info]`;

      // 属性を取得→個人かどうかをfileNameに反映
      const fileFullName = `${fileName}_${year}_${month}.pdf`;
      Logger.log(`送信メッセージ: ${msg}`);
      Logger.log(`ファイル名: ${fileFullName}`);

      // ChatworkでPDFを送信
      sendPdfToChatwork(blob, roomId, msg, fileFullName);

      // 請求書column部分をTrueに更新
      sheet.getRange(i + 1, col_list.indexOf(invoiceColName) + 1).setValue(true); // invoiceColNameの列をTrueに更新
      Logger.log(`請求書columnを更新: ${customerName} - ${priceNoTax}`);
    } catch (e) {
      Logger.log(`エラー（${customerName}）：${e}`);
    }
  }
}
