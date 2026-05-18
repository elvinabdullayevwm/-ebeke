// ==========================================
// YOLASAL - MƏRKƏZİ BACKEND DATABASE SİSTEMİ (SÜTUNLAR YENİLƏNDİ)
// ==========================================

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_USERS = "Users";
const SHEET_ORDERS = "Orders";
const SHEET_TRIPS = "Trips";

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

function doGet(e) {
  const action = e.parameter.action;
  let result = {};
  if (action === "checkUser") {
    result = checkUserExists(e.parameter.email, e.parameter.phone);
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function checkUserExists(email, phone) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  if (!sheet) return { exists: false };
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] == email || data[i][5] == phone) return { exists: true };
  }
  return { exists: false };
}

function sendVerificationOtp(email, otp) {
  try {
    const subject = "YOLASAL - Qeydiyyat üçün Təsdiq Kodu";
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 500px; margin: 0 auto; border-radius: 8px;">
        <h2 style="color: #2563eb; text-align: center;">YOLASAL Təsdiq Kodu</h2>
        <p>YOLASAL platformasında qeydiyyatı tamamlamaq üçün birdəfəlik təsdiq kodunuz:</p>
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 26px; font-weight: bold; letter-spacing: 6px; color: #1e3a8a; border-radius: 6px; margin: 25px 0;">${otp}</div>
      </div>`;
    MailApp.sendEmail({ to: email, subject: subject, htmlBody: htmlBody });
    return { status: "Success" };
  } catch (err) { return { status: "Error", message: err.toString() }; }
}

function registerNewUser(user) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const data = sheet.getDataRange().getValues();
  let nextId = 650001;
  if (data.length > 1) {
    const lastId = parseInt(data[data.length - 1][0]);
    if (!isNaN(lastId)) nextId = lastId + 1;
  }
  sheet.appendRow([nextId, new Date(), user.name, user.surname, user.email, user.phone, user.city, user.gender, user.birth, user.mmc || "Şəxsi Hesab", user.pass]);
  return { status: "Success", userId: nextId };
}

function processUserLogin(loginId, password) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if ((data[i][0] == loginId || data[i][4] == loginId || data[i][5] == loginId) && data[i][10] == password) {
      return { status: "Success", id: data[i][0], name: data[i][2], surname: data[i][3], phone: data[i][5], mmc: data[i][9] };
    }
  }
  return { status: "Error" };
}

// SƏNİN CƏDVƏLƏ UYĞUN SİFARİŞ YARATMA (Orders)
function createOrder(customerID, order) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_ORDERS);
  const data = sheet.getDataRange().getValues();
  let nextNum = 1001;
  if (data.length > 1) {
    const lastCode = data[data.length - 1][0].toString();
    const lastNum = parseInt(lastCode.replace("ORD-", ""));
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }
  const orderID = "ORD-" + nextNum;

  // Sənin cədvəlinin sütun ardıcıllığına əsasən düzülüş
  sheet.appendRow([
    orderID,
    customerID,
    order.goodType,
    order.goodName,
    order.material,
    order.fragility,
    order.weight,
    order.width,
    order.height,
    order.length,
    order.pickupCity,
    order.pickupAddress,
    order.dropCity,
    order.dropAddress,
    order.pickupDate,
    order.dropDate,
    order.budget,
    "Aktiv", // Status default olaraq Aktiv düşür
    order.notes || "-"
  ]);
  return { status: "Success", orderID: orderID };
}

// SƏNİN ŞƏKİLDƏKİ SÜTUNLARA TAM UYĞUN REYS YARATMA (Trips)
function createTrip(customerID, trip) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_TRIPS);
  const data = sheet.getDataRange().getValues();
  let nextNum = 5001;
  if (data.length > 1) {
    const lastCode = data[data.length - 1][0].toString();
    const lastNum = parseInt(lastCode.replace("TRP-", ""));
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }
  const tripID = "TRP-" + nextNum;

  // ŞƏKİLDƏKİ BÜTÜN BAŞLIQLARIN DƏQİQ ARDICILLIĞI:
  // ID | Maşın növü | Markası | Dövlət qeydiyyat nişanı | Sürücünün adı | Sürücünün soyadı | Sürücülük Vəsiqəsinin kateqoriyası | Sürücülük təcrübəsi/il | Yük üçün mövcud en | Yük üçün mövcud hündürlük | Yük üçün mövcud uzunluq | Götürə biləcəyi çəki | Haradan | Haraya | Təhvil tarixi | Təslim tarixi | Status | Qeyd | Reys ID (Əlavə olaraq)
  sheet.appendRow([
    tripID,                         // ID
    trip.truckType,                 // Maşın növü
    trip.truckBrand,                // Markası
    trip.plateNumber,               // Dövlət qeydiyyat nişanı
    trip.driverName,                // Sürücünün adı
    trip.driverSurname,             // Sürücünün soyadı
    trip.licenseCategory,           // Sürücülük Vəsiqəsinin kateqoriyası
    trip.experience,                // Sürücülük təcrübəsi/il
    trip.width,                     // Yük üçün mövcud en
    trip.height,                    // Yük üçün mövcud hündürlük
    trip.length,                    // Yük üçün mövcud uzunluq
    trip.weight,                    // Götürə biləcəyi çəki
    trip.fromCity,                  // Haradan
    trip.toCity,                    // Haraya
    trip.pickupDate,                // Təhvil tarixi
    trip.dropDate,                  // Təslim tarixi
    "Aktiv",                        // Status
    trip.notes || "-",              // Qeyd
    customerID                      // İstifadəçi ID bağlantısı
  ]);
  return { status: "Success", tripID: tripID };
}
