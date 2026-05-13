async function login(email, pass) {
    if (!email || !pass) {
        alert("Zəhmət olmasa, bütün sahələri doldurun!");
        return;
    }

    console.log("Giriş cəhdi edilir:", email);

    // Backend-ə göndəriləcək paket
    const requestData = {
        action: "login",
        email: email,
        password: pass
    };

    try {
        // api.js-dəki apiCall funksiyasını çağırırıq
        const response = await apiCall(requestData);
        
        // Backend-dən gələn cavabı analiz edirik
        if (response.includes("Uğurlu") || response.includes("Login sorğusu")) {
            alert("Sistemə giriş uğurludur!");
            showSection('marketplace-section'); // Girişdən sonra Yük Birjasına keçid
        } else {
            alert("Xəta: " + response);
        }
    } catch (error) {
        console.error("Login xətası:", error);
        alert("Sistemlə əlaqə kəsildi!");
    }
}
