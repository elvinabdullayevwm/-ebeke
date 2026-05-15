/**
 * YOLASAL - UI İdarəetmə Mərkəzi
 * Naviqasiya, Canlı Statistika və Müştəri Paneli məntiqləri
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

// 2. ŞƏHƏR VƏ RAYONLAR SİYAHISI (Qeydiyyat üçün)
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

// Səhifə yüklənəndə şəhərləri select-ə doldur
document.addEventListener('DOMContentLoaded', () => {
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        cities.sort().forEach(city => {
            let opt = document.createElement('option');
            opt.value = city;
            opt.innerHTML = city;
            citySelect.appendChild(opt);
        });
    }
    
    // Təsadüfi Müştəri ID-si yarat
    const idDisplay = document.getElementById('generatedID');
    if (idDisplay) {
        idDisplay.innerText = "YLS-" + Math.floor(100000 + Math.random() * 900000);
    }
});

// 3. STATİSTİKA MODALINI İDARƏ ETMƏK
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
    } else {
        dataList.innerHTML = "<div>Hazırda aktiv məlumat tapılmadı.</div>";
    }
    
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeActivityModal() {
    const modal = document.getElementById("activityModal");
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// 4. MÜŞTƏRİ GİRİŞİ VƏ QEYDİYYAT MODALI
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeLogin = document.getElementById('closeLogin');

// Giriş pəncərəsini aç (Alert silindi!)
loginBtn?.addEventListener('click', () => {
    loginModal.style.display = 'flex';
    document.body.style.overflow = "hidden";
});

// Giriş pəncərəsini bağla
closeLogin?.addEventListener('click', () => {
    loginModal.style.display = 'none';
    document.body.style.overflow = "auto";
});

// Qeydiyyat formasına keçid
document.getElementById('showReg')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginFormArea').style.display = 'none';
    document.getElementById('regFormArea').style.display = 'block';
});

// Giriş formasına geri keçid
document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('regFormArea').style.display = 'none';
    document.getElementById('loginFormArea').style.display = 'block';
});

// 5. NAVİQASİYA (SCROLL)
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = 90;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

// 6. KƏNAR KLİKLƏR (Modalları bağlamaq üçün)
window.onclick = function(event) {
    if (event.target == document.getElementById("activityModal")) {
        closeActivityModal();
    }
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = "auto";
    }
};
