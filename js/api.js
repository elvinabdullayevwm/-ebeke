const scriptURL = "BURA_OZ_SCRIPT_URL_NI_YAPISDIR";

async function apiCall(data) {
    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const result = await response.text();
        return result;
    } catch (error) {
        console.error("Şəbəkə xətası:", error);
        return "error";
    }
}
