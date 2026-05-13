function doPost(e) {
  try {
    // 1. Gələn paketi açırıq
    var data = JSON.parse(e.postData.contents);
    var action = data.action; // "login", "createOrder" və s.
    
    // 2. Dispetçer məntiqi (Routing)
    if (action === "createOrder") {
      // LogisticsEngine.gs-dəki funksiyanı çağırırıq
      var newID = generateID(data.sheetName, data.userId, data.prefix);
      
      // Database.gs-dəki funksiya ilə bazaya yazırıq
      appendToSheet(data.sheetName, [data.userId, newID, data.details, new Date()]);
      
      return ContentService.createTextOutput("Uğurlu: Yeni ID yaradıldı - " + newID);
    }
    
    if (action === "login") {
      // Bura gələcəkdə AuthProvider.gs-i bağlayacağıq
      return ContentService.createTextOutput("Login sorğusu qəbul edildi");
    }

    return ContentService.createTextOutput("Xəta: Naməlum əmr!");

  } catch (f) {
    return ContentService.createTextOutput("Backend Xətası: " + f.toString());
  }
}
