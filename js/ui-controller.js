// SƏLİS SÜRÜŞMƏ FUNKSİYASI
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        window.scrollTo({
            top: element.offsetTop - 90,
            behavior: "smooth"
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // MODALI İDARƏ ETMƏK
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            const modalHTML = `
                <div id="loginModal">
                    <div class="modal-content">
                        <span class="close-btn" id="closeModal">&times;</span>
                        <h2 style="margin-bottom:25px;">Müştəri Girişi</h2>
                        <input type="email" placeholder="E-poçt" style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                        <input type="password" placeholder="Şifrə" style="width:100%; padding:12px; margin-bottom:20px; border:1px solid #ddd; border-radius:8px;">
                        <button style="width:100%; padding:12px; background:#A68B5C; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">Daxil Ol</button>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.getElementById("closeModal").onclick = () => document.getElementById("loginModal").remove();
        });
    }
});
