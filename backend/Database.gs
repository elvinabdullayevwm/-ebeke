/**
 * YOLASAL - MƏRKƏZİ BACKEND DATABASE SİSTEMİ (2026)
 * Location: backend/ qovluğu daxilindəki mərkəzi fayl
 * * QEYD: Bu kod Google Apps Script (GAS) mühitində işləmək üçün nəzərdə tutulub.
 * Bütün funksionallıq, Avto-ID generasiyası və E-mail OTP sistemi daxildir.
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// Səhifə adları (Google Sheets-də aşağıdakı vərəqlərin adları tam belə olmalıdır)
const SHEET_USERS = "Users";
const SHEET_ORDERS = "Orders";
const SHEET_TRIPS = "Trips";

// 1. MƏRKƏZİ POST SORĞU İDARƏEDİCİSİ (POST REQUEST)
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    let result = {};

    if (action === "sendOtp") {
      result = sendVerificationOtp(requestData.email, requestData.otp);
    } 
    else if (action === "registerUser") {
      result = registerNewUser(requestData);
    } 
    else if (action === "login") {
      result = processUserLogin(requestData.loginId, requestData.password);
    } 
    else if (action === "createNewOrder") {
      result = createOrder(requestData.customerID, requestData.data);
    } 
    else if (action === "createNewTrip") {
      result = createTrip(requestData.customerID, requestData.data);
    } 
    else {
      result = { status: "Error", message: "Naməlum əməliyyat!" };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "Error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. MƏRKƏZİ GET SORĞU İDARƏEDİCİSİ (GET REQUEST - İstifadəçi və nömrə yoxlamaq üçün)
function doGet(e) {
  const action = e.parameter.action;
  let result = {};

  if (action === "checkUser") {
    const email = e.parameter.email;
    const phone = e.parameter.phone;
    result = checkUserExists(email, phone);
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// =========================================================================
// FUNKSİONALLIQLARIN DETALLARI (AVTO-ID VƏ DATA İDARƏETMƏSİ)
// =========================================================================

// A. İstifadəçinin mövcud olub-olmamasını yoxlamaq
function checkUserExists(email, phone) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  if (!sheet) return { exists: false };
  
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] == email || data[i][5] == phone) { // 4: Email, 5: Telefon kolonları
      return { exists: true };
    }
  }
  return { exists: false };
}

// B. E-mail vasitəsilə Doğrulama Kodu (OTP) Göndərmək
function sendVerificationOtp(email, otp) {
  try {
    const subject = "YOLASAL - Qeydiyyat üçün Təsdiq Kodu";
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 500px; margin: 0 auto; border-radius: 8px;">
        <h2 style="color: #2563eb; text-align: center; margin-bottom: 20px;">YOLASAL Təsdiq Kodu</h2>
        <p>Salam,</p>
        <p>YOLASAL platformasında qeydiyyatı tamamlamaq üçün birdəfəlik təsdiq kodunuz:</p>
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 26px; font-weight: bold; letter-spacing: 6px; color: #1e3a8a; border-radius: 6px; margin: 25px 0;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px;">Əgər bu sorğunu siz etməmisinizsə, bu məktubu görməzdən gələ bilərsiniz.</p>
      </div>
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody
    });
    
    return { status: "Success", message: "OTP göndərildi." };
  } catch (err) {
    return { status: "Error", message: err.toString() };
  }
}

// C. Yeni İstifadəçi Qeydiyyatı (Avtomatik ID: 650001-dən başlayır)
function registerNewUser(user) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const data = sheet.getDataRange().getValues();
  
  let nextId = 650001;
  if (data.length > 1) {
    const lastId = parseInt(data[data.length - 1][0]); 
    if (!isNaN(lastId)) nextId = lastId + 1;
  }

  const timestamp = new Date();
  
  // Tablo strukturu: ID | Tarix | Ad | Soyad | Email | Telefon | Şəhər | Cinsiyyət | Doğum T. | Şirkət/MMC | Şifrə
  sheet.appendRow([
    nextId,
    timestamp,
    user.name,
    user.surname,
    user.email,
    user.phone,
    user.city,
    user.gender,
    user.birth,
    user.mmc ? user.mmc : "Şəxsi Hesab",
    user.pass
  ]);

  return { status: "Success", userId: nextId };
}

// D. Giriş (Login) Yoxlanılması
function processUserLogin(loginId, password) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if ((data[i][0] == loginId || data[i][4] == loginId || data[i][5] == loginId) && data[i][10] == password) {
      return {
        status: "Success",
        id: data[i][0],
        name: data[i][2],
        surname: data[i][3],
        phone: data[i][5],
        mmc: data[i][9]
      };
    }
  }
  return { status: "Error", message: "Məlumatlar yanlışdır!" };
}

// E. Yeni Sifariş Yaradılması (Avtomatik Sifariş ID: ORD-1001-dən başlayır)
function createOrder(customerID, order) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_ORDERS);
  const data = sheet.getDataRange().getValues();
  
  let nextOrderNum = 1001;
  if (data.length > 1) {
    const lastOrderCode = data[data.length - 1][0].toString(); 
    const lastNum = parseInt(lastOrderCode.replace("ORD-", ""));
    if (!isNaN(lastNum)) nextOrderNum = lastNum + 1;
  }
  
  const orderID = "ORD-" + nextOrderNum;
  const timestamp = new Date();

  // Tablo strukturu: Sifariş ID | Müştəri ID | Tarix | Yük Tipi | Adı | Material | Həssaslıq | Çəki | En | Uzunluq | Hündürlük | Haradan | Ünvan | Haraya | Ünvan | Götürülmə T. | Çatdırılma T. | Büdcə | Qeyd
  sheet.appendRow([
    orderID,
    customerID,
    timestamp,
    order.goodType,
    order.goodName,
    order.material,
    order.fragility,
    order.weight,
    order.width,
    order.length,
    order.height,
    order.pickupCity,
    order.pickupAddress,
    order.dropCity,
    order.dropAddress,
    order.pickupDate,
    order.dropDate,
    order.budget,
    order.notes
  ]);

  return { status: "Success", orderID: orderID };
}

// F. Yeni Reys (Trip) Yaradılması (Avtomatik Reys ID: TRP-5001-dən başlayır)
function createTrip(customerID, trip) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_TRIPS);
  const data = sheet.getDataRange().getValues();
  
  let nextTripNum = 5001;
  if (data.length > 1) {
    const lastTripCode = data[data.length - 1][0].toString(); 
    const lastNum = parseInt(lastTripCode.replace("TRP-", ""));
    if (!isNaN(lastNum)) nextTripNum = lastNum + 1;
  }
  
  const tripID = "TRP-" + nextTripNum;
  const timestamp = new Date();

  // Tablo strukturu: Reys ID | Sürücü ID (Müştəri ID) | Tarix | Yük Maşını | Marka | Dövlət Nömrəsi | Sürücü Adı | Soyadı | Kateqoriya | Təcrübə | En | Uzunluq | Hündürlük | Tutum | Haradan | Haraya | Çıxış T. | Çatış T. | Qeydlər
  sheet.appendRow([
    tripID,
    customerID,
    timestamp,
    trip.truckType,
    trip.truckBrand,
    trip.plateNumber,
    trip.driverName,
    trip.driverSurname,
    trip.licenseCategory,
    trip.experience,
    trip.width,
    trip.length,
    trip.height,
    trip.weight,
    trip.fromCity,
    trip.toCity,
    trip.pickupDate,
    trip.dropDate,
    trip.notes
  ]);

  return { status: "Success", tripID: tripID };
}
