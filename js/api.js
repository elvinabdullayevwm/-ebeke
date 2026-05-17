// Qlobal Google Script Web App URL-iniz
const scriptURL = "https://script.google.com/macros/s/AKfycbzj22Q5k322SZmzGz3i59MlwBjlOK208L6DlDPvgdUjm-vG0ajJ5CzoYCEszd1ERbQL8w/exec";

/**
 * Ümumi API çağırışları üçün köməkçi funksiya (Köhnə kodlardan qalan)
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

/**
 * Sifariş məlumatlarını götürür, Müştəri və Sifariş ID-lərini nizamlayır və backend-ə göndərir.
 * @param {Object} orderData - Formdan gələn sahələr
 * @param {string} customerID - ui-controller tərəfindən oxunan real Müştəri ID-si
 */
function apiNewOrder(orderData, customerID) {
    // 1. ui-controller-dən gələn ID yoxdursa, localstorage və ya ehtiyat ID-ni götürürük
    const realCustomerID = customerID || localStorage.getItem('userID') || "650001";

    // 2. İstədiyin formatda unikal Sifariş ID-si yaradırıq (Məsələn: 650001/O-4815)
    const randomOrderNum = Math.floor(1000 + Math.random() * 9000); 
    const customOrderID = `${realCustomerID}/O-${randomOrderNum}`;

    // 3. Google Sheets-ə göndəriləcək mərkəzi məlumat paketi
    const payload = {
        action: "newOrder", // Google Script tərəfində bu action-a uyğun şərt yazılmalıdır
        customerId: realCustomerID,
        orderId: customOrderID,
        ...orderData
    };

    // 4. Məlumatı asinxron şəkildə Google Apps Script-ə ötürürük
    return new Promise((resolve, reject) => {
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // CORS xətalarının qarşısını almaq üçün ən təhlükəsiz rejim
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(() => {
            // no-cors rejimində brauzer birbaşa response oxuya bilmədiyi üçün
            // məlumatın uğurla yola düşməsini "success" qəbul edib Sifariş ID-sini geri qaytarırıq
            resolve({ status: 'success', orderId: customOrderID });
        })
        .catch(error => {
            console.error('apiNewOrder daxilində şəbəkə xətası:', error);
            reject(error.message || error);
        });
    });
}
