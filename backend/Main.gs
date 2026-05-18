/**
 * QARDAŞ, BU BİZİM BİRƏŞMİŞ VƏ TƏHLÜKƏSİZ ANA DOPOST FUNKSİYAMIZDIR.
 * Mövcud olan bütün funksiyalar (login, createOrder, createNewOrder) qorunub saxlanıldı.
 */
function doPost(e) {
  try {
    // 1. Gələn paketi açırıq
    var data = JSON.parse(e.postData.contents);
    var action = data.action; // Router rolunu oynayan əsas dəyişən
    
    // ==========================================================================
    // DISPETÇER MƏNTİQİ (ROUTING) - BÜTÜN EMRLƏR BURADA YOXLANILIR
    // ==========================================================================
    
    // Əmr 1: Köhnə/Alternativ Sifariş Yaratma Məntiqi
    if (action === "createOrder") {
      // LogisticsEngine.gs-dəki funksiyanı çağırırıq
      var newID = generateID(data.sheetName, data.userId, data.prefix);
      
      // Database.gs-dəki funksiya ilə bazaya yazırıq
      appendToSheet(data.sheetName, [data.userId, newID, data.details, new Date()]);
      
      return ContentService.createTextOutput("Uğurlu: Yeni ID yaradıldı - " + newID);
    }
    
    // Əmr 2: Sistemimiz üçün 19 Sütunlu Yeni Sifariş Yaratma Əməliyyatı (YOLASAL LAYİHƏSİ)
    if (action === "createNewOrder") {
      return ContentService.createTextOutput(JSON.stringify(saveNewOrderToSheet(data)))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Əmr 3: İstifadəçi Girişi (Login)
    if (action === "login") {
      // Bura gələcəkdə AuthProvider.gs-i bağlayacağıq
      return ContentService.createTextOutput("Login sorğusu qəbul edildi");
    }

    // Əgər gələn action yuxarıdakıların heç birinə uyğun gəlməzsə:
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Xəta: Naməlum əmr!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (f) {
    // Backend xətalarını JSON formatında stabil şəkildə qaytarırıq
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Backend Xətası: " + f.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================================================
// GOOGLE APPS SCRIPT - YENİ SİFARİŞİN ORDERS VƏRƏQİNƏ YAZILMASI
// ==========================================================================

/**
 * 16 form məlumatını, avtomatik ID və Statusları 19 sütunlu Orders vərəqinə yazan əsas funksiya
 * (Bu funksiyaya və daxili strukturuna qətiyyən toxunulmadı, tam qorunub saxlanıldı)
 */
function saveNewOrderToSheet(request) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Orders"); 
    
    if (!sheet) {
      return { "status": "error", "message": "'Orders' adlı işçi vərəqi tapılmadı!" };
    }
    
    var customerID = request.customerID;
    var orderData = request.data; // Gələn daxili data obyekti
    
    // 1. Unikal Sifariş ID-sinin generasiya edilməsi (Məs: ORD-1715978432)
    var timestamp = new Date().getTime();
    var orderID = "ORD-" + timestamp;
    
    // 2. Statusun avtomatik təyin edilməsi
    var status = "Aktiv";
    
    // 3. Əlavə Qeyd boşdursa defolt olaraq "-" qoyulur
    var notes = orderData.notes ? orderData.notes : "-";
    
    // Google Sheet-dəki 19 sütunlu arxitekturaya tam uyğun ardıcıllıq (A-dan S-ə qədər)
    var rowData = [
      customerID,          // A sütunu: Müştəri ID
      orderData.goodType,       // B sütunu: Malın növü
      orderData.goodName,       // C sütunu: Malın adı
      orderData.material,       // D sütunu: Malın materialı
      orderData.fragility,      // E sütunu: Sınma həssaslığı
      orderData.weight,         // F sütunu: Çəkisi
      orderData.width,          // G sütunu: Eni
      orderData.length,         // H sütunu: Uzunluğu
      orderData.height,         // I sütunu: Hündürlüyü
      orderData.pickupCity,     // J sütunu: Təhvil alınacaq şəhər
      orderData.pickupAddress,  // K sütunu: Təhvil alınacaq konkret ünvan
      orderData.dropCity,       // L sütunu: Təslim ediləcək şəhər
      orderData.dropAddress,    // M sütunu: Təslim ediləcək konkret ünvan
      orderData.pickupDate,     // N sütunu: Təhvil tarixi
      orderData.dropDate,       // O sütunu: Təslim tarixi
      orderData.budget,         // P sütunu: Büdcə
      status,              // Q sütunu: Status
      notes,               // R sütunu: Qeyd
      orderID              // S sütunu: Sifariş ID
    ];
    
    // Məlumatı ən aşağı boş sətrə əlavə edirik
    sheet.appendRow(rowData);
    
    return { 
      "status": "success", 
      "message": "Sifariş uğurla yadda saxlanıldı", 
      "orderID": orderID 
    };
    
  } catch (err) {
    return { "status": "error", "message": "Backend xətası: " + err.toString() };
  }
}
