/**
 * ChatworkにPDFを送信する
 *
 * @param {Blob} blob - 送信するPDFファイル（バイナリ）
 * @param {string} roomId - ChatworkのルームID
 * @param {string} msg - メッセージ本文（Chatwork記法対応）
 * @param {string} fileName - ファイル名（.pdfを含む）
 */

function sendMessageToChatwork(roomId, msg) {
  const config = getConfig();  // ← config.gs から取得
  const token = config.chatworkApiKey;
  const url = `https://api.chatwork.com/v2/rooms/${roomId}/messages`;

  const payload = {
    body: msg
  };

  const options = {
    method: "post",
    headers: {
      "X-ChatWorkToken": token
    },
    payload: payload
  };

  Logger.log("roomId: " + roomId);
  Logger.log("msg: " + msg);
  Logger.info("endPointUrl: " + url);

  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log("メッセージ送信完了: " + response.getContentText());
  } catch (e) {
    Logger.log("メッセージ送信エラー: " + e);
    throw new Error("Chatworkへのメッセージ送信に失敗しました。");
  }
}


function sendPdfToChatwork(blob, roomId, msg, fileName) {
  const config = getConfig();  // ← config.gs から取得
  const token = config.chatworkApiKey;
  const url = `https://api.chatwork.com/v2/rooms/${roomId}/files`;  // エンドポイント


  // send data
  const formData = {
    message: msg,
    file: blob.setName(fileName)
  };

  // パラメータの設定
  const options = {
    method: "post",
    headers: {
      "X-ChatWorkToken": config.chatworkApiKey
    },
    payload: formData
  };

  Logger.log("roomId: " + roomId);
  Logger.log("msg: " + msg);
  Logger.log("fileName: " + fileName);
  Logger.log("blob type: " + blob.getContentType());
  Logger.log("blob name: " + blob.getName());
  Logger.log("blob size (bytes): " + blob.getBytes().length);
  Logger.info("endPointUrl: " + url)

  // 送信を実行
  try {
    const response = UrlFetchApp.fetch(url, options);   // リクエストを飛ばすメソッド
    Logger.log("送信完了: " + response.getContentText());
  } catch (e){
    Logger.log("送信エラー: " + e);
    throw new Error("Chatworkへの送信に失敗しました。")
  }
}
