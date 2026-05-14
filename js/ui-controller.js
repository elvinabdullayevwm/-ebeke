// SƏLİS SÜRÜŞMƏ
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        const offset = 100; // Navbar hündürlüyü
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth"
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // LOGIN MODALI
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            const modalHTML = `
                <div id="loginModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:10001; backdrop-filter: blur(5px);">
                    <div style="background:white; padding:40px; border-radius:20px; width:380px; position:relative; text-align:center;">
                        <span id="closeModal" style="position:absolute; top:15px; right:20px; cursor:pointer; font-size:28px;">&times;</span>
                        <h2 style="margin-bottom:25px;">Müştəri Girişi</h2>
                        <input type="email" id="userEmail" placeholder="E-poçt" style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                        <input type="password" id="userPass" placeholder="Şifrə" style="width:100%; padding:12px; margin-bottom:20px; border:1px solid #ddd; border-radius:8px;">
                        <button id="submitLogin" style="width:100%; padding:12px; background:#A68B5C; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">Daxil Ol</button>
                        <div style="margin-top:20px; font-size:14px;">
                            <p style="color:#A68B5C; cursor:pointer; margin-bottom:10px;">Şifrəni bərpa et</p>
                            <p>Hesabınız yoxdur? <span style="font-weight:bold; cursor:pointer; color:#A68B5C;">Qeydiyyatdan keçin</span></p>
                        </div>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.getElementById("closeModal").onclick = () => document.getElementById("loginModal").remove();
            window.onclick = (e) => { if(e.target.id === "loginModal") document.getElementById("loginModal").remove(); };
        });
    }
});
