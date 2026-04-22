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

document.addEventListener('DOMContentLoaded', async () => {
        const response = await fetch(`${API_ENDPOINT}/articles`);
    if (response.headers.get('content-type')?.includes('application/json')) {
        const articles = await response.json();
        for (const article of articles) {
            grid.appendChild(renderArticle(article));
        }
    } else {
        console.error(`Incorrect response from server`);
    }
});