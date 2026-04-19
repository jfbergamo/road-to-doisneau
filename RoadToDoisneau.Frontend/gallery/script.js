localStorage.clear();

localStorage.clear();

document.addEventListener('DOMContentLoaded', () => {
    const unlocker = document.getElementById('unlocker');
    const mainContent = document.getElementById('main-content');
    const filmRoll = document.querySelector('.film-roll');

    // Funzione di sblocco
    const reveal = () => {
        if (unlocker && mainContent) {
            unlocker.classList.add('hidden');
            mainContent.classList.remove('is-blurred');
            mainContent.classList.add('no-blur');
            document.body.classList.remove('locked');
        }
    };

    // Click sulla pellicola
    if (filmRoll) {
        filmRoll.addEventListener('click', reveal);
    }

    // Controllo se era già sbloccato
    if (localStorage.getItem('doisneau_unlocked') === 'true') {
        reveal();
    }

    // --- GESTIONE MODALE ---
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgPath = item.querySelector('img').src;
            const text = item.querySelector('.gallery-caption').innerText;
            
            modalImg.src = imgPath;
            modalCaption.innerText = text;
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        });
    });

    // Chiudi modale
    document.querySelector('.modal-close').onclick = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };
});