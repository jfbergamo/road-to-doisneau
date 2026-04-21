// --- NAVBAR LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const hamburger = document.querySelector(".nav-hamburger");
    const navContent = document.querySelector(".nav-content");

    if (hamburger && navContent) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navContent.classList.toggle("active");

            const isOpened = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", !isOpened);
        });

        const navLinks = document.querySelectorAll(".nav-links a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navContent.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });
    }
});

// --- CART, CHECKOUT & LOCAL STORAGE LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.qty-input');
    const grandTotalEl = document.getElementById('grand-total');
    const ticketCountEl = document.getElementById('ticket-count');
    const checkoutBar = document.getElementById('checkoutBar');
    const errorMsg = document.getElementById('limit-error');
    const btnBuy = document.querySelector('.btn-buy'); // Seleziona il bottone "Acquista"
    const MAX_TOTAL = 15;

    let previousState = new Map();
    inputs.forEach(input => previousState.set(input, 0));

    function updateOrder() {
        let totalQty = 0;
        let totalPrice = 0;

        inputs.forEach(input => {
            totalQty += parseInt(input.value) || 0;
        });

        if (totalQty > MAX_TOTAL) {
            if (errorMsg) errorMsg.style.display = 'block';
            inputs.forEach(input => {
                input.value = previousState.get(input);
            });
            totalQty = 0;
            inputs.forEach(input => totalQty += parseInt(input.value) || 0);
        } else {
            if (errorMsg) errorMsg.style.display = 'none';
            inputs.forEach(input => {
                previousState.set(input, parseInt(input.value) || 0);
            });
        }

        inputs.forEach(input => {
            const qty = parseInt(input.value) || 0;
            const price = parseFloat(input.dataset.price || input.getAttribute('data-price')) || 0;
            totalPrice += qty * price;
        });

        if (ticketCountEl) ticketCountEl.innerText = totalQty;
        if (grandTotalEl) grandTotalEl.innerText = `€${totalPrice}`;

        if (checkoutBar) {
            if (totalQty > 0) {
                checkoutBar.classList.add('active');
            } else {
                checkoutBar.classList.remove('active');
            }
        }
    }

    // Salvataggio dati e reindirizzamento
    if (btnBuy) {
        btnBuy.addEventListener('click', (e) => {
            e.preventDefault(); // Impedisce il salto immediato se dentro un tag <a>
            
            let selectedTickets = [];
            inputs.forEach(input => {
                const qty = parseInt(input.value) || 0;
                if (qty > 0) {
                    const price = parseFloat(input.dataset.price || input.getAttribute('data-price')) || 0;
                    // Recupera il tipo dal tag o dall'attributo data-type
                    const type = input.dataset.type || input.closest('.card-visual').querySelector('.ticket-tag').innerText;
                    const label = input.closest('.price-item-pill')?.querySelector('.label')?.innerText || "";

                    for (let i = 0; i < qty; i++) {
                        selectedTickets.push({
                            type: type,
                            label: label,
                            price: price
                        });
                    }
                }
            });

            if (selectedTickets.length > 0) {
                // Salva nel browser
                localStorage.setItem('cartData', JSON.stringify(selectedTickets));
                localStorage.setItem('totalAmount', grandTotalEl.innerText);
                
                // Vai alla pagina del form
                window.location.href = '/formTicket';
            } else {
                alert("Per favore, seleziona almeno un biglietto.");
            }
        });
    }

    // Input manuale
    inputs.forEach(input => {
        input.addEventListener('input', updateOrder);
    });

    // Pulsanti + e -
    const qtySelectors = document.querySelectorAll('.qty-selector');
    qtySelectors.forEach(selector => {
        const input = selector.querySelector('.qty-input');
        const btnMinus = selector.querySelector('.minus');
        const btnPlus = selector.querySelector('.plus');

        if (input && btnMinus && btnPlus) {
            btnMinus.addEventListener('click', () => {
                let currentValue = parseInt(input.value) || 0;
                if (currentValue > 0) {
                    input.value = currentValue - 1;
                    updateOrder();
                }
            });

            btnPlus.addEventListener('click', () => {
                let currentValue = parseInt(input.value) || 0;
                let max = parseInt(input.getAttribute('max')) || 15;
                if (currentValue < max) {
                    input.value = currentValue + 1;
                    updateOrder();
                }
            });
        }
    });
});

// i18n Translation
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem('lang') || 'it';

langToggle.textContent = currentLang === 'it' ? 'EN' : 'IT';

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) throw new Error("Could not load translation file");

        const translations = await response.json();
        applyTranslations(translations);
    } catch (error) {
        console.error("Translation error:", error);
    }
}

function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let text = translations;

        keys.forEach(key => {
            if (text) text = text[key];
        });

        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.innerHTML = text;
            }
        }
    });
}

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'it' ? 'en' : 'it';

    langToggle.textContent = currentLang === 'it' ? 'EN' : 'IT';

    localStorage.setItem('lang', currentLang);

    loadTranslations(currentLang);
});

loadTranslations(currentLang);