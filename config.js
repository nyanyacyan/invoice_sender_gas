function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    chatworkApiKey: props.getProperty('API_KEY'),
    pdfDriveFolderId: props.getProperty('PDF_DRIVE_FOLDER_ID')
  };
}