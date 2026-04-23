document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.main-gallery');
    const mainContent = document.getElementById('main-content');

    // --- VARIABILI DI STATO PER LA NAVIGAZIONE ---
    let allPhotos = []; // Archivio locale dei dati JSON
    let currentIndex = 0; // Indice della foto attualmente aperta

    // --- 1. FUNZIONE PER CARICARE IL JSON ---
    async function loadGalleryData() {
        const response = await fetch(`${API_ENDPOINT}/photos`);
        if (!response.ok) throw new Error("File JSON non trovato");

        allPhotos = await response.json(); // Salva i dati nell'array globale
        renderGallery(allPhotos);
    }

    // --- 2. FUNZIONE PER GENERARE L'HTML ---
    function renderGallery(photos) {
        galleryContainer.innerHTML = '';

        photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            {
                const img = document.createElement('img');
                img.setAttribute('src', photo.url);
                img.setAttribute('alt', photo.title);
                img.setAttribute('loading', "lazy");
                img.setAttribute('class', "is-blurred");
                item.appendChild(img);
            }
            {
                const div = document.createElement('div');
                div.setAttribute('class', "gallery-overlay");
                {
                    const span = document.createElement('span');
                    span.innerText = photo.shootingYear;
                    div.appendChild(span);
                }
                item.appendChild(div);
            }

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

        // 1. Clear previous captions to prevent stacking
        modalCaption.innerHTML = '';

        // 2. Update image
        modalImg.src = photo.url;
        modalImg.alt = photo.title;

        // 3. Rebuild the caption content
        const h2 = document.createElement('h2');
        h2.innerText = photo.title;
        modalCaption.appendChild(h2);

        const pLocation = document.createElement('p');
        const strong = document.createElement('strong');
        strong.innerText = 'Luogo: ';
        pLocation.appendChild(strong);
        pLocation.append(photo.location); // Use append to add text after the strong tag
        modalCaption.appendChild(pLocation);

        const pDesc = document.createElement('p');
        pDesc.innerText = photo.description;
        modalCaption.appendChild(pDesc);

        const pYear = document.createElement('p');
        const em = document.createElement('em');
        em.innerText = `Anno: ${photo.shootingYear}`;
        pYear.appendChild(em);
        modalCaption.appendChild(pYear);
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

    loadGalleryData();
});