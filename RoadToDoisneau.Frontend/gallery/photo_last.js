document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.main-gallery');

    // 1. Funzione per recuperare i dati dal database (tramite API)
    async function fetchPhotos() {
        try {
            // Sostituisci con il tuo endpoint reale (es. php, node, o un file json locale per test)
            const response = await fetch('/api/photos'); 
            const photos = await response.json();
            renderGallery(photos);
        } catch (error) {
            console.error("Errore nel caricamento delle foto:", error);
            galleryContainer.innerHTML = "<p>Errore nel caricamento della galleria.</p>";
        }
    }

    // 2. Funzione per iniettare l'HTML nella pagina
    function renderGallery(photos) {
        galleryContainer.innerHTML = ''; // Pulisce il contenitore

        photos.forEach(photo => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            // Definiamo il percorso base delle immagini
            const imagePath = `/content/photo/${photo.url}`;

            item.innerHTML = `
                <img src="${imagePath}" alt="${photo.title}" loading="lazy">
                <div class="gallery-overlay">
                    <span>${photo.shooting_year}</span>
                </div>
                <div class="gallery-caption" style="display:none;">
                    <h3>${photo.title}</h3>
                    <p><strong>Luogo:</strong> ${photo.location}</p>
                    <p>${photo.description}</p>
                    <p><em>Anno: ${photo.shooting_year}</em></p>
                </div>
            `;

            // Evento click per il modale
            item.addEventListener('click', () => openModal(photo, imagePath));
            
            galleryContainer.appendChild(item);
        });
    }

    // 3. Funzione gestione Modale
    function openModal(photo, path) {
        const modal = document.getElementById("photoModal");
        const modalImg = document.getElementById("modalImg");
        const modalCaption = document.getElementById("modalCaption");

        modalImg.src = path;
        modalCaption.innerHTML = `
            <h2>${photo.title}</h2>
            <p class="location">📍 ${photo.location}</p>
            <p class="desc">${photo.description}</p>
            <span class="year">${photo.shooting_year}</span>
        `;
        
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    // Avvia il caricamento
    fetchPhotos();
});