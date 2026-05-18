/**
 * YOLASAL - Authentication & Session Manager
 * Version: 2.8 (YENİ MƏRKƏZİ GOOGLE SCRIPT URL İNTEQRASİYASI İLƏ)
 * TAM STRUKTUR QORUNUB, SƏNİN YENİ URL BİRBAŞA İÇİNƏ YAZILIB.
 */

// --- YENİ DEPLOY OLUNMUŞ GOOGLE SCRIPT BACKEND URL ---
const AUTH_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw05sX5mZfMTQnQxGp9pLhsQiN2lc0G2eMA4geuo5yOQbtCV5J2LSbG4wP9L2A4ZgKF9Q/exec";

document.addEventListener("DOMContentLoaded", function () {
    console.log("Yolasal Auth Modulu Aktivdir.");
    
    // Əgər form birbaşa html daxilində submit edilirsə, idarəetməni ələ al
    const loginForm = document.getElementById("loginFormArea")?.querySelector("form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            if (typeof handleLoginProcess === "function") {
                handleLoginProcess();
            }
        });
    }

    // Sessiyanı yoxla (İstifadəçi daxil olubsa, səhifə yenilənəndə sistemdən atmasın)
    checkUserSession();
});

/**
 * İstifadəçi Sessiyasının Yoxlanılması (Auto-Login Check)
 */
function checkUserSession() {
    const customerID = localStorage.getItem("customerID") || localStorage.getItem("userID");
    
    if (customerID) {
        console.log("Aktiv sessiya tapıldı, ID:", customerID);
        
        // Əgər ui-controller funksiyası mövcuddursa, profil sahəsini avtomatik doldur
        const dashUserId = document.getElementById("dashUserId");
        if (dashUserId && dashUserId.innerText === "-") {
            // Səhifə yenilənəndə məlumatlar itməsin deyə local-dan oxuyuruq
            dashUserId.innerText = customerID;
            
            const dashboardSection = document.getElementById("customerDashboard");
            if (dashboardSection) {
                dashboardSection.style.display = "block";
            }
            
            const mainLoginBtn = document.getElementById("loginBtn");
            const userProfileArea = document.getElementById("userProfileArea");
            
            if (mainLoginBtn) mainLoginBtn.style.display = "none";
            if (userProfileArea) {
                userProfileArea.style.display = "inline-block";
                const avatarBtn = document.getElementById("userAvatarBtn");
                if (avatarBtn) avatarBtn.innerText = "U"; // User-in baş hərfi (Default)
            }
        }
    }
}

/**
 * Şifrənin təhlükəsizlik yoxlanışı (Validasiya)
 */
function validatePassword(password) {
    if (password.length < 6) {
        return { valid: false, msg: "Şifrə ən azı 6 simvoldan ibarət olmalıdır!" };
    }
    return { valid: true };
}

/**
 * E-mail formatının düzgünlüyünü yoxlamaq
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
