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

const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -70% 0px',
    threshold: 0
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            document.body.setAttribute('data-active-section', sectionId);

            if (sectionId !== 'home') {
                document.querySelector('.navbar').classList.add('scrolled');
            } else {
                document.querySelector('.navbar').classList.remove('scrolled');
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

const sections = document.querySelectorAll('div[id], section[id], footer[id]');
sections.forEach(section => observer.observe(section));


const closingDate = new Date("2026-08-14T23:59:59").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = closingDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.querySelector(".countdown-container").innerHTML = "<h3>Mostra Conclusa!</h3>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
}

updateCountdown();

const countdownInterval = setInterval(updateCountdown, 1000);


function toggleWidget() {
    const widget = document.getElementById('contactWidget');
    widget.classList.toggle('active');

    const triggerText = widget.querySelector('.text');
    if (widget.classList.contains('active')) {
        triggerText.innerText = 'Chiudi';
    } else {
        triggerText.innerText = 'Contattaci';
    }
}

// Booklet
const booklet = document.querySelector('.booklet img');

if (booklet) {
    const bookletObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            } else {
                entry.target.classList.remove('fade-in-visible');
            }
        });
    }, {
        threshold: 0.2
    });

    bookletObserver.observe(booklet);
}

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
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('form[action="/submit"]');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Recupero valori
            const nome = document.getElementById('nome').value;
            const interesseSelect = document.getElementById('interesse');
            const interesseTesto = interesseSelect.options[interesseSelect.selectedIndex].text;
            
            // Qui c'era l'errore: usiamo 'dettaglio' costantemente
            const dettaglio = document.getElementById('dettaglio').value;

            // Salvataggio nel localStorage (usiamo una chiave sola per chiarezza)
            localStorage.setItem('user_message', dettaglio);
            localStorage.setItem('user_name', nome);

            // Costruzione URL (assicurati che il percorso /request/ sia corretto per la tua struttura cartelle)
            const targetUrl = `/request/index.html?richiesta=${encodeURIComponent(interesseTesto)}`;

            window.location.href = targetUrl;
        });
    }
});