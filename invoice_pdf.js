/**
 * 請求書テンプレートをPDFとして生成し、Blobで返す
 *
 * @param {Sheet} originalSheetName - 請求書テンプレートのシート
 * @param {string} customerName - 宛名（様や御中込み）
 * @param {number} priceNoTax - 税抜き金額（数値）
 * @returns {Blob} - PDFファイルのバイナリデータ
 */


function createInvoicePdf({customerName, priceNoTax, point}) {

  // 結びつけがされているスプシを読み込む
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // const ss = SpreadsheetApp.openByUrl(url);

  // 対象のWorksheetを開く
  const templateSheet = ss.getSheetByName(STRINGS.SHEET_TEMPLATE_NAME);
  if (!templateSheet) {
    throw new Error(`テンプレートシート「${STRINGS.SHEET_TEMPLATE_NAME}」が見つかりません。`);
  }
  Logger.log(`テンプレートシート名: ${templateSheet.getName()}`);

  // テンプレートの複製（編集用に一時的なシートを作成）
  const copySheet = templateSheet.copyTo(ss);
  copySheet.setName(`temp_${Date.now()}`);

  // 差し込み（例：宛名→B2、金額→B4）
  copySheet.getRange("A9").setValue(customerName).setFontFamily("Arial");
  copySheet.getRange("D18").setValue(priceNoTax).setFontFamily("Arial");
  copySheet.getRange("F31").setValue(point).setFontFamily("Arial");

  SpreadsheetApp.flush(); //! ここまでのものをスプシに反映

  const sheetId = copySheet.getSheetId();
  const spreadsheetId = ss.getId();

  // ✅ export APIでPDF化
  const blob = exportSheetAsPDF(spreadsheetId, sheetId, `請求書_${customerName}`);

  //   1. コピーしたシートを削除
  ss.deleteSheet(copySheet);

  return blob;
}


function exportSheetAsPDF(spreadsheetId, sheetId, fileName) {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export`;
  const exportOptions = {
    exportFormat: "pdf",
    format: "pdf",
    size: "A4",
    portrait: true,
    fitw: true,
    gridlines: false,
    gid: sheetId
  };
  const queryString = Object.entries(exportOptions)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const token = ScriptApp.getOAuthToken();
  const response = UrlFetchApp.fetch(`${url}?${queryString}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.getBlob().setName(`${fileName}.pdf`);
}
