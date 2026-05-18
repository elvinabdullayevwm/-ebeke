// ==========================================================================
// YOLASAL - ZİREHLİ F5 QORUMA SİSTEMİ (QEYD-ŞƏRTSİZ GİRİŞ)
// ==========================================================================

/**
 * 1. SƏHİFƏLƏRİ AÇIB-GİZLƏDƏN ANA FUNKSİYA
 */
function showSection(sectionId) {
    // Brauzer yaddasını tam qaranlıq otaqda belə tapırıq
    const isLoggedIn = localStorage.getItem('isLoggedIn') || document.cookie.includes('isLoggedIn=true');
    const userID = localStorage.getItem('userID');

    // 🔥 ƏSAS ZİREH BURADIR: 
    // Əgər istifadəçi giriş EDİBSƏ və hansısa köhnə HTML kodu inadla onu 
    // login-ə və ya register-ə atmaq istəyirsə, biz onun qarşısını kəsirik!
    if (isLoggedIn && userID && (sectionId === 'login-section' || sectionId === 'register-section' || !sectionId)) {
        console.log("Zireh Aktivləşdi: Giriş var, login səhifəsi bloklandı. Marketplace açılır.");
        sectionId = 'marketplace-section'; // Məcburi olaraq marketplace-ə çeviririk
    }

    // Əgər giriş yoxdursa və başqa yerə keçmək istəyirsə, login-ə at
    if (!isLoggedIn && sectionId !== 'login-section' && sectionId !== 'register-section') {
        sectionId = 'login-section';
    }

    // --- Səhifələri ekranda göstərmək məntiqi ---
    const sections = ['login-section', 'register-section', 'marketplace-section', 'dashboard-section'];
    
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
        targetEl.style.display = 'block';
    }
}

/**
 * 2. İSTİFADƏÇİ GİRİŞ FUNKSİYASI (YENİLƏNMİŞ VƏ TƏHLÜKƏSİZ)
 * api.js-dəki apiCall funksiyası ilə tam sinxron işləyir.
 */
async function login(email, pass) {
    if (!email || !pass) {
        alert("Bütün xanaları doldurun!");
        return;
    }

    // Sənin backend strukturuna uyğun parametr adları
    const requestData = {
        action: "login",
        customerID: email, // Google Script ID olaraq bu parametri gözləyir
        password: pass
    };

    try {
        // api.js daxilindəki qlobal funksiyanı çağırırıq
        const response = await apiCall(requestData);
        
        // 🔥 KRİTİK DƏYİŞİKLİK: Həm köhnə mətn, həm də yeni JSON strukturunu yoxlayırıq (Heç nə dağılmır)
        const isStringSuccess = typeof response === "string" && (response.includes("Uğurlu") || response.includes("Login sorğusu"));
        const isJsonSuccess = response && response.status === "success";

        if (isStringSuccess || isJsonSuccess) {
            alert("Giriş edildi!");

            // Real istifadəçi ID-sini backend-dən götürürük, yoxdursa daxil edilən emaili/ID-ni yazırıq
            const finalUserID = response.customerID || email || '650001';

            // Məlumatları həm daimi yaddaşa, həm kukiyə yazırıq
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userID', String(finalUserID).trim());
            document.cookie = "isLoggedIn=true; path=/; max-age=2592000; SameSite=Lax";

            showSection('marketplace-section');
        } else {
            // Əgər backend-dən xəta mesajı gəlibsə onu göstər, yoxdursa obyektin özünü yazdır
            const errorMsg = response.message || (typeof response === "string" ? response : "İstifadəçi ID və ya parol yanlışdır!");
            alert("Server cavabı: " + errorMsg);
        }
    } catch (err) {
        console.error("Giriş zamanı xəta:", err);
        alert("Giriş zamanı xəta baş verdi. Sistem idarəçisinə müraciət edin.");
    }
}

/**
 * 3. SİSTEMDƏN ÇIXIŞ
 */
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userID');
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    alert("Sistemdən çıxış edildi!");
    showSection('login-section');
}

/**
 * 4. SƏHİFƏ AÇILANDA VƏ YA F5 OLUNANDA ARASIKƏSİLMƏZ YOXLAMA (Yarım saniyəlik təhlükəsizlik taymeri ilə)
 */
function checkSessionAndRun() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') || document.cookie.includes('isLoggedIn=true');
    if (isLoggedIn) {
        showSection('marketplace-section');
    } else {
        showSection('login-section');
    }
}

// Səhifə yüklənən kimi dərhal yoxla
window.addEventListener('DOMContentLoaded', checkSessionAndRun);
window.addEventListener('load', checkSessionAndRun);

// 🔥 GİZLİ SİLAH: Əgər HTML-in içindəki hansısa kod səhifə tam açılandan sonra 
// bizi çölə atarsa, bu taymer yarım saniyə sonra onu yenidən məcburi içəri salacaq!
setTimeout(checkSessionAndRun, 500);
