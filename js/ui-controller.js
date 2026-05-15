/**
 * YOLASAL - UI & Registration Logic
 */

// --- KONFİQURASİYA ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyB3Zp39Gq9Kdn3tcm9E9fqfNHAa5HNqRJaey_LrINp67u-pjC3dnxwkBNDOH19h_71A/exec"; 
let generatedOtp = null;
let tempUserData = {};

// 1. ŞƏHƏR VƏ RAYONLAR
const cities = ["Bakı", "Sumqayıt", "Gəncə", "Xırdalan", "Mingəçevir", "Lənkəran", "Şirvan", "Naxçıvan", "Quba", "Qusar", "Xaçmaz", "Şəki", "Qəbələ", "Şamaxı", "İsmayıllı", "Göyçay", "Ağsu", "Kürdəmir", "Ucar", "Yevlax", "Bərdə", "Tərtər", "Ağdam", "Füzuli", "Cəbrayıl", "Zəngilan", "Qubadlı", "Laçın", "Kəlbəcər", "Şuşa", "Xocalı", "Xankəndi", "Goranboy", "Naftalan", "Şəmkir", "Tovuz", "Ağstafa", "Qazax", "Gədəbəy", "Daşkəsən", "Samux", "Göygöl", "Oğuz", "Balakən", "Zaqatala", "Qax", "Siyəzən", "Şabran", "Xızı", "Qobustan", "Hacıqabul", "Saatlı", "Sabirabad", "İmişli", "Beyləqan", "Zərdab", "Biləsuvar", "Neftçala", "Salyan", "Cəlilabad", "Masallı", "Yardımlı", "Lerik", "Astara"];

document.addEventListener('DOMContentLoaded', () => {
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        cities.sort().forEach(city => {
            let opt = document.createElement('option');
            opt.value = city; opt.innerHTML = city;
            citySelect.appendChild(opt);
        });
    }
});

// 2. MODAL KEÇİDLƏRİ
const loginModal = document.getElementById('loginModal');
document.getElementById('loginBtn')?.addEventListener('click', () => loginModal.style.display = 'flex');
document.getElementById('closeLogin')?.addEventListener('click', () => loginModal.style.display = 'none');

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

// 3. QEYDİYYATIN BAŞLADILMASI (YOXLAMA VƏ OTP)
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

    // Düyməni dondur
    const btn = document.getElementById('startRegBtn');
    btn.disabled = true;
    btn.innerText = "Yoxlanılır...";

    try {
        // Dublikat yoxlaması üçün Google-a sorğu
        const response = await fetch(`${SCRIPT_URL}?action=checkUser&email=${email}&phone=${phone}`);
        const result = await response.json();

        if (result.exists) {
            alert("Bu e-mail və ya nömrə artıq qeydiyyatdan keçib!");
            btn.disabled = false;
            btn.innerText = "QEYDİYYATDAN KEÇ";
        } else {
            // OTP yaradılması (4 rəqəmli)
            generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
            
            // İstifadəçi məlumatlarını müvəqqəti saxla
            tempUserData = { name, surname, email, phone, city, gender, birth, mmc, pass };

            // OTP göndərilməsi (Google Script vasitəsilə Mail-ə)
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify({ action: "sendOtp", email: email, otp: generatedOtp })
            });

            // Formu dəyiş
            document.getElementById('regFormArea').style.display = 'none';
            document.getElementById('otpFormArea').style.display = 'block';
            console.log("OTP (Test üçün):", generatedOtp); 
        }
    } catch (err) {
        console.error(err);
        alert("Xəta baş verdi. Yenidən yoxlayın.");
        btn.disabled = false;
        btn.innerText = "QEYDİYYATDAN KEÇ";
    }
});

// 4. OTP TƏSDİQLƏNMƏSİ VƏ QEYDİYYATIN BİTİRİLMƏSİ
document.getElementById('verifyOtpBtn')?.addEventListener('click', async () => {
    const userOtp = document.getElementById('otpInput').value;

    if (userOtp === generatedOtp) {
        const btn = document.getElementById('verifyOtpBtn');
        btn.disabled = true;
        btn.innerText = "Tamamlanır...";

        // Məlumatları Sheet-ə göndər
        try {
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify({ action: "registerUser", ...tempUserData })
            });

            alert("Təbriklər! Qeydiyyat uğurla tamamlandı.");
            location.reload();
        } catch (err) {
            alert("Məlumatlar bazaya yazıla bilmədi.");
            btn.disabled = false;
            btn.innerText = "TƏSDİQLƏ";
        }
    } else {
        alert("Daxil etdiyiniz kod yanlışdır!");
    }
});

// SCROLL FUNKSİYASI
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        window.scrollTo({ top: element.offsetTop - 90, behavior: "smooth" });
    }
}
