const grid = document.getElementById('blog-grid');

const API_ENDPOINT = "https://localhost:7022/api"

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

(async () => {
    const result = await fetch(`${API_ENDPOINT}/articles`).then(x => x.json());
    grid.innerHTML = '';
    for (const article of result) {
        grid.appendChild(renderArticle(article));
    }
})();