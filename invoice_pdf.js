/**
 * 請求書テンプレートをPDFとして生成し、Blobで返す
 * 
 * @param {Sheet} originalSheetName - 請求書テンプレートのシート
 * @param {string} customerName - 宛名（様や御中込み）
 * @param {number} priceNoTax - 税抜き金額（数値）
 * @returns {Blob} - PDFファイルのバイナリデータ
 */


function createInvoicePdf(originalSheetName, customerName, priceNoTax) {
  // 結びつけがされているスプシを読み込む
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // const ss = SpreadsheetApp.openByUrl(url);

  // 対象のWorksheetを開く
  const templateSheet = ss.getSheetByName(originalSheetName);

  // テンプレートの複製（編集用に一時的なシートを作成）
  const tempSheet = templateSheet.copyTo(ss);
  tempSheet.setName(`temp_${Date.now()}`);

  // 差し込み（例：宛名→B2、金額→B4）
  tempSheet.getRange("B2").setValue(recipient);
  tempSheet.getRange("B4").setValue(amount);

  SpreadsheetApp.flush(); // 書き込み確定

  // 一時スプレッドシートにコピー（PDF変換用）
  const tempSpreadsheet = SpreadsheetApp.create(`請求書_${recipient}`);
  const targetSheet = tempSpreadsheet.getSheets()[0];
  const range = tempSheet.getDataRange();
  const values = range.getValues();

  targetSheet.getRange(1, 1, values.length, values[0].length).setValues(values);

  SpreadsheetApp.flush();

  // PDFとしてBlobを取得
  const blob = tempSpreadsheet.getBlob().setName(`請求書_${recipient}.pdf`);

  // 後片付け（不要なシート・スプレッドシートを削除）
  ss.deleteSheet(tempSheet);
  DriveApp.getFileById(tempSpreadsheet.getId()).setTrashed(true);

  return blob;
}
