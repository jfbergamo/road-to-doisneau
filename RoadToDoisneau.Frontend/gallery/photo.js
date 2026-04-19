localStorage.clear();

document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.main-gallery');
    const unlocker = document.getElementById('unlocker');
    const mainContent = document.getElementById('main-content');
    const filmRoll = document.querySelector('.film-roll');

    // --- VARIABILI DI STATO PER LA NAVIGAZIONE ---
    let allPhotos = []; // Archivio locale dei dati JSON
    let currentIndex = 0; // Indice della foto attualmente aperta

    // --- 1. FUNZIONE PER CARICARE IL JSON ---
    async function loadGalleryData() {
        try {
            const response = await fetch('gallery.json');
            if (!response.ok) throw new Error("File JSON non trovato");
            
            allPhotos = await response.json(); // Salva i dati nell'array globale
            renderGallery(allPhotos);
            
        } catch (error) {
            console.error("Errore:", error);
            galleryContainer.innerHTML = `<p style="color:white;">Errore: ${error.message}</p>`;
        }
    }

    // --- 2. FUNZIONE PER GENERARE L'HTML ---
    function renderGallery(photos) {
        galleryContainer.innerHTML = ''; 

        photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            item.innerHTML = `
                <img src="${photo.url}" alt="${photo.title}" loading="lazy" class="is-blurred">
                <div class="gallery-overlay">
                    <span>${photo.shooting_year}</span>
                </div>
            `;

            // Passiamo l'indice alla funzione openModal
            item.addEventListener('click', () => openModal(index));
            
            galleryContainer.appendChild(item);
        });
    }

    // --- 3. GESTIONE MODALE E NAVIGAZIONE ---
    const modal = document.getElementById("photoModal");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");

    function openModal(index) {
        currentIndex = index; // Aggiorna l'indice corrente
        updateModalContent();
        
        modal.style.display = "flex"; // Usa 'flex' per il centramento CSS
        document.body.style.overflow = "hidden";
    }

    // Funzione dedicata per aggiornare i dati nel modale senza chiuderlo
    function updateModalContent() {
        const photo = allPhotos[currentIndex];
        
        // Effetto dissolvenza opzionale: resetta src per evitare "scatti"
        modalImg.src = photo.url;
        modalCaption.innerHTML = `
            <h2>${photo.title}</h2>
            <p><strong>Luogo:</strong> ${photo.location}</p>
            <p>${photo.description}</p>
            <p><em>Anno: ${photo.shooting_year}</em></p>
        `;
    }

    // Logica tasti Avanti/Indietro
    document.getElementById('nextBtn').onclick = (e) => {
        e.stopPropagation(); // Evita conflitti di click
        currentIndex = (currentIndex + 1) % allPhotos.length; // Torna all'inizio se finiscono
        updateModalContent();
    };

    document.getElementById('prevBtn').onclick = (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + allPhotos.length) % allPhotos.length; // Va alla fine se sei alla prima
        updateModalContent();
    };

    // --- 4. CHIUSURA E LOCKER ---
    document.querySelector('.modal-close').onclick = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    // Chiudi cliccando fuori dall'immagine
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    const reveal = () => {

        if (filmRoll) {
        filmRoll.textContent = '🔓'; 
        filmRoll.style.transform = 'scale(1.5)';
        filmRoll.style.opacity = '0';
    }

    setTimeout(() => {
        unlocker.classList.add('hidden');
        mainContent.classList.remove('is-blurred');
        mainContent.classList.add('no-blur');
        document.body.classList.remove('locked');
    }, 300); 
    };

    if (filmRoll) filmRoll.addEventListener('click', reveal);

    loadGalleryData();
});