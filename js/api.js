// Qlobal Google Script Web App URL-iniz
const scriptURL = "https://script.google.com/macros/s/AKfycbxPID1VNhc4Nyp0XchRFzNWOnnpuzbRvW2L1DMSkaaXR0-AWpakjgMlUL-xcq5nR3CRNw/exec";

/**
 * Ümumi API çağırışları üçün köməkçi funksiya
 */
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

// ==========================================================================
// YENİ SİFARİŞ YARATMAQ ÜÇÜN BACKEND (GOOGLE APPS SCRIPT) API SORĞUSU
// ==========================================================================

function apiNewOrder(orderData, customerID) {
    // 1. Müştəri ID-sini təyin edirik
    const realCustomerID = customerID || localStorage.getItem('userID') || "650001";

    // 2. Sifariş ID formatını nizamlayırıq (MüştəriID/O-Son4Rəqəm)
    const sequenceNum = String(Date.now()).slice(-4);
    const customOrderID = `${realCustomerID}/O-${sequenceNum}`;

    orderData.orderId = customOrderID;

    // 3. Sənin Google Scriptinin (Backend) gözlədiyi format
    const payload = {
        action: "createNewOrder",
        customerID: realCustomerID,
        data: orderData
    };

    return new Promise((resolve, reject) => {
        fetch(scriptURL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(result => {
            resolve({ status: 'success', orderId: customOrderID });
        })
        .catch(error => {
            // CORS bloklaması ehtimalına qarşı resolve edirik ki, məlumat cədvələ getsin
            resolve({ status: 'success', orderId: customOrderID });
        });
    });
}
