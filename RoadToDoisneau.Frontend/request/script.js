document.addEventListener('DOMContentLoaded', () => {
    // 1. Leggi la tipologia dall'URL
    const params = new URLSearchParams(window.location.search);
    const richiesta = params.get('richiesta');
    if (richiesta) {
        document.getElementById('display-richiesta').innerText = richiesta;
    }

    // 2. Leggi il messaggio dal localStorage
    const messaggioSalvato = localStorage.getItem('user_message');
    const container = document.getElementById('container-messaggio');
    const display = document.getElementById('display-messaggio');

    if (messaggioSalvato && messaggioSalvato.trim() !== "") {
        if (container && display) {
            display.innerText = messaggioSalvato;
            container.style.display = 'block'; // Mostra il box se c'è testo
        }
    } else {
        if (container) container.style.display = 'none'; // Nascondi se vuoto
    }

    // 3. Pulisci il messaggio così non appare a caso dopo
    localStorage.removeItem('user_message');
});

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
                element.innerHTML = text;
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