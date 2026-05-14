// 1. SƏHİFƏNİN MÜEYYƏN HİSSƏSİNƏ SƏLİS SÜRÜŞMƏ FUNKSİYASI
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        // Navbarın hündürlüyünü (təxminən 95px) nəzərə alırıq ki, başlıq görünməz qalmasın
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
        console.error("Hədəf bölmə tapılmadı: " + id);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("Yolasal UI Sistemi aktivdir!");

    // 2. MÜŞTƏRİ GİRİŞİ (MODAL PƏNCƏRƏSİ)
    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            const modalHTML = `
                <div id="loginModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:10000;">
                    <div style="background:white; padding:45px; border-radius:20px; width:400px; position:relative; text-align:center; box-shadow: 0 25px 50px rgba(0,0,0,0.2);">
                        <span id="closeModal" style="position:absolute; top:20px; right:25px; cursor:pointer; font-size:28px; color:#aaa;">&times;</span>
                        <h2 style="margin-bottom:30px; color:#333; font-weight:700;">Müştəri Girişi</h2>
                        
                        <input type="email" id="userEmail" placeholder="E-poçt ünvanınız" style="width:100%; padding:15px; margin-bottom:15px; border:1px solid #ddd; border-radius:10px; outline:none; font-size:16px;">
                        <input type="password" id="userPass" placeholder="Şifrəniz" style="width:100%; padding:15px; margin-bottom:25px; border:1px solid #ddd; border-radius:10px; outline:none; font-size:16px;">
                        
                        <button id="submitLogin" style="width:100%; padding:15px; background:#A68B5C; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold; font-size:17px; transition:0.3s;">Daxil Ol</button>
                        
                        <div style="margin-top:30px; font-size:14px; color:#666;">
                            <p style="margin-bottom:12px; cursor:pointer; color:#A68B5C; font-weight:600;">Şifrəni bərpa et</p>
                            <p>Hesabınız yoxdur? <span style="color:#A68B5C; cursor:pointer; font-weight:bold;">Qeydiyyatdan keçin</span></p>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Modalı bağlamaq
            document.getElementById("closeModal").onclick = function() {
                document.getElementById("loginModal").remove();
            };

            // Daxil ol düyməsi
            document.getElementById("submitLogin").onclick = async function() {
                const email = document.getElementById("userEmail").value;
                const pass = document.getElementById("userPass").value;
                if (email && pass) {
                    if (typeof login === "function") {
                        await login(email, pass);
                    } else {
                        alert("Giriş funksiyası yüklənməyib.");
                    }
                } else {
                    alert("Zəhmət olmasa bütün xanaları doldurun!");
                }
            };

            // Modalın kənarına basanda bağlamaq
            window.onclick = function(event) {
                const modal = document.getElementById("loginModal");
                if (event.target == modal) modal.remove();
            };
        });
    }

    // 3. YÜKÜ İZLƏ DÜYMƏSİ
    const searchBtn = document.querySelector(".btn-search");
    if (searchBtn) {
        searchBtn.addEventListener("click", function() {
            const trackCode = document.getElementById("trackInput").value;
            if (trackCode) {
                alert("Yükünüz sistemdə axtarılır: " + trackCode);
            } else {
                alert("Zəhmət olmasa izləmə nömrəsini daxil edin.");
            }
        });
    }
});
