async function login(email, pass) {
    if (!email || !pass) {
        alert("Bütün xanaları doldurun!");
        return;
    }

    const requestData = {
        action: "login",
        email: email,
        password: pass
    };

    const response = await apiCall(requestData);
    
    if (response.includes("Uğurlu") || response.includes("Login sorğusu")) {
        alert("Giriş edildi!");
        showSection('marketplace-section');
    } else {
        alert("Server cavabı: " + response);
    }
}
