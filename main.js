function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    chatworkApiKey: props.getProperty('API_KEY'),
    folderId: props.getProperty('FOLDER_ID'),  // 保存フォルダもここにまとめられる
  };
}
