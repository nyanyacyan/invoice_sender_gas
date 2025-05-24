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
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 0始まりなので+1
  const yearMonthKey = `${year}-${month}`; // 例: "2024-05"

  const priceColName = `${yearMonthKey}${TAIL_STRINGS.PRICE}`;
  const invoiceColName = `${yearMonthKey}${TAIL_STRINGS.INVOICE}`;
  Logger.log(`priceColName: ${priceColName}`);
  Logger.log(`invoiceColName: ${invoiceColName}`);

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
    const roomId = rowDict[`${SHEET_COL_STRINGS.ROOM_ID}`];
    const priceNoTax = rowDict[priceColName];
    const sendBool = rowDict[invoiceColName];

    Logger.log(`status: ${status}`)
    Logger.log(`customerName: ${customerName}`);
    Logger.log(`roomId: ${roomId}`);
    Logger.log(`priceNoTax: ${priceNoTax}`);
    Logger.log(`sendBool: ${sendBool}`);

    // TODO 属性を取得→個人かどうか

    // ステータスが「請求書欄のステータスがTRUE」または「終了」の場合はスキップ
    if (sendBool !== true || status === `${STRINGS.FALSE_STATUS}`) {
      continue; // 送信対象外
    }

    try {
      Logger.log(`請求書PDFを生成開始: ${customerName} - ${priceNoTax}`);
      // 請求書PDFを生成
      const blob = createInvoicePdf(customerName, priceNoTax);
      Logger.log(`請求書PDFを生成完了: ${customerName} - ${priceNoTax}`);

      const msg = `[info]${STRINGS.INVOICE_TITLE}[title][/title]${STRINGS.INVOICE_MESSAGE}[/info]`;

      // TODO 属性を取得→個人かどうかをfileNameに反映
      const fileName = `${customerName}.pdf`;
      Logger.log(`送信メッセージ: ${msg}`);
      Logger.log(`ファイル名: ${fileName}`);

      // ChatworkでPDFを送信
      sendPdfToChatwork(blob, roomId, msg, fileName);

      // 請求書column部分をTrueに更新
      sheet.getRange(i + 1, col_list.indexOf(invoiceColName) + 1).setValue(true); // invoiceColNameの列をTrueに更新
      Logger.log(`請求書columnを更新: ${customerName} - ${priceNoTax}`);

      // ステータス列を更新
      sheet.getRange(i + 1, 5).setValue("済"); // E列に「済」
    } catch (e) {
      Logger.log(`エラー（${customerName}）：${e}`);
      sheet.getRange(i + 1, 5).setValue("失敗");
    }
  }
}
