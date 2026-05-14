document.addEventListener("DOMContentLoaded", function() {
    console.log("Yolasal UI Controller Aktivdir!");

    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            // Modal pəncərəsinin HTML strukturu
            const modalHTML = `
                <div id="loginModal">
                    <div class="modal-content fade-in">
                        <span class="close-btn" id="closeModal">&times;</span>
                        <h2>Müştəri Girişi</h2>
                        
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

            // Modalı səhifəyə əlavə edirik
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // --- MODAL DAXİLİ FUNKSİYALAR ---

            // 1. Modalı bağlamaq
            document.getElementById("closeModal").onclick = function() {
                document.getElementById("loginModal").remove();
            };

            // 2. Daxil ol düyməsi (auth.js ilə əlaqəli)
            document.getElementById("submitLogin").onclick = async function() {
                const email = document.getElementById("userEmail").value;
                const pass = document.getElementById("userPass").value;

                if (email && pass) {
                    // auth.js faylındakı login funksiyasını çağırırıq
                    if (typeof login === "function") {
                        await login(email, pass);
                    } else {
                        alert("Giriş sistemi hələ tam qoşulmayıb (auth.js yoxlanılmalıdır).");
                    }
                } else {
                    alert("Zəhmət olmasa e-poçt və şifrəni daxil edin.");
                }
            };

            // 3. Qeydiyyat düyməsi (Hələlik sadə bildiriş)
            document.getElementById("goToRegister").onclick = function() {
                alert("Qeydiyyat bölməsinə yönləndirilir...");
            };

            // 4. Şifrə bərpa düyməsi
            document.getElementById("recoverPass").onclick = function() {
                alert("Şifrə bərpa linki e-poçtunuza göndəriləcək.");
            };

            // Modalın kənarına basanda bağlanması
            window.onclick = function(event) {
                const modal = document.getElementById("loginModal");
                if (event.target == modal) {
                    modal.remove();
                }
            };
        });
    }

    // Yükü İzlə düyməsi üçün funksiya
    const searchBtn = document.querySelector(".btn-search");
    if (searchBtn) {
        searchBtn.addEventListener("click", function() {
            const trackCode = document.getElementById("trackInput").value;
            if (trackCode) {
                alert("Axtarılır: " + trackCode);
            } else {
                alert("Zəhmət olmasa izləmə nömrəsini daxil edin.");
            }
        });
    }
});
