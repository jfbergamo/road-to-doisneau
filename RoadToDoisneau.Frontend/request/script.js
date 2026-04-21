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