/**
 * YOLASAL - UI İdarəetmə Mərkəzi
 * Naviqasiya, Canlı Statistika və Məxfi ID Məntiqli Qeydiyyat
 */

// 1. CANLI MƏLUMAT BAZASI (Simulyasiya)
const liveData = {
    'aktiv-sifaris': [
        "📦 Bakı - Gəncə: 2.5 ton tikinti materialı (Gözləmədə)",
        "📦 Sumqayıt - Quba: Məişət texnikası (Yüklənilir)",
        "📦 Şəki - Bakı: Kənd təsərrüfatı məhsulları (Təsdiqləndi)"
    ],
    'aktiv-reys': [
        "🚛 Qazax - Bakı: Yoldadır (ID: YLS-882)",
        "🚚 Qusar - Şəmkir: Marşrut üzrə hərəkət edir",
        "🚛 Lənkəran - Sumqayıt: Yoldadır (ID: YLS-104)"
    ],
    'icra-sifaris': [
        "🔄 Xaçmaz - Bakı: Yükün boşaldılması icradadır",
        "🔄 Bakı daxili: 5 fərqli ünvana çatdırılma icra olunur",
        "🔄 Beynəlxalq: İstanbul - Bakı (Gömrük rəsmiləşdirilməsi)"
    ],
    'icra-reys': [
        "🛣️ Bakı - Astara: Reys icradadır",
        "🛣️ Gəncə - Naxçıvan: Tranzit keçid icra olunur",
        "🛣️ Mingəçevir - Bakı: Geri dönüş reysi aktivdir"
    ],
    'teslimat': [
        "✅ Bakı - Gəncə: 2 ton ərzaq yükü uğurla təhvil verildi",
        "✅ Şəmkir - Bakı: Mebel dəsti tam qüsursuz təslim edildi",
        "✅ Quba - Rusiya: Meyvə yükü təyinat nöqtəsinə çatdırıldı"
    ]
};

// 2. ŞƏHƏR VƏ RAYONLAR SİYAHISI
const cities = [
    "Bakı", "Sumqayıt", "Gəncə", "Xırdalan", "Mingəçevir", "Lənkəran", "Şirvan", "Naxçıvan", 
    "Quba", "Qusar", "Xaçmaz", "Şəki", "Qəbələ", "Şamaxı", "İsmayıllı", "Göyçay", "Ağsu", 
    "Kürdəmir", "Ucar", "Yevlax", "Bərdə", "Tərtər", "Ağdam", "Füzuli", "Cəbrayıl", 
    "Zəngilan", "Qubadlı", "Laçın", "Kəlbəcər", "Şuşa", "Xocalı", "Xankəndi", "Goranboy", 
    "Naftalan", "Şəmkir", "Tovuz", "Ağstafa", "Qazax", "Gədəbəy", "Daşkəsən", "Samux", 
    "Göygöl", "Oğuz", "Balakən", "Zaqatala", "Qax", "Siyəzən", "Şabran", "Xızı", 
    "Qobustan", "Hacıqabul", "Saatlı", "Sabirabad", "İmişli", "Beyləqan", "Zərdab", 
    "Biləsuvar", "Neftçala", "Salyan", "Cəlilabad", "Masallı", "Yardımlı", "Lerik", "Astara"
];

// 3. MƏXFİ MÜŞTƏRİ ID GENERATORU
// Format: [İlin son rəqəmi][Ay][0001-9999] (Məsələn: 650001)
function generateSecretID(sequence) {
    const now = new Date(); // Cari vaxt: May 2026
    const yearDigit = now.getFullYear().toString().slice(-1); // "6"
    const month = now.getMonth() + 1; // May üçün "5"
    const paddedSequence = sequence.toString().padStart(4, '0'); // "0001"
    
    return `${yearDigit}${month}${paddedSequence}`;
}

// Səhifə yüklənəndə ilkin işlər
document.addEventListener('DOMContentLoaded', () => {
    // Şəhərləri doldur
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        cities.sort().forEach(city => {
            let opt = document.createElement('option');
            opt.value = city;
            opt.innerHTML = city;
            citySelect.appendChild(opt);
        });
    }
});

// 4. STATİSTİKA MODALINI İDARƏ ETMƏK
function showLiveDetails(type) {
    const modal = document.getElementById("activityModal");
    const title = document.getElementById("modalTitle");
    const dataList = document.getElementById("modalData");
    
    const titles = {
        'aktiv-sifaris': 'Aktiv Sifarişlər',
        'aktiv-reys': 'Aktiv Reyslər',
        'icra-sifaris': 'İcrada olan Sifarişlər',
        'icra-reys': 'İcrada olan Reyslər',
        'teslimat': 'Son 24 Saatdakı Təslimatlar'
    };

    title.innerText = titles[type];
    
    if (liveData[type]) {
        dataList.innerHTML = liveData[type]
            .map(item => `<div>${item}</div>`)
            .join('');
    }
    
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeActivityModal() {
    document.getElementById("activityModal").style.display = "none";
    document.body.style.overflow = "auto";
}

// 5. GİRİŞ/QEYDİYYAT MODAL İDARƏETMƏSİ
const loginModal = document.getElementById('loginModal');

document.getElementById('loginBtn')?.addEventListener('click', () => {
    loginModal.style.display = 'flex';
    document.body.style.overflow = "hidden";
});

document.getElementById('closeLogin')?.addEventListener('click', () => {
    loginModal.style.display = 'none';
    document.body.style.overflow = "auto";
});

document.getElementById('showReg')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginFormArea').style.display = 'none';
    document.getElementById('regFormArea').style.display = 'block';
});

document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('regFormArea').style.display = 'none';
    document.getElementById('loginFormArea').style.display = 'block';
});

// 6. QEYDİYYATI TAMAMLA DÜYMƏSİ (ID GENERASİYASI)
document.getElementById('finishRegBtn')?.addEventListener('click', function() {
    // Buraya gələcəkdə Google Sheet-dən gələn son sıra nömrəsi qoyulacaq.
    // Simulyasiya üçün hələlik 1 götürürük.
    const mockSequence = 1; 
    
    const secretID = generateSecretID(mockSequence);
    
    // ID-ni gizli inputa yazırıq
    document.getElementById('hiddenCustomerID').value = secretID;

    // Yoxlama üçün (Development zamanı):
    console.log("Məxfi Yaradılmış Müştəri ID-si:", secretID);

    // Bura gələcəkdə Təsdid Kodu və Google Sheets göndərmə məntiqi əlavə olunacaq
    alert("Qeydiyyat məlumatları qəbul edildi. Təhlükəsizlik üçün ID mərkəzi bazada qeyd olundu.");
});

// 7. NAVİQASİYA (SCROLL)
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        window.scrollTo({
            top: element.offsetTop - 90,
            behavior: "smooth"
        });
    }
}

// 8. KƏNAR KLİKLƏR
window.onclick = function(event) {
    if (event.target == document.getElementById("activityModal")) closeActivityModal();
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = "auto";
    }
};
