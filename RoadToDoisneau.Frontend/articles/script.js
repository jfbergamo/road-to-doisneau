const grid = document.getElementById('blog-grid');
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem('lang') || 'it';

// Nav

document.addEventListener('DOMContentLoaded', async () => {

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

    
    // Translastions
  
    loadTranslations(currentLang);
});

// Translations

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

/**
 * SIMULATORE AFFLUENZA LIVE PORDENONE
 * Gestisce l'aumento dei visitatori anche in background e dopo il refresh
 */

const counterElement = document.getElementById('visitor-count');

// --- CONFIGURAZIONE ---
const START_COUNT = 5000;           // Punto di partenza assoluto
const AVG_SECONDS_PER_VISITOR = 4;  // Media di un visitatore ogni X secondi
const MAX_RANDOM_ADD = 3;           // Massimo visitatori aggiunti per ogni "tick" live

// --- LOGICA DI PERSISTENZA ---
let visitorCount = parseInt(localStorage.getItem('liveVisitors')) || START_COUNT;
let lastUpdate = parseInt(localStorage.getItem('lastTimestamp')) || Date.now();

/**
 * Calcola quanti visitatori sono passati mentre la pagina era chiusa/in background
 */
function syncWithTimePast() {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - lastUpdate) / 1000);
    
    if (diffInSeconds > 0) {
        // Calcola i visitatori teorici basandosi sulla media
        const missedVisitors = Math.floor(diffInSeconds / AVG_SECONDS_PER_VISITOR);
        
        if (missedVisitors > 0) {
            visitorCount += missedVisitors;
        }
    }
    updateUI();
}

/**
 * Aggiorna il testo a schermo e salva i dati nel browser
 */
function updateUI() {
    // Formattazione italiana (es: 5.120 invece di 5120)
    counterElement.textContent = visitorCount.toLocaleString('it-IT');
    
    // Salva per il prossimo accesso
    localStorage.setItem('liveVisitors', visitorCount);
    localStorage.setItem('lastTimestamp', Date.now());
}

/**
 * Simula l'affluenza in tempo reale quando la pagina è aperta
 */
function startLiveSimulation() {
    // Genera un incremento casuale (da 0 a MAX_RANDOM_ADD)
    const newArrivals = Math.floor(Math.random() * (MAX_RANDOM_ADD + 1));
    
    if (newArrivals > 0) {
        visitorCount += newArrivals;
        updateUI();
    }

    // Prossimo aggiornamento tra 2 e 6 secondi per non sembrare un bot
    const nextTick = Math.floor(Math.random() * 4000) + 2000;
    setTimeout(startLiveSimulation, nextTick);
}

// --- GESTIONE EVENTI ---

// 1. Al caricamento: sincronizza il tempo perso e avvia
syncWithTimePast();
startLiveSimulation();

// 2. Quando l'utente torna sulla scheda del browser (background -> foreground)
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
        syncWithTimePast();
    }
});
