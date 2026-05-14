document.addEventListener("DOMContentLoaded", function() {
    console.log("Yolasal UI sistemi tam aktivdir!");

    // --- 1. MENYU DÜYMƏLƏRİNİN SƏLİS SÜRÜŞMƏSİ (SMOOTH SCROLL) ---
    const navLinks = document.querySelectorAll(".nav-links li");

    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            const targetId = this.getAttribute("data-target");
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Səhifəni həmin hissəyə səlis şəkildə sürüşdürürük
                window.scrollTo({
                    top: targetElement.offsetTop - 90, // Navbarın hündürlüyünü nəzərə alırıq
                    behavior: "smooth"
                });
            }
        });
    });

    // --- 2. MÜŞTƏRİ GİRİŞİ (MODAL PƏNCƏRƏSİ) ---
    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            const modalHTML = `
                <div id="loginModal">
                    <div class="modal-content">
                        <span class="close-btn" id="closeModal">&times;</span>
                        <h2 style="font-family: 'Segoe UI', sans-serif;">Müştəri Girişi</h2>
                        
                        <input type="email" id="userEmail" class="modal-input" placeholder="E-poçt ünvanınız">
                        <input type="password" id="userPass" class="modal-input" placeholder="Şifrəniz">
                        
                        <button id="submitLogin" class="modal-btn">Daxil Ol</button>
                        
                        <div class="modal-links">
                            <p><span class="modal-link-gold" id="recoverPass">Şifrəni bərpa et</span></p>
                            <p>Hesabınız yoxdur? <span class="modal-link-gold" id="goToRegister">Qeydiyyatdan keçin</span></p>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Modalı bağlamaq
            document.getElementById("closeModal").onclick = () => document.getElementById("loginModal").remove();

            // Daxil ol düyməsi (auth.js funksiyasını çağırır)
            document.getElementById("submitLogin").onclick = async function() {
                const email = document.getElementById("userEmail").value;
                const pass = document.getElementById("userPass").value;
                if (email && pass) {
                    if (typeof login === "function") {
                        await login(email, pass);
                    } else {
                        alert("Giriş funksiyası (auth.js) hələ yüklənməyib.");
                    }
                } else {
                    alert("Zəhmət olmasa bütün xanaları doldurun!");
                }
            };

            // Kənara basanda bağlamaq
            window.onclick = (event) => {
                const modal = document.getElementById("loginModal");
                if (event.target == modal) modal.remove();
            };
        });
    }

    // --- 3. YÜKÜ İZLƏ DÜYMƏSİ ---
    const searchBtn = document.querySelector(".btn-search");
    if (searchBtn) {
        searchBtn.addEventListener("click", function() {
            const trackCode = document.getElementById("trackInput").value;
            if (trackCode) {
                alert("Yükünüz sistemdə axtarılır: " + trackCode);
                // Bura gələcəkdə API izləmə funksiyası əlavə olunacaq
            } else {
                alert("Zəhmət olmasa izləmə nömrəsini daxil edin.");
            }
        });
    }
});
