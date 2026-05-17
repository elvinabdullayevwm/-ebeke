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
// ==========================================================================
// YENİ SİFARİŞ YARATMAQ ÜÇÜN BACKEND (GOOGLE APPS SCRIPT) API SORĞUSU
// ==========================================================================

/**
 * Yeni sifariş məlumatlarını götürür və Google Script URL-nə POST sorğusu göndərir.
 * @param {Object} orderData - Formdan gələn 16 əsas sütun məlumatı
 * @returns {Promise} Backend-dən gələn cavab (Success/Error)
 */
function apiNewOrder(orderData) {
    // Burada sizin mövcud təyin olunmuş Google Script Web App URL-iniz istifadə olunmalıdır.
    // Əgər scriptURL dəyişəni api.js daxilində yuxarıda artıq qlobal olaraq varsa, bu sətri silə bilərsiniz.
    const WEB_SCRIPT_URL = typeof scriptURL !== 'undefined' ? scriptURL : 'SİZİN_GOOGLE_SCRIPT_WEB_APP_URL_UNUZ';

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
