document.addEventListener("DOMContentLoaded", function() {
    // Müştəri Girişi Düyməsi
    const loginBtn = document.querySelector(".btn-customer");
    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            const email = prompt("E-poçt:");
            const pass = prompt("Şifrə:");
            if (email && pass) {
                login(email, pass); // auth.js-dəki funksiya
            }
        });
    }

    // Yükü İzlə Düyməsi
    const searchBtn = document.querySelector(".btn-search");
    if (searchBtn) {
        searchBtn.addEventListener("click", function() {
            const trackCode = document.getElementById("trackInput").value;
            if (trackCode) {
                alert("Yük axtarılır: " + trackCode);
            } else {
                alert("Zəhmət olmasa izləmə kodunu daxil edin.");
            }
        });
    }
});
