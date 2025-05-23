function main() {
  // スプシを開く
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // シートを選択
  const sheet = ss.getSheetByName('clients');

  // dataFlameにしているイメージ
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const customerName = row[0];
    const priceNoTax = row[1];
    const roomId = row[2];
    const shouldSend = row[3];  // チェックフラグ（例：TRUEなら送信）
    const status = row[4];

    if (shouldSend !== true || status === "済") {
      continue; // 送信対象外
    }

    try {
      const blob = createInvoicePdf(customerName, priceNoTax);
      const msg = `[info][title]請求書を送付します[/title]ご確認をお願いいたします。[/info]`;
      const fileName = `請求書_${customerName}.pdf`;

      sendPdfToChatwork(blob, roomId, msg, fileName);

      // ステータス列を更新
      sheet.getRange(i + 1, 5).setValue("済"); // E列に「済」
    } catch (e) {
      Logger.log(`エラー（${customerName}）：${e}`);
      sheet.getRange(i + 1, 5).setValue("失敗");
    }
  }
}
