document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SETUP INIZIALE E RIEPILOGO ---
    const finalDetails = JSON.parse(localStorage.getItem('finalOrderDetails')) || [];
    const summaryContainer = document.getElementById('ticket-summary-list');
    const totalDisplay = document.getElementById('final-total-display');
    
    if (finalDetails.length === 0) {
        window.location.href = "/checkout";
        return;
    }

    let runningTotal = 0;
    finalDetails.forEach(ticket => {
        const ticketPrice = parseFloat(ticket.price);
        const itemTotal = ticketPrice + (ticket.wantsBooklet ? 4 : 0);
        runningTotal += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <span>${ticket.type} (${ticket.ownerName}) ${ticket.wantsBooklet ? '+ Booklet' : ''}</span>
            <span>€ ${itemTotal.toFixed(2)}</span>
        `;
        summaryContainer.appendChild(itemDiv);
    });
    totalDisplay.innerText = `€ ${runningTotal.toFixed(2)}`;

    // --- 2. FORMATTAZIONE INPUT CARTA (SOLO ESTETICA) ---
    const ccNum = document.getElementById('cc-num');
    const ccExp = document.getElementById('cc-exp');
    const ccName = document.getElementById('cc-name');
    const cvvInput = document.getElementById('cc-cvv');

    ccNum?.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        let formatted = v.match(/.{1,4}/g)?.join(' ') || '';
        e.target.value = formatted;
        document.getElementById('card-display').innerText = formatted || '•••• •••• •••• ••••';
    });

    ccExp?.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
        e.target.value = v;
        document.getElementById('date-display').innerText = v || 'MM/AA';
    });

    ccName?.addEventListener('input', (e) => {
        document.getElementById('name-display').innerText = e.target.value.toUpperCase() || 'TITOLARE CARTA';
    });

    cvvInput?.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 3);
    });
});

// --- 3. HELPER DI VALIDAZIONE ---
function isExpiryValid(val) {
    if (!/^\d{2}\/\d{2}$/.test(val)) return false;
    const [m, y] = val.split('/').map(n => parseInt(n, 10));
    const now = new Date();
    const curY = parseInt(now.getFullYear().toString().slice(-2), 10);
    const curM = now.getMonth() + 1;
    return (m >= 1 && m <= 12) && (y > curY || (y === curY && m >= curM));
}

function mapToDiscountCode(type) {
    const t = type.toLowerCase();
    if (t.includes('studente')) return 'STUD';
    if (t.includes('over'))     return 'OVER';
    if (t.includes('gratis'))   return 'FREE';
    return 'FULL';
}

// --- 4. FUNZIONE CORE: ACQUISTO ---
async function simulatePurchase() {
    // Referenze UI
    const checkoutScreen = document.getElementById('checkout-screen');
    const loader = document.getElementById('loader');
    const ccValue = document.getElementById('cc-num').value.replace(/\s/g, '');
    const expValue = document.getElementById('cc-exp').value;
    const cvvValue = document.getElementById('cc-cvv').value;

    // A. Validazione locale (Blocca subito se i campi sono palesemente errati)
    if (ccValue.length < 16 || !isExpiryValid(expValue) || cvvValue.length < 3) {
        alert("Dati della carta non validi. Controlla numero, scadenza e CVV.");
        return;
    }

    // B. Preparazione dati per il DB (Mapping)
    const finalDetails = JSON.parse(localStorage.getItem('finalOrderDetails')) || [];
    const payload = finalDetails.map(ticket => ({
        holder_name: ticket.ownerName,
        holder_email: ticket.ownerEmail || "utente@esempio.it",
        has_booklet: !!ticket.wantsBooklet,
        discount_code: mapToDiscountCode(ticket.type)
    }));

    // C. Mostra Loader
    checkoutScreen.style.display = 'none';
    loader.style.display = 'block';

    try {
        // D. Chiamata al Back-end
        const response = await fetch('/api/tickets/purchase', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tickets: payload })
        });

        if (!response.ok) {
            throw new Error("Errore server: " + response.status);
        }

        const dataFromDb = await response.json(); 
        // Assumiamo che il server restituisca l'array di record inseriti (con ticket_id UUID)
        
        renderTickets(dataFromDb);

    } catch (error) {
        // --- E. GESTIONE FALLIMENTO: NON CAMBIARE STILE SE FALLISCE ---
        console.error("Errore durante l'invio:", error);
        alert("Il pagamento non è andato a buon fine. Riprova tra un istante.");
        
        // Nascondi loader e torna al modulo (non perdiamo i dati inseriti)
        loader.style.display = 'none';
        checkoutScreen.style.display = 'grid'; 
    }
}

// --- 5. MOSTRA I QR GENERATI DAL DB ---
function renderTickets(tickets) {
    const qrGrid = document.getElementById('qr-container-grid');
    const successPage = document.getElementById('success-page');
    const loader = document.getElementById('loader');

    qrGrid.innerHTML = ''; 

    tickets.forEach(t => {
        // Usiamo l'UUID generato dal tuo database per il QR
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${t.ticket_id}`;
        
        const qrCard = document.createElement('div');
        qrCard.className = 'qr-card';
        qrCard.innerHTML = `
            <img src="${qrUrl}" alt="QR Ticket">
            <p style="font-weight: 700; margin-top: 10px;">${t.holder_name}</p>
            <p style="font-size: 0.8rem; color: #666; margin: 2px 0;">${t.discount_code}</p>
            <small style="font-family: monospace; color: #FAC4B8;">${t.ticket_id.substring(0, 8)}...</small>
        `;
        qrGrid.appendChild(qrCard);
    });

    loader.style.display = 'none';
    successPage.style.display = 'block';
    
    // Svuota memoria
    localStorage.removeItem('cartData');
    localStorage.removeItem('finalOrderDetails');
}