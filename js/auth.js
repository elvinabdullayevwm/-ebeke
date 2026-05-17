// ==========================================================================
// YOLASAL - DAİMİ SESSİYA, LOGİN VƏ SƏHİFƏ İDARƏEDİCİSİ (TAM KOD)
// ==========================================================================

/**
 * 1. SƏHİFƏLƏRİ AÇIB-GİZLƏDƏN VƏ F5 ATMAQDAN QORUYAN ANA FUNKSİYA
 * Sənin layihəndəki köhnə 'showSection' funksiyasını tamamilə bu əvəz edir.
 */
function showSection(sectionId) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userID = localStorage.getItem('userID');

    // Əgər istifadəçi giriş ETMƏYİBSƏ və login/register-dən başqa səhifəyə keçmək istəyirsə:
    // Onu qeyd-şərtsiz Giriş səhifəsinə yönləndiririk
    if ((isLoggedIn !== 'true' || !userID) && sectionId !== 'login-section' && sectionId !== 'register-section') {
        sectionId = 'login-section';
    }

    // Əgər istifadəçi giriş EDİBSƏ və səhifə F5 olunanda səhvən login/register açılmaq istəyirsə:
    // Onu qeyd-şərtsiz əsas işçi masasına (marketplace) göndəririk
    if (isLoggedIn === 'true' && userID && (sectionId === 'login-section' || sectionId === 'register-section' || !sectionId)) {
        sectionId = 'marketplace-section';
    }

    // --- SƏHİFƏLƏRİ EKRANDA GÖSTƏRMƏK / GİZLƏMƏK MƏNTİQİ ---
    // Sənin layihəndə olan bütün əsas bölmələrin ID-ləri (Bura yeni ID-lər də əlavə edə bilərsən)
    const sections = ['login-section', 'register-section', 'marketplace-section', 'dashboard-section'];
    
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none'; // Əvvəlcə hamısını gizlət
        }
    });

    // İndi isə yalnız hədəf bölməni ekranda göstər
    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
        targetEl.style.display = 'block';
    }
}

/**
 * 2. İSTİFADƏÇİ GİRİŞ (LOGIN) FUNKSİYASI
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

        // 🔥 F5 PROBLEMİNİ BİRDƏFƏLİK HƏLL EDƏN YADDAŞ YAZILIŞI:
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userID', '650001'); // Müvəqqəti test ID-si (Gələcəkdə dinamik olacaq)

        // Giriş uğurlu olduğu üçün əsas səhifəni açırıq
        showSection('marketplace-section');
    } else {
        alert("Server cavabı: " + response);
    }
}

/**
 * 3. SİSTEMDƏN ÇIXIŞ (LOGOUT) FUNKSİYASI
 */
function logout() {
    // Brauzerin daimi yaddaşını təmizləyirik
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userID');
    
    alert("Sistemdən çıxış edildi!");
    showSection('login-section'); // Giriş ekranına qaytar
}

/**
 * 4. SƏHİFƏ HƏR DƏFƏ YÜKLƏNƏNDƏ VƏ YA F5 OLUNANDA AVTOMATİK İŞLƏYƏN HİSSƏ
 * Brauzer tam açılan kimi dərhal yaddaşı yoxlayır və istifadəçini olduğu yerdə saxlayır.
 */
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userID = localStorage.getItem('userID');

    if (isLoggedIn === 'true' && userID) {
        showSection('marketplace-section');
    } else {
        showSection('login-section');
    }
});
