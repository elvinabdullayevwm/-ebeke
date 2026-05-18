/**
 * YOLASAL - Professional UI & Logic Controller (SÜTUNLAR SINXRONLAŞDIRILDI)
 * Version: 2.9
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw05sX5mZfMTQnQxGp9pLhsQiN2lc0G2eMA4geuo5yOQbtCV5J2LSbG4wP9L2A4ZgKF9Q/exec"; 

let generatedOtp = null;
let tempUserData = {};

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

    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('is-active'); 
        });
    }
});

const loginModal = document.getElementById('loginModal');
function openLogin() { if (loginModal) loginModal.style.display = 'flex'; }
document.getElementById('loginBtn')?.addEventListener('click', openLogin);
document.getElementById('closeLogin')?.addEventListener('click', () => { if (loginModal) loginModal.style.display = 'none'; });

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
    btn.disabled = true; btn.innerText = "Yoxlanılır...";

    try {
        const response = await fetch(`${SCRIPT_URL}?action=checkUser&email=${email}&phone=${phone}`);
        const result = await response.json();

        if (result.exists) {
            alert("Bu e-mail və ya nömrə artıq sistemdə mövcuddur!");
            btn.disabled = false; btn.innerText = "QEYDİYYATDAN KEÇ";
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
        }
    } catch (err) {
        alert("Bağlantı xətası.");
        btn.disabled = false; btn.innerText = "QEYDİYYATDAN KEÇ";
    }
});

document.getElementById('verifyOtpBtn')?.addEventListener('click', async () => {
    const userOtp = document.getElementById('otpInput').value;
    if (userOtp === generatedOtp) {
        const btn = document.getElementById('verifyOtpBtn');
        btn.disabled = true; btn.innerText = "Tamamlanır...";
        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify({ action: "registerUser", ...tempUserData })
            });
            alert("Qeydiyyat uğurla tamamlandı!");
            document.getElementById('otpFormArea').style.display = 'none';
            document.getElementById('loginFormArea').style.display = 'block';
        } catch (err) { alert("Sistem xətası."); }
        finally { btn.disabled = false; btn.innerText = "TƏSTİQLƏ"; }
    } else { alert("Kod yanlışdır!"); }
});

async function handleLoginProcess() {
    const loginId = document.getElementById('loginId').value.trim();
    const loginPass = document.getElementById('loginPass').value;
    const submitBtn = document.getElementById('submitLoginBtn');

    if (!loginId || !loginPass) { alert("Xanaları doldurun!"); return; }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = "Yoxlanılır..."; }

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({ action: "login", loginId: loginId, password: loginPass })
        });
        const result = await response.json();

        if (result.status === "Success" || result.status === "success") {
            if (loginModal) loginModal.style.display = 'none';
            document.getElementById('dashUserName').innerText = result.name + " " + result.surname;
            document.getElementById('dashUserId').innerText = result.id;
            document.getElementById('dashUserMmc').innerText = result.mmc || "Şəxsi Hesab";
            document.getElementById('dashUserPhone').innerText = result.phone;

            document.getElementById('loginBtn').style.display = 'none';
            const profile = document.getElementById('userProfileArea');
            if (profile) {
                profile.style.display = 'inline-block';
                document.getElementById('userAvatarBtn').innerText = result.name.charAt(0).toUpperCase();
            }

            localStorage.setItem("customerID", result.id);
            document.getElementById('customerDashboard').style.display = 'block';
            scrollToSection('customerDashboard');
        } else { alert("Məlumatlar yanlışdır!"); }
    } catch (err) { alert("Giriş xətası."); }
    finally { if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = "DAXİL OL"; } }
}

function toggleUserDropdown(event) {
    event.stopPropagation();
    const menu = document.getElementById('userDropdownMenu');
    if (menu) menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function logoutUser(event) {
    if (event) event.preventDefault();
    if (confirm("Çıxmaq istəyirsiniz?")) {
        localStorage.clear();
        window.location.reload();
    }
}

function handleDashboardAction(actionType) {
    if(actionType === 'new-order') openNewOrderModal();
    if(actionType === 'new-trip' || actionType === 'new-route') openNewTripModal();
}

function openNewOrderModal() {
    const modal = document.getElementById('newOrderModal');
    if (modal) { modal.style.display = 'block'; populateOrderCities(); }
}
function closeNewOrderModal() { document.getElementById('newOrderModal').style.display = 'none'; }

function populateOrderCities() {
    const p = document.getElementById('orderPickupCity');
    const d = document.getElementById('orderDropCity');
    if (p && p.options.length <= 1) {
        cities.forEach(c => { p.add(new Option(c, c)); d.add(new Option(c, c)); });
    }
}

// SİFARİŞİN GÖNDƏRİLMƏSİ (SÜTUN BAŞLIQLARINA UYĞUNLAŞDIRILDI)
function submitNewOrder(event) {
    if (event) event.preventDefault();
    const customerID = document.getElementById('dashUserId').innerText.trim() || localStorage.getItem('customerID') || "650001";
    const submitBtn = document.getElementById('submitOrderBtn');
    
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'GÖNDƏRİLİR...'; }

    const orderData = {
        goodType: document.getElementById('orderGoodType').value,
        goodName: document.getElementById('orderGoodName').value,
        material: document.getElementById('orderMaterial').value,
        fragility: document.getElementById('orderFragility').value,
        weight: document.getElementById('orderWeightVal').value + ' ' + document.getElementById('orderWeightUnit').value,
        width: document.getElementById('orderWidthVal').value + ' ' + document.getElementById('orderWidthUnit').value,
        height: document.getElementById('orderHeightVal').value + ' ' + document.getElementById('orderHeightUnit').value,
        length: document.getElementById('orderLengthVal').value + ' ' + document.getElementById('orderLengthUnit').value,
        pickupCity: document.getElementById('orderPickupCity').value,
        pickupAddress: document.getElementById('orderPickupAddress').value,
        dropCity: document.getElementById('orderDropCity').value,
        dropAddress: document.getElementById('orderDropAddress').value,
        pickupDate: document.getElementById('orderPickupDate').value,
        dropDate: document.getElementById('orderDropDate').value,
        budget: document.getElementById('orderBudgetVal').value + ' ' + document.getElementById('orderBudgetCurrency').value,
        notes: document.getElementById('orderNotes').value || '-'
    };

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "createNewOrder", customerID: customerID, data: orderData })
    })
    .then(res => res.json())
    .then(res => {
        alert('Sifarişiniz uğurla cədvələ əlavə olundu!');
        closeNewOrderModal();
    })
    .catch(err => alert("Xəta: " + err))
    .finally(() => { if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'SİFARİŞİ TƏSDİQLƏ VƏ PAYLAŞ'; } });
}

function openNewTripModal() {
    const modal = document.getElementById("newTripModal");
    if (modal) {
        modal.style.display = "block";
        const f = document.getElementById("tripFromCity");
        const t = document.getElementById("tripToCity");
        if (f && f.options.length <= 1) { cities.forEach(c => { f.add(new Option(c, c)); t.add(new Option(c, c)); }); }
    }
}
function closeNewTripModal() { document.getElementById("newTripModal").style.display = "none"; }

// REYSİN GÖNDƏRİLMƏSİ (ŞƏKİLDƏKİ SÜTUN SIRALAMASI)
function submitNewTrip(event) {
    if (event) event.preventDefault();
    const customerID = document.getElementById('dashUserId').innerText.trim() || localStorage.getItem("customerID") || "650001";
    const btn = document.getElementById("submitTripBtn");

    if (btn) { btn.disabled = true; btn.innerText = "GÖNDƏRİLİR..."; }
    
    const tripData = {
        truckType: document.getElementById("tripTruckType").value,
        truckBrand: document.getElementById("tripTruckBrand").value,
        plateNumber: document.getElementById("tripPlateNumber").value.toUpperCase().trim(),
        driverName: document.getElementById("tripDriverName").value.trim(),
        driverSurname: document.getElementById("tripDriverSurname").value.trim(),
        licenseCategory: document.getElementById("tripLicenseCategory").value,
        experience: document.getElementById("tripExpVal").value + " " + document.getElementById("tripExpUnit").value,
        width: document.getElementById("tripWidthVal").value + " " + document.getElementById("tripWidthUnit").value,
        height: document.getElementById("tripHeightVal").value + " " + document.getElementById("tripHeightUnit").value,
        length: document.getElementById("tripLengthVal").value + " " + document.getElementById("tripLengthUnit").value,
        weight: document.getElementById("tripWeightVal").value + " " + document.getElementById("tripWeightUnit").value,
        fromCity: document.getElementById("tripFromCity").value,
        toCity: document.getElementById("tripToCity").value,
        pickupDate: document.getElementById("tripPickupDate").value,
        dropDate: document.getElementById("tripDropDate").value,
        notes: document.getElementById("tripNotes").value.trim() || '-'
    };

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "createNewTrip", customerID: customerID, data: tripData })
    })
    .then(res => res.json())
    .then(() => {
        alert("Reys uğurla yaradıldı və cədvələ yazıldı!");
        closeNewTripModal();
    })
    .catch(() => alert("Sistem xətası baş verdi."))
    .finally(() => { if (btn) { btn.disabled = false; btn.innerText = "REYSI TƏSDİQLƏ VƏ PAYLAŞ"; } });
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top - 90 + window.scrollY, behavior: "smooth" });
}

window.onclick = function(event) {
    if (event.target == loginModal) loginModal.style.display = "none";
    if (event.target == document.getElementById('newOrderModal')) closeNewOrderModal();
    if (event.target == document.getElementById('newTripModal')) closeNewTripModal();
    if (!event.target.closest('#userProfileArea')) {
        const menu = document.getElementById('userDropdownMenu'); if (menu) menu.style.display = 'none';
    }
}
