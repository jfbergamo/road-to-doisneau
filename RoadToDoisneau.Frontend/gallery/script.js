// Nav
document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Ham
    const hamburger = document.querySelector(".nav-hamburger");
    const navContent = document.querySelector(".nav-content");

    if (hamburger && navContent) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navContent.classList.toggle("active");

            const isOpened = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", !isOpened);
        });

        const navLinks = document.querySelectorAll(".nav-links a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navContent.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });
    }
});


localStorage.clear();

localStorage.clear();

    // --- GESTIONE MODALE ---
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgPath = item.querySelector('img').src;
            const text = item.querySelector('.gallery-caption').innerText;

            modalImg.src = imgPath;
            modalCaption.innerText = text;
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        });
    });

    // Chiudi modale
    document.querySelector('.modal-close').onclick = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };
