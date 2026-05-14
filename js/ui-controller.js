function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        window.scrollTo({
            top: (elementRect - bodyRect) - offset,
            behavior: "smooth"
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    
    // QEYDİYYAT MODALINI YARADAN FUNKSİYA
    function openRegisterModal() {
        // Əgər giriş modalı açıqdırsa, onu bağla
        const loginModal = document.getElementById("loginModal");
        if (loginModal) loginModal.remove();

        const cities = ["Bakı", "Gəncə", "Sumqayıt", "Xırdalan", "Naxçıvan", "Lənkəran", "Şəki", "Quba", "Daşkəsən", "Şirvan", "Mingəçevir", "Zaqatala", "Qəbələ", "Bərdə", "Ağdam"]; // Siyahını ehtiyaca görə genişləndirə bilərsən

        const regModalHTML = `
            <div id="regModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:10002; backdrop-filter: blur(5px); padding: 20px;">
                <div style="background:white; padding:35px; border-radius:20px; width:100%; max-width:500px; position:relative; max-height: 90vh; overflow-y: auto;">
                    <span id="closeReg" style="position:absolute; top:15px; right:20px; cursor:pointer; font-size:28px; color:#999;">&times;</span>
                    <h2 style="margin-bottom:20px; text-align:center; color:#A68B5C;">Yeni Hesab Yarat</h2>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <input type="text" placeholder="Ad" style="padding:12px; border:1px solid #ddd; border-radius:8px; outline:none;">
                        <input type="text" placeholder="Soyad" style="padding:12px; border:1px solid #ddd; border-radius:8px; outline:none;">
                    </div>

                    <div style="margin-top:15px; display:flex; gap:5px;">
                        <select style="padding:12px; border:1px solid #ddd; border-radius:8px; width:80px; outline:none;">
                            <option>050</option><option>051</option><option>055</option><option>070</option><option>077</option><option>010</option><option>099</option>
                        </select>
                        <input type="text" placeholder="xxx-xx-xx" style="flex:1; padding:12px; border:1px solid #ddd; border-radius:8px; outline:none;">
                    </div>

                    <input type="email" placeholder="Email ünvanı" style="width:100%; padding:12px; margin-top:15px; border:1px solid #ddd; border-radius:8px; outline:none;">

                    <select style="width:100%; padding:12px; margin-top:15px; border:1px solid #ddd; border-radius:8px; outline:none;">
                        <option value="">Yaşadığınız ünvanı seçin</option>
                        ${cities.map(city => `<option value="${city}">${city}</option>`).join('')}
                    </select>

                    <div style="margin-top:15px; display:flex; align-items:center; gap:20px; padding:12px; border:1px solid #ddd; border-radius:8px;">
                        <span style="color:#666;">Cins:</span>
                        <label><input type="radio" name="gender" value="kisi"> Kişi</label>
                        <label><input type="radio" name="gender" value="qadin"> Qadın</label>
                    </div>

                    <div style="margin-top:15px;">
                        <label style="display:block; font-size:13px; color:#666; margin-bottom:5px;">Doğum tarixi:</label>
                        <input type="date" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; outline:none;">
                    </div>

                    <input type="text" placeholder="MMC adı (və ya fərdi sahibkar)" style="width:100%; padding:12px; margin-top:15px; border:1px solid #ddd; border-radius:8px; outline:none;">
                    
                    <input type="password" placeholder="Parol təyin edin" style="width:100%; padding:12px; margin-top:15px; border:1px solid #ddd; border-radius:8px; outline:none;">

                    <button style="width:100%; padding:15px; background:#A68B5C; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold; margin-top:20px; font-size:16px;">Qeydiyyatı Tamamla</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', regModalHTML);

        document.getElementById("closeReg").onclick = () => document.getElementById("regModal").remove();
        window.onclick = (e) => { if(e.target.id === "regModal") document.getElementById("regModal").remove(); };
    }

    // GİRİŞ MODALINI AÇANDA QEYDİYYAT LİNKİNƏ BASILMASINI İZLƏYİRİK
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            // ... (əvvəlki giriş modalı kodu) ...
            const modalHTML = `
                <div id="loginModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:10001; backdrop-filter: blur(5px);">
                    <div style="background:white; padding:40px; border-radius:20px; width:380px; position:relative; text-align:center;">
                        <span id="closeModal" style="position:absolute; top:15px; right:20px; cursor:pointer; font-size:28px;">&times;</span>
                        <h2 style="margin-bottom:25px;">Müştəri Girişi</h2>
                        <input type="email" placeholder="E-poçt" style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px;">
                        <input type="password" placeholder="Şifrə" style="width:100%; padding:12px; margin-bottom:20px; border:1px solid #ddd; border-radius:8px;">
                        <button style="width:100%; padding:12px; background:#A68B5C; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">Daxil Ol</button>
                        <p style="margin-top:20px;">Hesabınız yoxdur? <span id="switchToReg" style="color:#A68B5C; font-weight:bold; cursor:pointer;">Qeydiyyatdan keçin</span></p>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            document.getElementById("closeModal").onclick = () => document.getElementById("loginModal").remove();
            
            // Qeydiyyat linkinə klik
            document.getElementById("switchToReg").onclick = openRegisterModal;
        });
    }
});
