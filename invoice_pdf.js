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
  const copySheet = templateSheet.copyTo(ss);
  copySheet.setName(`temp_${Date.now()}`);

  // 差し込み（例：宛名→B2、金額→B4）
  copySheet.getRange("B2").setValue(customerName);
  copySheet.getRange("B4").setValue(priceNoTax);

  SpreadsheetApp.flush(); //! ここまでのものをスプシに反映

  //   新しいスプシにてPDF変換を行うために、テンプレートシートを新しいスプレッドシートにコピーします。
  const tempSpreadsheet = SpreadsheetApp.create(`請求書_${customerName}`);
  const targetSheet = tempSpreadsheet.getSheets()[0];
  const range = copySheet.getDataRange();  // 範囲を確認
  const values = range.getValues();  // 値を取得

  //   targetSheet（PDF化用）のシートに対して、values をA1セルから同じサイズで貼り付ける
  targetSheet.getRange(1, 1, values.length, values[0].length).setValues(values);

  SpreadsheetApp.flush(); //! ここまでのものをスプシに反映

  // PDFとしてBlobを取得
  const blob = tempSpreadsheet.getBlob().setName(`請求書_${customerName}.pdf`);

  //   1. コピーしたシートを削除
  ss.deleteSheet(copySheet);

  //   2. 一時的に作成したスプレッドシートを削除
  DriveApp.getFileById(tempSpreadsheet.getId()).setTrashed(true);

  return blob;
}
