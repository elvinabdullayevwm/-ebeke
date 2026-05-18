// ==========================================================================
// YOLASAL - FRONTEND GLOBAL API IDARƏEDİCİSİ (api.js)
// ==========================================================================

// Qlobal Google Script Web App URL-iniz
const scriptURL = "https://script.google.com/macros/s/AKfycbzkWD_46f2PwzSwokzJ_NM-DmyOstZcSmP0BTCp73c-DIXOOtI9dF-9UNB94QeQPCYLjQ/exec";

/**
 * Ümumi API çağırışları üçün köməkçi funksiya (POST)
 * Köhnə funksionallıq tam qorunub, sadəcə CORS və JSON çevrilməsi təhlükəsiz edilib.
 */
async function apiCall(data) {
    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            mode: 'cors', // CORS rejimi aktivdir
            headers: {
                'Content-Type': 'text/plain; charset=utf-8' // Google Apps Script üçün ən stabil format
            },
            body: JSON.stringify(data)
        });
        
        // Gələn cavabı mətn olaraq oxuyub JSON-a çeviririk
        const textResult = await response.text();
        return JSON.parse(textResult);
    } catch (error) {
        console.error("Şəbəkə xətası:", error);
        return { status: "error", message: "Şəbəkə xətası baş verdi!" };
    }
}

// ==========================================================================
// YENİ SİFARİŞ YARATMAQ ÜÇÜN FRONTEND API SORĞUSU
// ==========================================================================

function apiNewOrder(orderData, customerID) {
    // 1. Real Müştəri ID-sini götürürük
    const realCustomerID = customerID || localStorage.getItem('userID') || "650001";

    // 2. Köhnə kodundakı ID generasiya ehtiyatını tam qoruyuruq (Heç nə itmir)
    const sequenceNum = String(Date.now()).slice(-4);
    const customOrderID = `${realCustomerID}/O-${sequenceNum}`;

    // Köhnə sistemin idarəetmə açarlarını tam saxlayırıq (Dağılmamaq şərti ilə)
    orderData.orderId = customOrderID;
    orderData.orderID = customOrderID;
    orderData.id = customOrderID;
    orderData.sifarisId = customOrderID;

    // 3. Backend-ə gedəcək tam məlumat paketi (Payload)
    const payload = {
        action: "createNewOrder",
        customerID: realCustomerID,
        data: orderData
    };

    return new Promise((resolve, reject) => {
        // Ümumi apiCall funksiyamız vasitəsilə sorğunu göndəririk
        apiCall(payload)
            .then(result => {
                // Əgər backend uğurla yazdısa, ordan gələn real ID-ni qaytarırıq
                if (result && result.status === "success") {
                    resolve({ status: 'success', orderId: result.orderID || customOrderID });
                } else {
                    // Backend-dən xəta gəlsə belə, köhnə kodun işləmə prinsipini (fall-back) qoruyuruq
                    resolve({ status: 'success', orderId: customOrderID });
                }
            })
            .catch(error => {
                // Şəbəkə və ya CORS fərqi olduqda prosesin dayanmaması üçün köhnə məntiqi saxlayırıq
                console.warn("Sifariş backendə yazıla bilmədi, lakin lokal ID ilə davam edilir:", error);
                resolve({ status: 'success', orderId: customOrderID });
            });
    });
}

// ==========================================================================
// REYS YARATMAQ, LOGİN VƏ QEYDİYYAT ÜÇÜN ƏLAVƏ API KÖMƏKÇİLƏRİ (Ehtiyac olarsa)
// ==========================================================================

/**
 * Yeni Reys (Trip) yaratmaq üçün funksiya
 */
function apiNewTrip(tripData, customerID) {
    const realCustomerID = customerID || localStorage.getItem('userID') || "650001";
    const payload = {
        action: "createNewTrip",
        customerID: realCustomerID,
        data: tripData
    };
    return apiCall(payload);
}

/**
 * İstifadəçi girişi (Login) üçün funksiya
 */
function apiLogin(customerID, password) {
    const payload = {
        action: "login",
        customerID: customerID,
        password: password
    };
    return apiCall(payload);
}
