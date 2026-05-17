// ==========================================================================
// İSTİFADƏÇİ GİRİŞ (LOGIN) VƏ SESSİYA IDARƏEDİCİSİ
// ==========================================================================

/**
 * İstifadəçi Giriş Funksiyası
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

        // 🔥 F5 PROBLEMİNİN HƏLLİ: Giriş məlumatlarını brauzerin daimi yaddasına yazırıq
        localStorage.setItem('isLoggedIn', 'true');
        
        // Gələcəkdə hər müştərinin öz real ID-si gələndə bura yazılacaq. 
        // Hələlik test üçün statik "650001" qoyuruq ki, sistem işləsin.
        localStorage.setItem('userID', '650001'); 

        // Sistemə daxil edirik
        showSection('marketplace-section');
    } else {
        alert("Server cavabı: " + response);
    }
}

/**
 * 🔥 F5 BASANDA PROFİLDƏN ÇIXMAMAQ ÜÇÜN AVTOMATİK YOXLAYICI
 * Səhifə hər dəfə yenilənəndə (F5) brauzer yaddasını yoxlayır
 */
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userID = localStorage.getItem('userID');

    // Əgər istifadəçi bayaq giriş edibsə və yaddaşda varsa:
    if (isLoggedIn === 'true' && userID) {
        // Avtomatik olaraq onu əsas profil bölməsinə keçir, login ekranında saxlama!
        showSection('marketplace-section');
    } else {
        // Əgər giriş etməyibsə, loqin ekranını göstər
        showSection('login-section'); // Qeyd: Əgər səndə login bölməsinin adı fərqlidirsə (məs: 'auth-section'), onu yazarsan.
    }
});

/**
 * Sistemdən Çıxış (Log out) Funksiyası
 * İstifadəçi özü istəyərək çıxmaq istəyəndə bu funksiyanı çağırırıq
 */
function logout() {
    // Brauzerin yaddaşını tam təmizləyirik
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userID');
    
    alert("Sistemdən çıxış edildi!");
    showSection('login-section'); // Yenidən login ekranına qaytarır
}
