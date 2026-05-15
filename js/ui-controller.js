/**
 * YOLASAL - UI İdarəetmə Mərkəzi
 * Bu skript həm naviqasiyanı, həm də canlı fəaliyyət panelini idarə edir.
 */

// 1. CANLI MƏLUMAT BAZASI (Simulyasiya)
// Bu məlumatlar müştəridə həvəs və güvən oyatmaq üçün nəzərdə tutulub.
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
        "✅ Quba - Rusiya: Meyvə yükü təyinat nöqtəsinə çatdırıldı",
        "✅ Sumqayıt daxili: Tikinti materialları ünvana təslim edildi"
    ]
};

// 2. MODAL PƏNCƏRƏSİNİ İDARƏ ETMƏK
function showLiveDetails(type) {
    const modal = document.getElementById("activityModal");
    const title = document.getElementById("modalTitle");
    const dataList = document.getElementById("modalData");
    
    // Başlıqların Azərbaycan dilində qarşılığı
    const titles = {
        'aktiv-sifaris': 'Aktiv Sifarişlər',
        'aktiv-reys': 'Aktiv Reyslər',
        'icra-sifaris': 'İcrada olan Sifarişlər',
        'icra-reys': 'İcrada olan Reyslər',
        'teslimat': 'Son 24 Saatdakı Təslimatlar'
    };

    // Başlığı və məlumat siyahısını yeniləyirik
    title.innerText = titles[type];
    
    if (liveData[type]) {
        dataList.innerHTML = liveData[type]
            .map(item => `<div>${item}</div>`)
            .join('');
    } else {
        dataList.innerHTML = "<div>Hazırda aktiv məlumat tapılmadı.</div>";
    }
    
    // Modalı göstər
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Arxa fonun scroll olmasını dayandırır
}

function closeActivityModal() {
    const modal = document.getElementById("activityModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Scroll-u bərpa edir
}

// 3. NAVİQASİYA (SCROLL) FUNKSİYASI
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = 90; // Navbar hündürlüyü
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

// 4. KƏNAR KLİKLƏRİ TUTMAQ (Modalı bağlamaq üçün)
window.onclick = function(event) {
    const modal = document.getElementById("activityModal");
    if (event.target == modal) {
        closeActivityModal();
    }
};

// 5. LOGIN DÜYMƏSİ ÜÇÜN KLİK (Hələlik sadə alert)
document.getElementById('loginBtn')?.addEventListener('click', () => {
    alert("Müştəri Paneli tezliklə aktiv olacaq!");
});
