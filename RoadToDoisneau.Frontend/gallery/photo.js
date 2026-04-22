const API_ENDPOINT = "https://localhost:7022/api";

document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.main-gallery');
    const mainContent = document.getElementById('main-content');

    // --- VARIABILI DI STATO PER LA NAVIGAZIONE ---
    let allPhotos = []; // Archivio locale dei dati JSON
    let currentIndex = 0; // Indice della foto attualmente aperta

    // --- 1. FUNZIONE PER CARICARE IL JSON ---
    async function loadGalleryData() {
        try {
            const response = await fetch(`${API_ENDPOINT}/photos`);
            if (!response.ok) throw new Error("File JSON non trovato");
            
            allPhotos = await response.json(); // Salva i dati nell'array globale
            renderGallery(allPhotos);
            
        } catch (error) {
            console.error("Errore:", error);
            {
                const p = document.createElement('p');
                p.setAttribute('style', "color:white;")
                p.innerText = `Errore: ${error.message}`;
                galleryContainer.appendChild(p);
            }
        }
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
        
        // Effetto dissolvenza opzionale: resetta src per evitare "scatti"
        modalImg.src = photo.url;
        {
            const h2 = document.createElement('h2');
            h2.innerText = photo.title;
            modalCaption.appendChild(h2);
        }
        {
            const p = document.createElement('p');
            {
                const strong = document.createElement('strong');
                strong.innerText = 'Luogo: ';
                p.appendChild(strong);
            }
            p.innerText += photo.location;
            modalCaption.appendChild(p);
        }
        {
            const p = document.createElement('p');
            p.innerText = photo.description;
            modalCaption.appendChild(p);
        }
        {
            const p = document.createElement('p');
            {
                const em = document.createElement('em');
                em.innerText = `Anno: ${photo.shootingYear}`;
                p.appendChild(em);
            }
            modalCaption.appendChild(p);
        }
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