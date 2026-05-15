/**
 * YOLASAL - Professional UI & Logic Controller
 * Version: 2.0 (Premium & Responsive)
 */

// --- KONFİQURASİYA ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyB3Zp39Gq9Kdn3tcm9E9fqfNHAa5HNqRJaey_LrINp67u-pjC3dnxwkBNDOH19h_71A/exec"; 
let generatedOtp = null;
let tempUserData = {};

// 1. ŞƏHƏR VƏ RAYONLARIN YÜKLƏNMƏSİ
const cities = ["Bakı", "Sumqayıt", "Gəncə", "Xırdalan", "Mingəçevir", "Lənkəran", "Şirvan", "Naxçıvan", "Quba", "Qusar", "Xaçmaz", "Şəki", "Qəbələ", "Şamaxı", "İsmayıllı", "Göyçay", "Ağsu", "Kürdəmir", "Ucar", "Yevlax", "Bərdə", "Tərtər", "Ağdam", "Füzuli", "Cəbrayıl", "Zəngilan", "Qubadlı", "Laçın", "Kəlbəcər", "Şuşa", "Xocalı", "Xankəndi", "Goranboy", "Naftalan", "Şəmkir", "Tovuz", "Ağstafa", "Qazax", "Gədəbəy", "Daşkəsən", "Samux", "Göygöl", "Oğuz", "Balakən", "Zaqatala", "Qax", "Siyəzən", "Şabran", "Xızı", "Qobustan", "Hacıqabul", "Saatlı", "Sabirabad", "İmişli", "Beyləqan", "Zərdab", "Biləsuvar", "Neftçala", "Salyan", "Cəlilabad", "Masallı", "Yardımlı", "Lerik", "Astara"];

document.addEventListener('DOMContentLoaded', () => {
    // Rayonları doldur
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        cities.sort().forEach(city => {
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
            // Hamburger animasiyası üçün
            menuToggle.classList.toggle('is-active'); 
        });
    }

    // Menyu linkinə basanda menyunu bağla (Mobil üçün)
    document.querySelectorAll('.nav-links li').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
});

// 3. MODAL KONTROL (Giriş/Qeydiyyat)
const loginModal = document.getElementById('loginModal');

function openLogin() {
    loginModal.style.display = 'flex';
}

document.getElementById('loginBtn')?.addEventListener('click', openLogin);
document.getElementById('closeLogin')?.addEventListener('click', () => loginModal.style.display = 'none');

// Pəncərələr arası keçid
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

// 4. QEYDİYYAT PROSESİ (Məntiq qorundu)
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

// 5. OTP TƏSDİQİ
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
            alert("Qeydiyyat uğurla tamamlandı! ID kodunuz mailinizə göndərildi.");
            location.reload();
        } catch (err) {
            alert("Sistem xətası.");
            btn.disabled = false;
        }
    } else {
        alert("Kod yanlışdır!");
    }
});

// 6. KÖMƏKÇİ FUNKSİYALAR (Scroll & Activity)
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

// Canlı Statistika Detalları (Simulyasiya)
function showLiveDetails(type) {
    const modal = document.getElementById('activityModal');
    const title = document.getElementById('modalTitle');
    const dataDiv = document.getElementById('modalData');
    
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

function closeActivityModal() {
    document.getElementById('activityModal').style.display = 'none';
}

// Modal kənarına basanda bağlansın
window.onclick = function(event) {
    if (event.target == loginModal) loginModal.style.display = "none";
    if (event.target == document.getElementById('activityModal')) closeActivityModal();
}
