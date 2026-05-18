/**
 * YOLASAL - MƏRKƏZİ BACKEND GATWAY (main.gs)
 * Location: backend/main.gs
 * Description: Saytdan gələn bütün GET və POST HTTP sorğularını qarşılayan 
 * və müvafiq modullara (Database / LogisticsEngine) yönləndirən ana qovşaq.
 * Version: 2.8 (2026)
 */

// 1. Qlobal GET Sorğularının Qarşılanması
function doGet(e) {
  // CORS təhlükəsizlik başlıqları ilə cavab vermək üçün mərkəzi funksiya
  try {
    const action = e.parameter.action;
    let responseData = {};

    // Axtarış və ya istifadəçi yoxlama əməliyyatlarının yönləndirilməsi
    if (action === "checkUser") {
      if (typeof checkUserExists === "function") {
        responseData = checkUserExists(e.parameter.email, e.parameter.phone);
      } else {
        responseData = { status: "Error", message: "Database modulu tapılmadı!" };
      }
    } 
    else if (action === "globalSearch") {
      if (typeof globalLogisticsSearch === "function") {
        responseData = globalLogisticsSearch(e.parameter.type, e.parameter.from, e.parameter.to);
      } else {
        responseData = { status: "Error", message: "LogisticsEngine modulu tapılmadı!" };
      }
    } 
    else {
      responseData = { status: "Error", message: "Naməlum GET aksiyası!" };
    }

    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "Error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. Qlobal POST Sorğularının Qarşılanması
function doPost(e) {
  try {
    // Gələn məlumatın oxunması
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    let responseData = {};

    console.log("Gələn POST sorğusu, Aksiya: " + action);

    // Əməliyyat tipinə görə alt funksiyalara paylanma
    switch (action) {
      case "sendOtp":
        if (typeof sendVerificationOtp === "function") {
          responseData = sendVerificationOtp(requestData.email, requestData.otp);
        } else {
          responseData = { status: "Error", message: "OTP funksiyası aktiv deyil!" };
        }
        break;

      case "registerUser":
        if (typeof registerNewUser === "function") {
          responseData = registerNewUser(requestData);
        } else {
          responseData = { status: "Error", message: "Qeydiyyat funksiyası aktiv deyil!" };
        }
        break;

      case "login":
        if (typeof processUserLogin === "function") {
          responseData = processUserLogin(requestData.loginId, requestData.password);
        } else {
          responseData = { status: "Error", message: "Giriş funksiyası aktiv deyil!" };
        }
        break;

      case "createNewOrder":
        if (typeof createOrder === "function") {
          responseData = createOrder(requestData.customerID, requestData.data);
        } else {
          responseData = { status: "Error", message: "Sifariş yaratma funksiyası aktiv deyil!" };
        }
        break;

      case "createNewTrip":
        if (typeof createTrip === "function") {
          responseData = createTrip(requestData.customerID, requestData.data);
        } else {
          responseData = { status: "Error", message: "Reys yaratma funksiyası aktiv deyil!" };
        }
        break;

      case "getDashboardStats":
        if (typeof getCustomerDashboardStats === "function") {
          responseData = getCustomerDashboardStats(requestData.customerID);
        } else {
          responseData = { status: "Error", message: "Statistika mühərriki aktiv deyil!" };
        }
        break;

      case "getMatchingOrders":
        if (typeof findMatchingOrdersForTrip === "function") {
          responseData = findMatchingOrdersForTrip(requestData.tripID);
        } else {
          responseData = { status: "Error", message: "Uyğunlaşdırma mühərriki aktiv deyil!" };
        }
        break;

      default:
        responseData = { status: "Error", message: "İcra edilə bilməyən POST əməliyyatı!" };
    }

    // Nəticəni JSON formatında brauzerə geri qaytarırıq
    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "Error", message: "Mərkəzi Gateway Xətası: " + error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
