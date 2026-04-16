document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.qty-input');
    const grandTotalEl = document.getElementById('grand-total');
    const ticketCountEl = document.getElementById('ticket-count');
    const checkoutBar = document.getElementById('checkoutBar');
    const errorMsg = document.getElementById('limit-error');
    const MAX_TOTAL = 15;

    // Salviamo lo stato precedente per il ripristino istantaneo
    let previousState = new Map();
    inputs.forEach(input => previousState.set(input, 0));

    function updateOrder() {
        let totalQty = 0;
        let totalPrice = 0;

        // 1. Calcolo preventivo della quantità
        inputs.forEach(input => {
            totalQty += parseInt(input.value) || 0;
        });

        // 2. Controllo Limite
        if (totalQty > MAX_TOTAL) {
            // Mostra errore e vibrazione
            errorMsg.style.display = 'block';
            
            // Ripristina i valori precedenti in tutti gli input
            inputs.forEach(input => {
                input.value = previousState.get(input);
            });
            
            // Ricalcola la quantità corretta dopo il ripristino
            totalQty = 0;
            inputs.forEach(input => totalQty += parseInt(input.value) || 0);
        } else {
            // Nascondi errore e salva lo stato attuale come valido
            errorMsg.style.display = 'none';
            inputs.forEach(input => {
                previousState.set(input, parseInt(input.value) || 0);
            });
        }

        // 3. Calcolo del prezzo finale
        inputs.forEach(input => {
            const qty = parseInt(input.value) || 0;
            const price = parseFloat(input.getAttribute('data-price'));
            totalPrice += qty * price;
        });

        // 4. Aggiornamento UI
        ticketCountEl.innerText = totalQty;
        grandTotalEl.innerText = `€${totalPrice}`;

        // Mostra la barra solo se ci sono biglietti (anche quelli a 0€)
        if (totalQty > 0) {
            checkoutBar.classList.add('active');
        } else {
            checkoutBar.classList.remove('active');
        }
    }

    // Gestione Navbar
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    // Eventi di input
    inputs.forEach(input => {
        input.addEventListener('input', updateOrder);
    });
});