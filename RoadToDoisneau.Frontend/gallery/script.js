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


// --- GESTIONE MODALE ---
const modal = document.getElementById('photoModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const clickedImg = item.querySelector('img');
        const clickedCaption = item.querySelector('.gallery-caption');

        if (clickedImg && modalImg) {
            // FORCE the image to update to the new source
            modalImg.src = clickedImg.src;
        }

        if (clickedCaption && modalCaption) {
            // Use innerText to OVERWRITE the old caption so they don't stack
            modalCaption.innerText = clickedCaption.innerText;
        }

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    });
});

// Close logic
document.querySelector('.modal-close').onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    // Optional: Clear the image/text so it's fresh for next time
    modalImg.src = "";
    modalCaption.innerText = "";
};

// i18n Translation
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem('lang') || 'it';

langToggle.textContent = currentLang === 'it' ? 'EN' : 'IT';

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) throw new Error("Could not load translation file");

        const translations = await response.json();
        applyTranslations(translations);
    } catch (error) {
        console.error("Translation error:", error);
    }
}

function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let text = translations;

        keys.forEach(key => {
            if (text) text = text[key];
        });

        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.innerText = text;
            }
        }
    });
}

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'it' ? 'en' : 'it';

    langToggle.textContent = currentLang === 'it' ? 'EN' : 'IT';

    localStorage.setItem('lang', currentLang);

    loadTranslations(currentLang);
});

loadTranslations(currentLang);
