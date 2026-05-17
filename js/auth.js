// ==========================================================================
// YOLASAL - KUKİ (COOKIE) DƏSTƏKLİ F5-DƏN QORUMA SİSTEMİ (SON VERSIYA)
// ==========================================================================

/**
 * Kuki yazmaq üçün köməkçi funksiya (Məlumatı brauzerə məcburi qəbul etdirir)
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax";
}

/**
 * Kuki oxumaq üçün köməkçi funksiya
 */
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Kuki silmək üçün (Çıxış zamanı)
 */
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

/**
 * 1. SƏHİFƏLƏRİ IDARƏ EDƏN ANA FUNKSİYA
 */
function showSection(sectionId) {
    // Məlumatları həm kükidən, həm də ehtiyat olaraq localStorage-dan yoxlayırıq
    const isLoggedIn = getCookie('isLoggedIn') || localStorage.getItem('isLoggedIn');
    const userID = getCookie('userID') || localStorage.getItem('userID');

    // Əgər giriş yoxdursa, məcburi login-ə at
    if ((isLoggedIn !== 'true' || !userID) && sectionId !== 'login-section' && sectionId !== 'register-section') {
        sectionId = 'login-section';
    }

    // Giriş varsa və səhvən login açılmaq istənirsə, marketplace-ə yönləndir
    if (isLoggedIn === 'true' && userID && (sectionId === 'login-section' || sectionId === 'register-section' || !sectionId)) {
        sectionId = 'marketplace-section';
    }

    // Bütün bölmələri gizlət
    const sections = ['login-section', 'register-section', 'marketplace-section', 'dashboard-section'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Hədəf bölməni aç
    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
        targetEl.style.display = 'block';
    }
}

/**
 * 2. İSTİFADƏÇİ GİRİŞ FUNKSİYASI (LOGIN)
 */
async function login(email, pass) {
    if (!email || !pass) {
        alert("Bütün xanaları doldurun!");
        return;
    }

    const requestData = {
        action: "login",
        email: email,
        password: pass
    };

    const response = await apiCall(requestData);
    
    if (response.includes("Uğurlu") || response.includes("Login sorğusu")) {
        alert("Giriş edildi!");

        // 🔥 DAŞ KİMİ YADDAŞ: Məlumatları həm kukiyə (30 günlük), həm də yerli yaddaşa yazırıq
        setCookie('isLoggedIn', 'true', 30);
        setCookie('userID', '650001', 30);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userID', '650001');

        showSection('marketplace-section');
    } else {
        alert("Server cavabı: " + response);
    }
}

/**
 * 3. SİSTEMDƏN ÇIXIŞ (LOGOUT)
 */
function logout() {
    eraseCookie('isLoggedIn');
    eraseCookie('userID');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userID');
    alert("Sistemdən çıxış edildi!");
    showSection('login-section');
}

/**
 * 4. F5 PROBLEMİNİ KÖKÜNDƏN KƏSƏN AVTOMATİK BAŞLANĞIC
 */
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = getCookie('isLoggedIn') || localStorage.getItem('isLoggedIn');
    const userID = getCookie('userID') || localStorage.getItem('userID');

    if (isLoggedIn === 'true' && userID) {
        showSection('marketplace-section');
    } else {
        showSection('login-section');
    }
});
