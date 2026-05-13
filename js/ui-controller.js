function showSection(id) {
    const sections = ['login-section', 'register-section', 'verify-section', 'menu-section', 'order-section', 'trip-section', 'marketplace-section'];
    sections.forEach(s => {
        const el = document.getElementById(s);
        if(el) el.style.display = 'none';
    });
    const target = document.getElementById(id);
    if(target) {
        target.style.display = 'block';
        target.classList.add('fade-in'); // animations.css-dəki effekti çağırır
    }
}
