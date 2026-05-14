/**
 * Yolasal Premium Logistics - UI Controller
 * Bütün keçidlər və interaktiv elementlər burada idarə olunur.
 */

// 1. SƏHİFƏNİN BÖLMƏLƏRİNƏ SƏLİS SÜRÜŞMƏ (SMOOTH SCROLL)
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        // Navbarın hündürlüyünü (90px) nəzərə alırıq ki, başlıq navbarın altında qalmasın
        const offset = 95; 
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    } else {
        console.error("Hədəf bölmə tapılmadı ID: " + id);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("Yolasal UI sistemi uğurla işə düşdü.");

    // 2. MÜŞTƏRİ GİRİŞİ (MODAL PƏNCƏRƏSİ) İDARƏEDİCİSİ
    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            // Modalı HTML-ə əlavə edirik
            const modalHTML = `
                <div id="loginModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:10001; backdrop-filter: blur(8px);">
                    <div style="background:white; padding:45px; border-radius:24px; width:400px; position:relative; text-align:center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                        <span id="closeModal" style="position:absolute; top:20px; right:25px; cursor:pointer; font-size:30px; color:#999;">&times;</span>
                        <h2 style="margin-bottom:25px; color:#222; font-weight:700; font-family: 'Segoe UI', sans-serif;">Müştəri Girişi</h2>
                        
                        <input type="email" id="userEmail" placeholder="E-poçt ünvanı" style="width:100%; padding:15px; margin-bottom:15px; border:1px solid #eee; border-radius:12px; outline:none; font-size:16px; background:#f9f9f9;">
                        <input type="password" id="userPass" placeholder="Şifrə" style="width:100%; padding:15px; margin-bottom:25px; border:1px solid #eee; border-radius:12px; outline:none; font-size:16px; background:#f9f9f9;">
                        
                        <button id="submitLogin" style="width:100%; padding:16px; background:#A68B5C; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold; font-size:17px; transition:0.3s; box-shadow: 0 5px 15px rgba(166,139,92,0.3);">Daxil Ol</button>
                        
                        <div style="margin-top:30px; font-size:14px; color:#666;">
                            <p style="margin-bottom:10px; cursor:pointer; color:#A68B5C; font-weight:600;">Şifrəni bərpa et</p>
                            <p>Hesabınız yoxdur? <span style="color:#A68B5C; cursor:pointer; font-weight:bold;">Qeydiyyatdan keçin</span></p>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Modalı bağlamaq üçün funksiyalar
            const modal = document.getElementById("loginModal");
            const closeBtn = document.getElementById("closeModal");

            closeBtn.onclick = () => modal.remove();
            
            // Modalın kənarına (qara hissəyə) basanda bağlanması
            window.onclick = (event) => {
                if (event.target == modal) modal.remove();
            };

            // Giriş düyməsinin məntiqi (auth.js ilə inteqrasiya üçün)
            document.getElementById("submitLogin").onclick = async function() {
                const email = document.getElementById("userEmail").value;
                const pass = document.getElementById("userPass").value;

                if (email && pass) {
                    if (typeof login === "function") {
                        await login(email, pass);
                    } else {
                        console.warn("auth.js yüklənməyib, simulyasiya edilir...");
                        alert("Sistemə daxil olunur: " + email);
                    }
                } else {
                    alert("Zəhmət olmasa bütün xanaları doldurun!");
                }
            };
        });
    }

    // 3. YÜKÜ İZLƏMƏ (SEARCH) PANELİ
    const searchBtn = document.querySelector(".btn-search");
    const trackInput = document.getElementById("trackInput");

    if (searchBtn && trackInput) {
        searchBtn.addEventListener("click", function() {
            const trackCode = trackInput.value.trim();
            if (trackCode) {
                // Burada gələcəkdə API-yə sorğu göndəriləcək
                alert("Yük məlumatları axtarılır: " + trackCode);
            } else {
                alert("Zəhmət olmasa izləmə nömrəsini daxil edin.");
                trackInput.focus();
            }
        });

        // Enter düyməsi ilə axtarış
        trackInput.addEventListener("keypress", function(e) {
            if (e.key === 'Enter') searchBtn.click();
        });
    }
});
