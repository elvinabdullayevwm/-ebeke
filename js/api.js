const scriptURL = "https://script.google.com/macros/s/AKfycbzj22Q5k322SZmzGz3i59MlwBjlOK208L6DlDPvgdUjm-vG0ajJ5CzoYCEszd1ERbQL8w/exec";

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

/**
 * Yeni sifariş məlumatlarını götürür və Google Script URL-nə POST sorğusu göndərir.
 * @param {Object} orderData - Formdan gələn 16 əsas sütun məlumatı
 * @returns {Promise} Backend-dən gələn cavab (Success/Error)
 */
function apiNewOrder(orderData, customerID) {
    // 1. Mövcud Google Script Web App URL-ini bura daxil et (Dırnaq işarələrinin içinə)
    const WEB_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb...bura_sənin_real_linkin_gələcək.../exec'; 

    // 2. ui-controller-dən gələn real Müştəri ID-sini götürürük
    const realCustomerID = customerID || localStorage.getItem('userID') || "650001";

    // 3. Sənin istədiyin riyazi formatda Sifariş ID-si (MüştəriID/O-Təsadüfi4Rəqəm)
    // Məsələn: 650001/O-4815
    const randomOrderNum = Math.floor(1000 + Math.random() * 9000); 
    const customOrderID = `${realCustomerID}/O-${randomOrderNum}`;

    // 4. Google Sheets-ə göndəriləcək təmiz məlumat paketi
    const payload = {
        action: "newOrder",
        customerId: realCustomerID,   // Bura artıq "MÜŞTƏRİ-01" yox, məsələn "650001" gedəcək
        orderId: customOrderID,       // Bura isə "650001/O-4815" gedəcək
        ...orderData
    };

    // Google Sheets-ə məlumatı POST sorğusu ilə göndəririk
    return fetch(WEB_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(res => {
        // no-cors rejimində brauzer cavabı birbaşa oxuya bilmədiyi üçün obyekti uğurlu sayırıq
        return { success: true, orderId: customOrderID };
    });
}

    // Cari daxil olmuş istifadəçinin (müştərinin) unikal ID-sini götürürük
    // Bu məlumat böyük ehtimalla auth.js və ya localŞtorage daxilində saxlanılır
    const currentUserID = typeof currentUser !== 'undefined' && currentUser.id ? currentUser.id : (localStorage.getItem('userID') || 'MÜŞTƏRİ-01');

    // Backend-ə (Main.gs) hansı əməliyyatı etdiyimizi bildirmək üçün action və lazımi datanı hazırlayırıq
    const payload = {
        action: "createNewOrder",
        customerID: currentUserID,
        data: orderData
    };

    return new Promise((resolve, reject) => {
        fetch(WEB_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain; charset=utf-8' // Google Apps Script CORS xətası verməməsi üçün text/plain idealdır
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Şəbəkə xətası baş verdi: ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            if (result && result.status === 'success') {
                resolve(result);
            } else {
                reject(result && result.message ? result.message : 'Sifariş qeyd edilərkən backend xətası baş verdi.');
            }
        })
        .catch(error => {
            console.error('apiNewOrder daxilində xəta:', error);
            reject(error.message || error);
        });
    });
}
