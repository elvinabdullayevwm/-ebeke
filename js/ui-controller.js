document.addEventListener("DOMContentLoaded", function() {
    console.log("UI Controller işə düşdü!");

    // Müştəri Girişi
    const loginBtn = document.querySelector(".btn-customer");
    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            const email = prompt("E-poçt ünvanınız:");
            const pass = prompt("Şifrəniz:");
            if (email && pass) {
                // auth.js-dəki login funksiyasını çağırır
                login(email, pass); 
            }
        });
    }

    // Yükü İzlə
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
