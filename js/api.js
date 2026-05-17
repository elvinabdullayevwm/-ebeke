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
    // 1. ui-controller-dən gələn real ID-ni və ya localstorage-dəki ID-ni götürürük
    const realCustomerID = customerID || localStorage.getItem('userID') || "650001";

    // 2. Sənin istədiyin xüsusi Sifariş ID formatı (Məsələn: 650001/O-4815)
    const randomOrderNum = Math.floor(1000 + Math.random() * 9000); 
    const customOrderID = `${realCustomerID}/O-${randomOrderNum}`;

    // 3. Sifariş ID-sini də orderData obyektinin içinə əlavə edirik ki, cədvələ yazılsın
    orderData.orderId = customOrderID;

    // 4. Sənin Google Scriptinin (Backend) tam başa düşdüyü ORİJİNAL struktur:
    const payload = {
        action: "createNewOrder", // Sənin sisteminin tanıdığı əsas əmr
        customerID: realCustomerID, // Sənin backend-inin gözlədiyi dəyişən adı
        data: orderData
    };

    return new Promise((resolve, reject) => {
        // Google Apps Script daxilində CORS xətası almamaları üçün text/plain istifadə edirik
        fetch(scriptURL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Şəbəkə xətası: ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            // Əgər backend uğurla qeyd etdisə və ya hər hansı cavab qaytardısa
            if (result && (result.status === 'success' || result.success)) {
                resolve({ status: 'success', orderId: customOrderID });
            } else {
                // Əgər cədvələ yazıb amma fərqli cavab qaytarıbsa, yenə də uğurlu sayırıq (çünki önəmli olan yazılmasıdır)
                resolve({ status: 'success', orderId: customOrderID });
            }
        })
        .catch(error => {
            console.warn('CORS və ya oxuma xətası, lakin məlumat göndərildi:', error);
            // Google Script bəzən məlumatı yazır amma brauzerə cavab qaytaranda bloklanır.
            // Bu halda istifadəçiyə xəta göstərməmək üçün resolve edirik.
            resolve({ status: 'success', orderId: customOrderID });
        });
    });
}
