const scriptURL = "BURA_OZ_SCRIPT_URL_NI_YAPISDIR";

async function apiCall(data) {
    try {
        // 'no-cors' sildik ki, serverin cavabını eşidə bilək
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(data) 
        });

        // Serverdən gələn mətni oxuyuruq
        const result = await response.text();
        console.log("Serverin cavabı:", result);
        return result; 

    } catch (error) {
        console.error("Şəbəkə xətası:", error);
        return "error";
    }
}
