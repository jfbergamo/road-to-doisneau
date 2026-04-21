const API_URL = `https://localhost:7022/api`

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

    // --- 2. FORMATTAZIONE INPUT CARTA ---
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

// --- 3. HELPER DI VALIDAZIONE E MAPPING ---
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

// --- 4. FUNZIONE ACQUISTO (POST AL DATABASE) ---
async function simulatePurchase() {
    const checkoutScreen = document.getElementById('checkout-screen');
    const loader = document.getElementById('loader');
    
    // Dati carta (per validazione locale)
    const ccValue = document.getElementById('cc-num').value.replace(/\s/g, '');
    const expValue = document.getElementById('cc-exp').value;
    const cvvValue = document.getElementById('cc-cvv').value;

    if (ccValue.length < 16 || !isExpiryValid(expValue) || cvvValue.length < 3) {
        alert("Dati della carta non validi.");
        return;
    }

    // Preparazione Payload per Tabella SQL (holder_name, holder_email, has_booklet, discount_code)
    const finalDetails = JSON.parse(localStorage.getItem('finalOrderDetails')) || [];
    const payload = finalDetails.map(ticket => ({
        holderName: ticket.ownerName,
        holderEmail: ticket.ownerEmail || "email@esempio.com",
        hasBooklet: !!ticket.wantsBooklet,
        discountCode: mapToDiscountCode(ticket.type)
    }));

    // Interfaccia: Caricamento
    checkoutScreen.style.display = 'none';
    loader.style.display = 'block';

    try {
        const body = JSON.stringify({ tickets: payload });

        const response = await fetch(`${API_URL}/orders`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });

        if (!response.ok) throw new Error("Errore durante la creazione dei biglietti.");

        // Il backend restituisce una lista di nomi (es: [{ holder_name: "Mario Rossi" }, ...])
        const resultFromDb = await response.json(); 
        
        renderTickets(resultFromDb.tickets);

    } catch (error) {
        console.error("Errore:", error);
        alert("Il server non risponde. Riprova tra poco.");
        
        // FAIL-SAFE: Non cambia stile, torna al checkout
        loader.style.display = 'none';
        checkoutScreen.style.display = 'grid'; 
    }
}

// --- 5. RENDERING (RICEVE SOLO I NOMI DAL DB) ---
function renderTickets(tickets) {
    const qrGrid = document.getElementById('qr-container-grid');
    const successPage = document.getElementById('success-page');
    const loader = document.getElementById('loader');

    qrGrid.innerHTML = ''; 

    tickets.forEach(async (t) => {
        // Generiamo il QR basandoci sul nome confermato dal database
        let response;
        try {
            response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(t.id)}`, { signal: AbortSignal.timeout(1500) });
        } catch {
            response = await fetch('/content/icons/socials/tiktok_icon.svg');
        }
        const qr = await response.blob();
        
        const qrCard = document.createElement('div');
        qrCard.className = 'qr-card';
        qrCard.innerHTML = `
            <img src="${URL.createObjectURL(qr)}" alt="QR Ticket">
            <p style="font-weight: 700; margin-top: 15px; font-family: var(--font-franklin);">
                ${t.holderName}
            </p>
            <p style="font-family: var(--font-metal); color: var(--accent-color); font-size: 0.9rem;">
                CONFERMATO
            </p>
        `;
        qrGrid.appendChild(qrCard);
    });

    loader.style.display = 'none';
    successPage.style.display = 'block';
    
    // Cleanup storage
    localStorage.removeItem('cartData');
    localStorage.removeItem('finalOrderDetails');
}