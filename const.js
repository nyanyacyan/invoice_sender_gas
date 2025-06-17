const STRINGS = {
  INVOICE_TITLE: '請求書送付',
  INVOICE_MESSAGE: '先月分のメンター代に関するご請求書をお送りいたします。\nお忙しいところ恐れ入りますが、ご確認のうえご対応のほどよろしくお願い申し上げます。\n何卒よろしくお願いいたします。',
  DEFAULT_FILE_PREFIX: '請求書_',
  SHEET_MASTER_DATA: 'マスターデータ',
  SHEET_TEMPLATE_NAME: '請求書テンプレ',
  MONTH_FORMAT: 'YYYY-MM',
  FALSE_STATUS: `終了`,
  POINT_MSG_TITLE: '今月のリベポイント利用について',
  POINT_SEND_MSG: '今月分の請求に対してご利用される「リベポイント」がございましたら下記のURLよりご利用されるポイントを対象の月にご入力ください\n\nよろしくお願いします。\n\n',
};

const TAIL_STRINGS = {
  PRICE: '_金額',
  INVOICE: '_請求書',
  DEFAULT_FILE_PREFIX: '請求書_',
  SHEET_MASTER_DATA: 'マスターデータ',
  SHEET_TEMPLATE: 'template',
  MONTH_FORMAT: 'YYYY-MM',
  POINT: '_リベP'
};

const SHEET_COL_STRINGS = {
  STATUS: 'ステータス',
  CUSTOMER_NAME: '宛名',
  ROOM_ID: 'ルームID',
  CHATWORK_BOOl: 'Chatwork実施',
  INVOICE_TYPE: '請求先種別',
  FILE_NAME: 'ファイル名',
  GSS_URL: '対象スプシURL',
};

const THREE_DAYS_STRINGS = {
  COL_NAME: '今週実施3日前',
  MSG: '相談したい内容や質問事項があれば、共有をお願いします。\nまた作成されたコードがある場合も共有お願い致します。\n当日を有意義な時間にするために、事前準備にご協力いただけますと幸いです。',
  TITLE: '【3日前 リマインド】',
};

const SAME_DAY_REMAINDER = {
  COL_DAY: '今週実施日',
  COL_TIME: '今週実施時間',
  FIRST_MSG: '本日は',
  SECOND_MSG: 'より、よろしくお願いいたします。\n\n事前に質問や作成されたコードがある場合は、共有いただけると助かります。\nどうぞよろしくお願いします。',
  TITLE: '【当日 リマインド】',
};
