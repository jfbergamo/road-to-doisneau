document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('participants-container');
    const finalPriceEl = document.getElementById('final-price');
    const form = document.getElementById('checkout-form-final');

    // 1. Recupera i dati dal LocalStorage
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    // Puliamo la stringa del totale per avere solo il numero (es: "€24" -> 24)
    let baseTotal = parseFloat(localStorage.getItem('totalAmount').replace('€', '')) || 0;
    const BOOKLET_PRICE = 4;

    if (cartData.length === 0) {
        window.location.href = "/checkout";
        return;
    }

    // Funzione per ricalcolare il totale in tempo reale
    function refreshTotal() {
        const activeBooklets = document.querySelectorAll('.booklet-check:checked').length;
        const finalTotal = baseTotal + (activeBooklets * BOOKLET_PRICE);
        finalPriceEl.innerText = `€${finalTotal}`;
    }

    // 2. Genera i form per ogni partecipante
    cartData.forEach((ticket, index) => {
        const card = document.createElement('div');
        card.className = 'participant-card-visual';
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; text-transform: uppercase; font-weight: bold;">Biglietto ${index + 1}</h3>
                <span class="ticket-tag" style="background: #000; color: #fff; padding: 4px 10px; border-radius: 5px; font-size: 0.7rem;">
                    ${ticket.type}
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <input type="text" name="name_${index}" placeholder="Nome e Cognome" required style="padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                <input type="email" name="email_${index}" placeholder="Email" required style="padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
            </div>

            <div style="margin-top: 15px; display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" name="booklet_${index}" id="booklet_${index}" class="booklet-check" style="width: 18px; height: 18px; cursor: pointer;">
                <label for="booklet_${index}" style="font-size: 1.1rem; font-weight: bold; cursor: pointer;">
                    Aggiungi Booklet fotografico (+€${BOOKLET_PRICE})
                </label>
            </div>
        `;
        container.appendChild(card);
    });

    // Aggiungiamo l'evento ai checkbox appena creati
    document.querySelectorAll('.booklet-check').forEach(checkbox => {
        checkbox.addEventListener('change', refreshTotal);
    });

    // Inizializziamo il totale al caricamento
    refreshTotal();

    // 3. Invio a /purchase
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const finalDetails = cartData.map((ticket, index) => {
            return {
                ...ticket,
                ownerName: form[`name_${index}`].value,
                ownerEmail: form[`email_${index}`].value,
                wantsBooklet: form[`booklet_${index}`].checked,
                ticketID: `RD-${Math.floor(100000 + Math.random() * 900000)}`
            };
        });

        localStorage.setItem('finalOrderDetails', JSON.stringify(finalDetails));
        window.location.href = "/purchase";
    });
});