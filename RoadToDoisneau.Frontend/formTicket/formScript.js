const BOOKLET_PRICE = 4;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('participants-container');
    const finalPriceEl = document.getElementById('final-price');
    const form = document.getElementById('checkout-form-final');

    // 1. Recupera i dati dal LocalStorage
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    // Puliamo la stringa del totale per avere solo il numero (es: "€24" -> 24)
    let baseTotal = parseFloat(localStorage.getItem('totalAmount').replace('€', '')) || 0;

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
        renderCard(card, ticket, index);
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

function renderCard(card, ticket, index) {
    {
        const div = document.createElement('div');
        div.setAttribute('style', "display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;");
        {
            const h4 = document.createElement('h4');
            h4.setAttribute('style', "margin: 0; text-transform: uppercase;");
            h4.innerText = `Biglietto ${index + 1}`;
            div.appendChild(h4);
        }
        {
            const span = document.createElement('span');
            span.setAttribute('class', "ticket-tag");
            span.setAttribute('style', "background: #000; color: #fff; padding: 4px 10px; border-radius: 5px; font-size: 0.7rem;");
            span.innerText = ticket.type;
            div.appendChild(span);
        }
        card.appendChild(div);
    }
    {
        const div = document.createElement('div');
        div.setAttribute('style', "display: grid; grid-template-columns: 1fr 1fr; gap: 15px;")
        {
            const input = document.createElement('input');
            input.setAttribute('type', "text");
            input.setAttribute('name', `name_${index}`);
            input.setAttribute('placeholder', "Nome e cognome");
            input.setAttribute('required', '');
            input.setAttribute('style', "padding: 12px; border: 1px solid #ddd; border-radius: 8px;");
            div.appendChild(input);
        }
        {
            const input = document.createElement('input');
            input.setAttribute('type', "email");
            input.setAttribute('name', `email_${index}`);
            input.setAttribute('placeholder', "Email");
            input.setAttribute('required', '');
            input.setAttribute('style', "padding: 12px; border: 1px solid #ddd; border-radius: 8px;");
            div.appendChild(input);
        }
        card.appendChild(div);
    }
    {
        const div = document.createElement('div');
        div.setAttribute('style', "margin-top: 15px; display: flex; align-items: center; gap: 10px;")
        {
            const input = document.createElement('input');
            input.setAttribute('type', "checkbox");
            input.setAttribute('name', `booklet_${index}`);
            input.setAttribute('id', `booklet_${index}`);
            input.setAttribute('class', "booklet-check");
            input.setAttribute('style', "width: 18px; height: 18px; cursor: pointer;");
            div.appendChild(input);
        }
        {
            const label = document.createElement('label');
            label.setAttribute('for', `booklet_${index}`);
            label.setAttribute('style', "font-size: 0.9rem; cursor: pointer;");
            label.innerText = `Aggiungi Booklet fotografico (+€${BOOKLET_PRICE})`;
            div.appendChild(label);
        }
        card.appendChild(div);
    }
}