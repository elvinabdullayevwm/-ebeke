/**
 * YOLASAL - API Connection Manager
 * Version: 2.8 (YENİ MƏRKƏZİ GOOGLE SCRIPT URL İNTEQRASİYASI İLƏ)
 * TAM STRUKTUR QORUNUB, SƏNİN YENİ URL BİRBAŞA İÇİNƏ YAZILIB.
 */

// --- YENİ DEPLOY OLUNMUŞ GOOGLE SCRIPT BACKEND URL ---
const API_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw05sX5mZfMTQnQxGp9pLhsQiN2lc0G2eMA4geuo5yOQbtCV5J2LSbG4wP9L2A4ZgKF9Q/exec";

/**
 * 1. Yeni Sifariş Yaradılması (Google Sheets-ə göndərilməsi)
 */
async function apiNewOrder(orderData, customerID) {
    console.log("Sifariş API-yə göndərilir...", orderData, customerID);
    
    const payload = {
        action: "createNewOrder",
        customerID: customerID,
        data: orderData
    };

    try {
        const response = await fetch(API_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error("Şəbəkə xətası baş verdi!");
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("apiNewOrder xətası:", error);
        throw error;
    }
}

/**
 * 2. Yeni Reys (Trip) Yaradılması
 */
async function apiNewTrip(tripData, customerID) {
    console.log("Reys API-yə göndərilir...", tripData, customerID);

    const payload = {
        action: "createNewTrip",
        customerID: customerID,
        data: tripData
    };

    try {
        const response = await fetch(API_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Şəbəkə xətası baş verdi!");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("apiNewTrip xətası:", error);
        throw error;
    }
}

/**
 * 3. İstifadəçi Girişi (Login)
 */
async function apiUserLogin(loginId, password) {
    console.log("Giriş sorğusu göndərilir...", loginId);

    const payload = {
        action: "login",
        loginId: loginId,
        password: password
    };

    try {
        const response = await fetch(API_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Şəbəkə xətası!");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("apiUserLogin xətası:", error);
        throw error;
    }
}

/**
 * 4. Yeni İstifadəçi Qeydiyyatı (OTP təsdiqindən sonra)
 */
async function apiRegisterUser(userData) {
    console.log("Qeydiyyat məlumatları qeyd olunur...", userData);

    const payload = {
        action: "registerUser",
        ...userData
    };

    try {
        const response = await fetch(API_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Şəbəkə xətası!");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("apiRegisterUser xətası:", error);
        throw error;
    }
}

/**
 * 5. Doğrulama Kodu (OTP) Göndərilməsi
 */
async function apiSendOtp(email, otpCode) {
    console.log("OTP göndərilir...", email, otpCode);

    const payload = {
        action: "sendOtp",
        email: email,
        otp: otpCode
    };

    try {
        const response = await fetch(API_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // Brauzer təhlükəsizlik xətası verməsin deyə
            body: JSON.stringify(payload)
        });
        
        return { status: "Success", message: "Sorğu göndərildi." };
    } catch (error) {
        console.error("apiSendOtp xətası:", error);
        throw error;
    }
}
