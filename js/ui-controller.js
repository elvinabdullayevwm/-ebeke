document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.querySelector(".btn-customer");

    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            const loginHTML = `
                <div id="loginModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:10000;">
                    <div style="background:white; padding:40px; border-radius:15px; width:380px; position:relative; text-align:center;">
                        <span id="closeModal" style="position:absolute; top:15px; right:20px; cursor:pointer; font-size:24px; color:#999;">&times;</span>
                        <h2 style="margin-bottom:25px; color:#333;">Müştəri Girişi</h2>
                        
                        <input type="email" id="userEmail" placeholder="E-poçt ünvanı" style="width:100%; padding:14px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px; outline:none;">
                        <input type="password" id="userPass" placeholder="Şifrə" style="width:100%; padding:14px; margin-bottom:20px; border:1px solid #ddd; border-radius:8px; outline:none;">
                        
                        <button id="submitLogin" style="width:100%; padding:14px; background:#A68B5C; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:16px;">Daxil Ol</button>
                        
                        <div style="margin-top:25px; font-size:14px; color:#666; line-height:1.6;">
                            <p style="margin-bottom:10px; cursor:pointer; color:#A68B5C; font-weight:500;">Şifrəni bərpa et</p>
                            <p>Hesabınız yoxdur? <span style="color:#A68B5C; cursor:pointer; font-weight:bold;">Qeydiyyatdan keçin</span></p>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', loginHTML);

            document.getElementById("closeModal").onclick = () => document.getElementById("loginModal").remove();

            document.getElementById("submitLogin").onclick = async function() {
                const email = document.getElementById("userEmail").value;
                const pass = document.getElementById("userPass").value;
                if(email && pass) {
                    await login(email, pass); // auth.js-dəki funksiya
                } else {
                    alert("Zəhmət olmasa bütün xanaları doldurun!");
                }
            };
        });
    }
});
