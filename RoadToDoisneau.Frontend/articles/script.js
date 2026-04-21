const grid = document.getElementById('blog-grid');
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem('lang') || 'it';

const API_ENDPOINT = "https://localhost:7022/api";

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
  
    // Loading of articles

    const response = await fetch(`${API_ENDPOINT}/articles`);
    if (response.headers.get('content-type')?.includes('application/json')) {
        const articles = await response.json();
        for (const article of articles) {
            grid.appendChild(renderArticle(article));
        }
    } else {
        console.error(`Incorrect response from server`);
    }
    
    // Translastions
  
    loadTranslations(currentLang);
});

// Articles

function renderArticle(article) {
    const blogCardArticle = document.createElement('article');
    blogCardArticle.classList.add('blog-card');
    if (article.special) blogCardArticle.classList.add('highlight');
        const cardImageDiv = document.createElement('div');
        cardImageDiv.classList.add('card-image');
            const img = document.createElement('img');
            img.setAttribute('src', article.thumbnail);
            cardImageDiv.appendChild(img);
        blogCardArticle.appendChild(cardImageDiv);

        const cardContentDiv = document.createElement('div');
        cardContentDiv.classList.add('card-content');
            const categorySpan = document.createElement('span');
            categorySpan.classList.add('category');
            categorySpan.innerText = article.category;
            cardContentDiv.appendChild(categorySpan);
            
            const titleElem = document.createElement('h2');
            titleElem.innerText = article.title;
            cardContentDiv.appendChild(titleElem);
            
            const descriptionElem = document.createElement('p');
            descriptionElem.innerText = article.description;
            cardContentDiv.appendChild(descriptionElem);
            
            if (article.quote) {
                const quoteElem = document.createElement('blockquote');
                quoteElem.classList.add('mini-quote');
                quoteElem.innerText = article.quote;
                cardContentDiv.appendChild(quoteElem);
            }

            const pageBtn = document.createElement('button');
            pageBtn.classList.add('btn');
            pageBtn.classList.add('btn-outline');
            pageBtn.innerText = 'Leggi di più';
            pageBtn.addEventListener('click', () => location.href = article.page);
            cardContentDiv.appendChild(pageBtn);
       blogCardArticle.appendChild(cardContentDiv);

    return blogCardArticle;
}

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
