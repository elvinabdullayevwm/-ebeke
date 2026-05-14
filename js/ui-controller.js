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
    
    function openRegisterModal() {
        const loginModal = document.getElementById("loginModal");
        if (loginModal) loginModal.remove();

        // AZƏRBAYCANIN TAM ŞƏHƏR VƏ RAYON SİYAHISI
        const locations = [
            "Bakı", "Abşeron (Xırdalan)", "Sumqayıt", "Gəncə", "Naxçıvan", "Xankəndi", "Lənkəran", "Mingəçevir", "Naftalan", "Şaki", "Şirvan", "Yevlax",
            "Ağcabədi", "Ağdam", "Ağdaş", "Ağstafa", "Ağsu", "Astara", "Babək", "Balakən", "Beyləqan", "Bərdə", "Biləsuvar", "Cəbrayıl", "Cəlilabad", 
            "Culfa", "Daşkəsən", "Füzuli", "Gədəbəy", "Goranboy", "Göyçay", "Göygöl", "Hacıqabul", "Xaçmaz", "Xızı", "Xocalı", "Xocavənd", "İmişli", 
            "İsmayıllı", "Cəbrayıl", "Kəlbəcər", "Kürdəmir", "Qax", "Qazax", "Qobustan", "Quba", "Qubadlı", "Qusar", "Laçın", "Lerik", "Masallı", 
            "Neftçala", "Oğuz", "Ordubad", "Saatlı", "Sabirabad", "Salyan", "Samux", "Sədərək", "Siyəzən", "Şabran", "Şahbuz", "Şamaxı", "Şəmkir", 
            "Şərur", "Şuşa", "Tərtər", "Tovuz", "Ucar", "Yardımlı", "Zaqatala", "Zəngilan", "Zərdab"
        ].sort(); // Əlifba sırası ilə düzürük

        const regModalHTML = `
            <div id="regModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:10002; backdrop-filter: blur(8px); padding: 20px;">
                <div style="background:white; padding:35px; border-radius:24px; width:100%; max-width:550px; position:relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                    <span id="closeReg" style="position:absolute; top:15px; right:20px; cursor:pointer; font-size:30px; color:#999;">&times;</span>
                    <h2 style="margin-bottom:25px; text-align:center; color:#A68B5C; font-weight:800;">Yolasal Qeydiyyat</h2>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                        <input type="text" placeholder="Ad" style="padding:14px; border:1px solid #eee; border-radius:12px; outline:none; background:#f9f9f9;">
                        <input type="text" placeholder="Soyad" style="padding:14px; border:1px solid #eee; border-radius:12px; outline:none; background:#f9f9f9;">
                    </div>

                    <div style="margin-top:15px; display:flex; gap:8px;">
                        <select style="padding:14px; border:1px solid #eee; border-radius:12px; width:95px; outline:none; background:#f9f9f9; font-weight:600;">
                            <option>050</option><option>051</option><option>055</option><option>070</option><option>077</option><option>010</option><option>099</option>
                        </select>
                        <input type="text" placeholder="xxx-xx-xx" style="flex:1; padding:14px; border:1px solid #eee; border-radius:12px; outline:none; background:#f9f9f9;">
                    </div>

                    <input type="email" placeholder="Email ünvanı" style="width:100%; padding:14px; margin-top:15px; border:1px solid #eee; border-radius:12px; outline:none; background:#f9f9f9;">

                    <select style="width:100%; padding:14px; margin-top:15px; border:1px solid #eee; border-radius:12px; outline:none; background:#f9f9f9;">
                        <option value="">Yaşadığınız şəhər/rayonu seçin</option>
                        ${locations.map(loc => `<option value="${loc}">${loc}</option>`).join('')}
                    </select>

                    <div style="margin-top:15px; display:flex; align-items:center; gap:25px; padding:14px; border:1px solid #eee; border-radius:12px; background:#f9f9f9;">
                        <span style="color:#666; font-weight:600;">Cins:</span>
                        <label style="cursor:pointer;"><input type="radio" name="gender" value="kisi"> Kişi</label>
                        <label style="cursor:pointer;"><input type="radio" name="gender" value="qadin"> Qadın</label>
                    </div>

                    <div style="margin-top:15px;">
                        <label style="display:block; font-size:13px; color:#A68B5C; font-weight:700; margin-bottom:5px; margin-left:5px;">DOĞUM TARİXİ</label>
                        <input type="date" style="width:100%; padding:14px; border:1px solid #eee; border-radius:12px; outline:none; background:#f9f9f9;">
                    </div>

                    <input type="text" placeholder="MMC adı (VÖEN varsa qeyd edin)" style="width:100%; padding:14px; margin-top:15px; border:1px solid #eee; border-radius:12px; outline:none; background:#f9f9f9;">
                    
                    <input type="password" placeholder="Parol təyin edin" style="width:100%; padding:14px; margin-top:15px; border:1px solid #eee; border-radius:12px; outline:none; background:#f9f9f9;">

                    <button style="width:100%; padding:16px; background:#A68B5C; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold; margin-top:25px; font-size:16px; box-shadow: 0 5px 15px rgba(166,139,92,0.3);">HESABI TƏSDİQLƏ</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', regModalHTML);

        document.getElementById("closeReg").onclick = () => document.getElementById("regModal").remove();
        window.onclick = (e) => { if(e.target.id === "regModal") document.getElementById("regModal").remove(); };
    }

    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            const modalHTML = `
                <div id="loginModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:10001; backdrop-filter: blur(5px);">
                    <div style="background:white; padding:40px; border-radius:24px; width:380px; position:relative; text-align:center;">
                        <span id="closeModal" style="position:absolute; top:15px; right:20px; cursor:pointer; font-size:28px; color:#999;">&times;</span>
                        <h2 style="margin-bottom:25px; font-weight:800;">Müştəri Girişi</h2>
                        <input type="email" placeholder="E-poçt" style="width:100%; padding:14px; margin-bottom:15px; border:1px solid #eee; border-radius:12px; outline:none; background:#f9f9f9;">
                        <input type="password" placeholder="Şifrə" style="width:100%; padding:14px; margin-bottom:25px; border:1px solid #eee; border-radius:12px; outline:none; background:#f9f9f9;">
                        <button style="width:100%; padding:14px; background:#A68B5C; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold;">DAXİL OL</button>
                        <p style="margin-top:25px; font-size:14px; color:#666;">Hesabınız yoxdur? <span id="switchToReg" style="color:#A68B5C; font-weight:bold; cursor:pointer; text-decoration:underline;">Qeydiyyatdan keçin</span></p>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            document.getElementById("closeModal").onclick = () => document.getElementById("loginModal").remove();
            document.getElementById("switchToReg").onclick = openRegisterModal;
        });
    }
});
