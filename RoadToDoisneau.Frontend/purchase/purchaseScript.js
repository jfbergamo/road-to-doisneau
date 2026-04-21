document.addEventListener('DOMContentLoaded', () => {
    // --- 1. RECUPERO DATI E RIEPILOGO ---
    const finalDetails = JSON.parse(localStorage.getItem('finalOrderDetails')) || [];
    const summaryContainer = document.getElementById('ticket-summary-list');
    const totalDisplay = document.getElementById('final-total-display');
    
    if (finalDetails.length === 0) {
        window.location.href = "/checkout";
        return;
    }

    let runningTotal = 0;
    finalDetails.forEach(ticket => {
        let ticketPrice = parseFloat(ticket.price);
        let itemTotal = ticketPrice + (ticket.wantsBooklet ? 4 : 0);
        runningTotal += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.style = "display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 8px;";
        itemDiv.innerHTML = `
            <span>${ticket.type} (${ticket.ownerName}) ${ticket.wantsBooklet ? '+ Booklet' : ''}</span>
            <span>€ ${itemTotal.toFixed(2)}</span>
        `;
        summaryContainer.appendChild(itemDiv);
    });
    totalDisplay.innerText = `€ ${runningTotal.toFixed(2)}`;

    // --- 2. LOGICA UNIFICATA CARTA DI CREDITO ---
    const ccNum = document.getElementById('cc-num');
    const ccExp = document.getElementById('cc-exp');
    const ccName = document.getElementById('cc-name');
    const cvvInput = document.getElementById('cc-cvv');
    const cardDisplay = document.getElementById('card-display');

    // Gestione NUMERO CARTA (Formattazione 4 4 4 4)
    ccNum.addEventListener('input', (e) => {
        // Rimuove tutto ciò che non è un numero
        let value = e.target.value.replace(/\D/g, '');
        
        // Limita a 16 cifre
        if (value.length > 16) value = value.slice(0, 16);

        // Formatta con spazi ogni 4 cifre
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
        
        e.target.value = formattedValue;
        if (cardDisplay) cardDisplay.innerText = formattedValue || '•••• •••• •••• ••••';

        // Riconoscimento circuito in console
        if (value.startsWith('4')) console.log("Visa");
        else if (value.startsWith('5')) console.log("Mastercard");
    });

    // Blocca tasti non numerici su Numero Carta
    ccNum.addEventListener('keydown', (e) => {
        const isNumber = /^[0-9]$/.test(e.key);
        const isControl = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(e.key);
        if (!isNumber && !isControl) e.preventDefault();
    });

    // Gestione SCADENZA (MM/AA)
    ccExp.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
        e.target.value = v;
        document.getElementById('date-display').innerText = v || 'MM/AA';
    });

    // Gestione NOME
    ccName.addEventListener('input', (e) => {
        document.getElementById('name-display').innerText = e.target.value.toUpperCase() || 'TITOLARE CARTA';
    });

    // Gestione CVV
    cvvInput.addEventListener('input', function (e) {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length > 3) this.value = this.value.slice(0, 3);
    });
});

// --- 3. VALIDAZIONE E ACQUISTO ---
function validateExpiry(val) {
    if (!/^\d{2}\/\d{2}$/.test(val)) return false;
    const parts = val.split('/');
    const month = parseInt(parts[0], 10);
    const year = parseInt("20" + parts[1], 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) return false;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
}

function simulatePurchase() {
    const expValue = document.getElementById('cc-exp').value;
    const ccValue = document.getElementById('cc-num').value.replace(/\s/g, '');
    const cvvValue = document.getElementById('cc-cvv').value;

    if (ccValue.length < 16) {
        alert("Inserisci un numero di carta valido (16 cifre).");
        return;
    }

    if (!validateExpiry(expValue)) {
        alert("La data di scadenza della carta non è valida o è nel passato.");
        document.getElementById('cc-exp').focus();
        return;
    }

    if (cvvValue.length < 3) {
        alert("Inserisci un CVV valido.");
        return;
    }

    // Effetto caricamento
    document.getElementById('checkout-screen').style.display = 'none';
    document.getElementById('loader').style.display = 'block';

    setTimeout(() => {
        const finalDetails = JSON.parse(localStorage.getItem('finalOrderDetails'));
        const qrGrid = document.getElementById('qr-container-grid');
        qrGrid.innerHTML = ''; // Pulisce se necessario

        finalDetails.forEach(ticket => {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ID:${ticket.ticketID}-User:${ticket.ownerName}`;
            
            const qrCard = document.createElement('div');
            qrCard.className = 'qr-card'; // Usa la classe definita nel CSS
            qrCard.style = "padding: 15px; background: #fff; border: 1px solid #eee; text-align: center;";
            qrCard.innerHTML = `
                <img src="${qrUrl}" alt="QR Code">
                <p style="font-weight: bold; margin: 10px 0 5px;">${ticket.ownerName}</p>
                <p style="font-size: 0.8rem; color: #666;">${ticket.type}</p>
                <p style="font-family: monospace; font-size: 0.7rem; color: #000;">${ticket.ticketID}</p>
            `;
            qrGrid.appendChild(qrCard);
        });

        document.getElementById('loader').style.display = 'none';
        document.getElementById('success-page').style.display = 'block';
        
        localStorage.removeItem('cartData');
        localStorage.removeItem('finalOrderDetails');
    }, 3000);
}