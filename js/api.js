const scriptURL = "BURA_OZ_SCRIPT_URL_NI_YAPISDIR";

async function apiCall(data) {
    const response = await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
    });
    return response;
}
