function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  // Burada gələn action-a görə LogisticsEngine və ya AuthProvider çağırılacaq
  return ContentService.createTextOutput("Processed: " + data.action);
}
