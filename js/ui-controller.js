/**
 * YOLASAL - Professional UI & Logic Controller
 * Version: 2.8 (YENİ MƏRKƏZİ GOOGLE SCRIPT URL İNTEQRASİYASI İLƏ)
 * TAM STRUKTUR QORUNUB, SƏNİN YENİ URL BİRBAŞA DAXİL EDİLİB.
 */

// --- YENİ DEPLOY OLUNMUŞ GOOGLE SCRIPT BACKEND URL ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw05sX5mZfMTQnQxGp9pLhsQiN2lc0G2eMA4geuo5yOQbtCV5J2LSbG4wP9L2A4ZgKF9Q/exec"; 

let generatedOtp = null;
let tempUserData = {};

// Şəhər və Rayonların Təhlükəsiz Siyahısı
const cities = [
    "Abşeron", "Ağcabədi", "Ağdam", "Ağdaş", "Ağstafa", "Ağsu", "Astara", "Babək", "Bakı", "Balakən", 
    "Bərdə", "Beyləqan", "Biləsuvar", "Cəbrayıl", "Cəlilabad", "Culfa", "Daşkəsən", "Füzuli", "Gədəbəy", "Gəncə", 
    "Goranboy", "Göyçay", "Göygöl", "Hacıqabul", "Xaçmaz", "Xankəndi", "Xızı", "Xocalı", "Xocavənd", "Xırdalan", 
    "İmişli", "İsmayıllı", "Kəlbəcər", "Kürdəmir", "Laçın", "Lerik", "Lənkəran", "Masallı", "Mingəçevir", "Naftalan", 
    "Naxçıvan", "Neftçala", "Oğuz", "Ordubad", "Qax", "Qazax", "Qəbələ", "Qobustan", "Quba", "Qubadlı", 
    "Qusar", "Saatlı", "Sabirabad", "Salyan", "Samux", "Siyəzən", "Sumqayıt", "Şabran", "Şahbuz", "Şamaxı", 
    "Şəki", "Şəmkir", "Şərur", "Şirvan", "Şuşa", "Tərtər", "Tovuz", "Ucar", "Yardımlı", "Yevlax", 
    "Zaqatala", "Zərdab", "Zəngilan"
];
const azerbaijanCities = cities;
const azCities = cities;

// 1. ŞƏHƏR VƏ RAYONLARIN DROPDOWN-LARA YÜKLƏNMƏSİ
document.addEventListener('DOMContentLoaded', () => {
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        citySelect.innerHTML = '<option value="">Yaşadığınız rayonu seçin *</option>'; 
        cities.forEach(city => {
            let opt = document.createElement('option');
            opt.value = city; opt.innerHTML = city;
            citySelect.appendChild(opt);
        });
    }

    // 2. MOBİL MENYU İDARƏETMƏSİ (Hamburger)
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('is-active'); 
        });
    }

    document.querySelectorAll('.nav-links li').forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.target.closest('#userProfileArea')) return;
            if (navLinks) navLinks.classList.remove('active');
        });
    });
});

// 3. MODAL KONTROL (Giriş/Qeydiyyat)
const loginModal = document.getElementById('loginModal');

function openLogin() {
    if (loginModal) loginModal.style.display = 'flex';
}

document.getElementById('loginBtn')?.addEventListener('click', openLogin);
document.getElementById('closeLogin')?.addEventListener('click', () => {
    if (loginModal) loginModal.style.display = 'none';
});

document.getElementById('showReg')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginFormArea').style.display = 'none';
    document.getElementById('regFormArea').style.display = 'block';
});

document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('regFormArea').style.display = 'none';
    document.getElementById('otpFormArea').style.display = 'none';
    document.getElementById('loginFormArea').style.display = 'block';
});

// 4. QEYDİYYAT PROSESİ
document.getElementById('startRegBtn')?.addEventListener('click', async () => {
    const name = document.getElementById('regName').value;
    const surname = document.getElementById('regSurname').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPrefix').value + document.getElementById('regPhone').value;
    const city = document.getElementById('citySelect').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const birth = document.getElementById('regBirth').value;
    const mmc = document.getElementById('regMMC').value;
    const pass = document.getElementById('regPassword').value;

    if (!name || !surname || !email || !phone || !city || !birth || !pass) {
        alert("Zəhmət olmasa bütün vacib (*) xanaları doldurun!");
        return;
    }

    const btn = document.getElementById('startRegBtn');
    btn.disabled = true;
    btn.innerText = "Yoxlanılır...";

    try {
        const response = await fetch(`${SCRIPT_URL}?action=checkUser&email=${email}&phone=${phone}`);
        const result = await response.json();

        if (result.exists) {
            alert("Bu e-mail və ya nömrə artıq sistemdə mövcuddur!");
            btn.disabled = false;
            btn.innerText = "QEYDİYYATDAN KEÇ";
        } else {
            generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
            tempUserData = { name, surname, email, phone, city, gender, birth, mmc, pass };

            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify({ action: "sendOtp", email: email, otp: generatedOtp })
            });

            document.getElementById('regFormArea').style.display = 'none';
            document.getElementById('otpFormArea').style.display = 'block';
            console.log("Sistem OTP:", generatedOtp); 
        }
    } catch (err) {
        alert("Bağlantı xətası. Yenidən cəhd edin.");
        btn.disabled = false;
        btn.innerText = "QEYDİYYATDAN KEÇ";
    }
});

// 5. OTP TƏSDİQİ VƏ AVTOMATİK GİRİŞƏ YÖNLƏNDİRMƏ
document.getElementById('verifyOtpBtn')?.addEventListener('click', async () => {
    const userOtp = document.getElementById('otpInput').value;

    if (userOtp === generatedOtp) {
        const btn = document.getElementById('verifyOtpBtn');
        btn.disabled = true;
        btn.innerText = "Tamamlanır...";

        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify({ action: "registerUser", ...tempUserData })
            });
            
            alert("Qeydiyyat uğurla tamamlandı! İndi təyin etdiyiniz şifrə ilə daxil ola bilərsiniz.");
            
            document.getElementById('otpFormArea').style.display = 'none';
            document.getElementById('loginFormArea').style.display = 'block';
            document.getElementById('loginId').value = tempUserData.email;
            
            generatedOtp = null;
            tempUserData = {};
            btn.disabled = false;
            btn.innerText = "TƏSDİQLƏ";
        } catch (err) {
            alert("Sistem xətası.");
            btn.disabled = false;
            btn.innerText = "TƏSDİQLƏ";
        }
    } else {
        alert("Kod yanlışdır!");
    }
});

// 6. REAL GİRİŞ (LOGIN) PROSESİ
async function handleLoginProcess() {
    const loginId = document.getElementById('loginId').value.trim();
    const loginPass = document.getElementById('loginPass').value;
    const submitBtn = document.getElementById('submitLoginBtn');

    if (!loginId || !loginPass) {
        alert("Zəhmət olmasa bütün xanaları doldurun!");
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Yoxlanılır...";
    }

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "login",
                loginId: loginId,
                password: loginPass
            })
        });

        const textData = await response.text();
        const result = JSON.parse(textData);

        if (result.status === "Success" || result.status === "success") {
            if (loginModal) loginModal.style.display = 'none';
            
            document.getElementById('dashUserName').innerText = result.name + " " + result.surname;
            document.getElementById('dashUserId').innerText = result.id;
            document.getElementById('dashUserMmc').innerText = result.mmc ? result.mmc : "Şəxsi Hesab";
            document.getElementById('dashUserPhone').innerText = result.phone;

            const mainLoginBtn = document.getElementById('loginBtn');
            const userProfileArea = document.getElementById('userProfileArea');
            
            if (mainLoginBtn) mainLoginBtn.style.display = 'none';
            if (userProfileArea) {
                userProfileArea.style.display = 'inline-block';
                document.getElementById('userAvatarBtn').innerText = result.name.charAt(0).toUpperCase();
            }

            localStorage.setItem("customerID", result.id);
            localStorage.setItem("userID", result.id);

            const dashboardSection = document.getElementById('customerDashboard');
            if (dashboardSection) dashboardSection.style.display = 'block';
            scrollToSection('customerDashboard');

            document.getElementById('loginId').value = "";
            document.getElementById('loginPass').value = "";

        } else {
            alert("Xəta: ID/E-mail və ya şifrə yanlışdır!");
        }
    } catch (err) {
        alert("Giriş zamanı xəta baş verdi. Şəbəkəni və ya məlumatları yoxlayın.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "DAXİL OL";
        }
    }
}

// 7. AVATAR DROPDOWN MENYUNU AÇIB-BAĞLAMAQ
function toggleUserDropdown(event) {
    event.stopPropagation();
    const menu = document.getElementById('userDropdownMenu');
    if (menu) {
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    }
}

// 8. AYARLAR FUNKSİYASI
function openSettings(event) {
    if (event) event.preventDefault();
    alert("Ayarlar bölməsi tezliklə aktiv ediləcək.");
    const menu = document.getElementById('userDropdownMenu');
    if (menu) menu.style.display = 'none';
}

// 9. SİSTEMDƏN ÇIXIŞ (LOGOUT)
function logoutUser(event) {
    if (event) event.preventDefault();
    
    if (confirm("Şəxsi kabinetdən çıxmaq istədiyinizə əminsiniz?")) {
        const menu = document.getElementById('userDropdownMenu');
        if (menu) menu.style.display = 'none';

        document.getElementById('customerDashboard').style.display = 'none';
        
        const mainLoginBtn = document.getElementById('loginBtn');
        const userProfileArea = document.getElementById('userProfileArea');
        
        if (mainLoginBtn) mainLoginBtn.style.display = 'inline-block';
        if (userProfileArea) userProfileArea.style.display = 'none';
        
        localStorage.clear();
        scrollToSection('home');
    }
}

// 10. MƏRKƏZİ DASHBOARD İNTELLEKTUAL İDARƏEDİCİSİ
function handleDashboardAction(actionType) {
    console.log("İcra edilən əməliyyat:", actionType);
    
    switch(actionType) {
        case 'new-order':
            openNewOrderModal();
            break;
        case 'new-route':
        case 'new-trip':
            openNewTripModal();
            break;
        case 'active-orders':
            alert("Aktiv Sifarişlərinizin siyahısı yüklənir...");
            break;
        case 'active-routes':
            alert("Aktiv Reyslərinizin siyahısı yüklənir...");
            break;
        case 'in-progress-orders':
            alert("İcrada olan sifarişləriniz axtarılır...");
            break;
        case 'in-progress-routes':
            alert("İcrada olan reysləriniz axtarılır...");
            break;
        case 'delivered-orders':
            alert("Təslim edilən sifarişlərinizin arxivi açılır...");
            break;
        case 'completed-routes':
            alert("Tamamlanmış reyslərinizin arxivi açılır...");
            break;
        case 'search-orders':
            alert("Sifarişlər üçün təkmilləşdirilmiş filtr paneli hazırlanır...");
            break;
        case 'search-routes':
            alert("Reyslər üçün təkmilləşdirilmiş filtr paneli hazırlanır...");
            break;
        default:
            console.warn("Naməlum əməliyyat xətası.");
    }
}

// 11. YENİ SİFARİŞ YARAT MODALININ IDARƏEDİLMƏSİ
function openNewOrderModal() {
    const modal = document.getElementById('newOrderModal');
    if (modal) {
        modal.style.display = 'block';
        populateOrderCities();
    }
}

function closeNewOrderModal() {
    const modal = document.getElementById('newOrderModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('newOrderForm')?.reset();
    }
}

function populateOrderCities() {
    const pickupSelect = document.getElementById('orderPickupCity');
    const dropSelect = document.getElementById('orderDropCity');
    
    if (pickupSelect && pickupSelect.options.length <= 1) {
        pickupSelect.innerHTML = '<option value="">Seçin *</option>';
        azerbaijanCities.forEach(city => {
            const opt = document.createElement('option');
            opt.value = city; opt.textContent = city;
            pickupSelect.appendChild(opt);
        });
    }
    
    if (dropSelect && dropSelect.options.length <= 1) {
        dropSelect.innerHTML = '<option value="">Seçin *</option>';
        azerbaijanCities.forEach(city => {
            const opt = document.createElement('option');
            opt.value = city; opt.textContent = city;
            dropSelect.appendChild(opt);
        });
    }
}

// 12. SİFARİŞİN GÖNDƏRİLMƏSİ
function submitNewOrder(event) {
    if (event) event.preventDefault();
    
    const idElement = document.getElementById('dashUserId');
    let customerID = "650001";
    
    if (idElement && idElement.innerText.trim() !== "-") {
        customerID = idElement.innerText.trim();
    } else {
        customerID = localStorage.getItem('customerID') || "650001";
    }

    const submitBtn = document.getElementById('submitOrderBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'GÖNDƏRİLİR... LÜTFƏN GÖZLƏYİN';
    }

    const weight = document.getElementById('orderWeightVal').value + ' ' + document.getElementById('orderWeightUnit').value;
    const width = document.getElementById('orderWidthVal').value + ' ' + document.getElementById('orderWidthUnit').value;
    const length = document.getElementById('orderLengthVal').value + ' ' + document.getElementById('orderLengthUnit').value;
    const height = document.getElementById('orderHeightVal').value + ' ' + document.getElementById('orderHeightUnit').value;
    const budget = document.getElementById('orderBudgetVal').value + ' ' + document.getElementById('orderBudgetCurrency').value;

    const orderData = {
        goodType: document.getElementById('orderGoodType').value,
        goodName: document.getElementById('orderGoodName').value,
        material: document.getElementById('orderMaterial').value,
        fragility: document.getElementById('orderFragility').value,
        weight: weight,
        width: width,
        length: length,
        height: height,
        pickupCity: document.getElementById('orderPickupCity').value,
        pickupAddress: document.getElementById('orderPickupAddress').value,
        dropCity: document.getElementById('orderDropCity').value,
        dropAddress: document.getElementById('orderDropAddress').value,
        pickupDate: document.getElementById('orderPickupDate').value,
        dropDate: document.getElementById('orderDropDate').value,
        budget: budget,
        notes: document.getElementById('orderNotes').value || '-'
    };

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "createNewOrder", customerID: customerID, data: orderData })
    })
    .then(() => {
        alert('Sifarişiniz uğurla yaradıldı və Google Sheets-ə qeyd olundu!');
        closeNewOrderModal();
    })
    .catch(err => alert("Xəta baş verdi: " + err))
    .finally(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'SİFARİŞİ TƏSDİQLƏ VƏ PAYLAŞ';
        }
    });
}

// 13. YENİ REYS (TRIP) MODALININ IDARƏEDİLMƏSİ VƏ SUBMITI
function openNewTripModal() {
    const modal = document.getElementById("newTripModal");
    if (modal) {
        modal.style.display = "block";
        
        const fromSelect = document.getElementById("tripFromCity");
        const toSelect = document.getElementById("tripToCity");
        
        if (fromSelect && fromSelect.options.length <= 1) {
            fromSelect.innerHTML = '<option value="">Haradan *</option>';
            toSelect.innerHTML = '<option value="">Haraya *</option>';
            azCities.forEach(city => {
                let opt1 = new Option(city, city);
                let opt2 = new Option(city, city);
                fromSelect.add(opt1);
                toSelect.add(opt2);
            });
        }
    }
}

function closeNewTripModal() {
    const modal = document.getElementById("newTripModal");
    if (modal) {
        modal.style.display = "none";
        document.getElementById("newTripForm")?.reset();
    }
}

function submitNewTrip(event) {
    if (event) event.preventDefault();
    
    const idElement = document.getElementById('dashUserId');
    let activeCustomerID = "650004";
    
    if (idElement && idElement.innerText.trim() !== "-") {
        activeCustomerID = idElement.innerText.trim();
    } else {
        activeCustomerID = localStorage.getItem("customerID") || "650004"; 
    }
    
    const tripData = {
        truckType: document.getElementById("tripTruckType").value,
        truckBrand: document.getElementById("tripTruckBrand").value,
        plateNumber: document.getElementById("tripPlateNumber").value.toUpperCase().trim(),
        driverName: document.getElementById("tripDriverName").value.trim(),
        driverSurname: document.getElementById("tripDriverSurname").value.trim(),
        licenseCategory: document.getElementById("tripLicenseCategory").value,
        experience: document.getElementById("tripExpVal").value + " " + document.getElementById("tripExpUnit").value,
        width: document.getElementById("tripWidthVal").value + " " + document.getElementById("tripWidthUnit").value,
        length: document.getElementById("tripLengthVal").value + " " + document.getElementById("tripLengthUnit").value,
        height: document.getElementById("tripHeightVal").value + " " + document.getElementById("tripHeightUnit").value,
        weight: document.getElementById("tripWeightVal").value + " " + document.getElementById("tripWeightUnit").value,
        fromCity: document.getElementById("tripFromCity").value,
        toCity: document.getElementById("tripToCity").value,
        pickupDate: document.getElementById("tripPickupDate").value,
        dropDate: document.getElementById("tripDropDate").value,
        notes: document.getElementById("tripNotes").value.trim() || '-'
    };

    const payload = {
        action: "createNewTrip",
        customerID: activeCustomerID,
        data: tripData
    };

    const btn = document.getElementById("submitTripBtn");
    if (btn) {
        btn.disabled = true;
        btn.innerText = "GÖNDƏRİLİR...";
    }

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert("Reys uğurla sistemə daxil edildi və aktivləşdirildi!");
        closeNewTripModal();
    })
    .catch(function(error) {
        console.error("Xəta:", error);
        alert("Sistem xətası baş verdi, yenidən yoxlayın.");
    })
    .finally(() => {
        if (btn) {
            btn.disabled = false;
            btn.innerText = "REYSI TƏSDİQLƏ VƏ PAYLAŞ";
        }
    });
}

// 14. KÖMƏKÇİ FUNKSİYALAR (Scroll & Activity)
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

function showLiveDetails(type) {
    const modal = document.getElementById('activityModal');
    const title = document.getElementById('modalTitle');
    const dataDiv = document.getElementById('modalData');
    
    if (modal) {
        modal.style.display = 'flex';
        title.innerText = type.replace('-', ' ').toUpperCase();
        dataDiv.innerHTML = "<p style='padding:20px; text-align:center;'>Məlumatlar yüklənir...</p>";
        
        setTimeout(() => {
            dataDiv.innerHTML = `
                <div style="padding:10px; border-bottom:1px solid #eee;"><b>ID: 650012</b> - Bakı ➔ Gəncə (Yolda)</div>
                <div style="padding:10px; border-bottom:1px solid #eee;"><b>ID: 650045</b> - Sumqayıt ➔ Quba (Yüklənir)</div>
                <div style="padding:10px; border-bottom:1px solid #eee;"><b>ID: 650089</b> - Lənkəran ➔ Bakı (Çatdı)</div>
            `;
        }, 800);
    }
}

function closeActivityModal() {
    const actModal = document.getElementById('activityModal');
    if (actModal) actModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == loginModal) loginModal.style.display = "none";
    if (event.target == document.getElementById('activityModal')) closeActivityModal();
    if (event.target == document.getElementById('newOrderModal')) closeNewOrderModal();
    if (event.target == document.getElementById('newTripModal')) closeNewTripModal();
    
    if (!event.target.closest('#userProfileArea')) {
        const menu = document.getElementById('userDropdownMenu');
        if (menu) menu.style.display = 'none';
    }
}
