// Nav
document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Ham
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

// Cart & Checkout Logic
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.qty-input');
    const grandTotalEl = document.getElementById('grand-total');
    const ticketCountEl = document.getElementById('ticket-count');
    const checkoutBar = document.getElementById('checkoutBar');
    const errorMsg = document.getElementById('limit-error');
    const MAX_TOTAL = 15;

    // Save previous state for instant reset if limit is exceeded
    let previousState = new Map();
    inputs.forEach(input => previousState.set(input, 0));

    // The Master Function that calculates the math
    function updateOrder() {
        let totalQty = 0;
        let totalPrice = 0;

        // 1. Calculate Quantity
        inputs.forEach(input => {
            totalQty += parseInt(input.value) || 0;
        });

        // 2. Check 15 Ticket Limit
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

        // 3. Calculate Final Price
        inputs.forEach(input => {
            const qty = parseInt(input.value) || 0;
            // Uses dataset or getAttribute safely
            const price = parseFloat(input.dataset.price || input.getAttribute('data-price')) || 0;
            totalPrice += qty * price;
        });

        // 4. Update UI Elements
        if (ticketCountEl) ticketCountEl.innerText = totalQty;
        if (grandTotalEl) grandTotalEl.innerText = `€${totalPrice}`;

        // 5. Show/Hide Checkout Bar
        if (checkoutBar) {
            if (totalQty > 0) {
                checkoutBar.classList.add('active');
            } else {
                checkoutBar.classList.remove('active');
            }
        }
    }

    // Listens for manual typing
    inputs.forEach(input => {
        input.addEventListener('input', updateOrder);
    });

    // --- Modern Quantity Buttons (+ / -) ---
    const qtySelectors = document.querySelectorAll('.qty-selector');

    qtySelectors.forEach(selector => {
        const input = selector.querySelector('.qty-input');
        const btnMinus = selector.querySelector('.minus');
        const btnPlus = selector.querySelector('.plus');

        if (input && btnMinus && btnPlus) {

            // Minus Button
            btnMinus.addEventListener('click', () => {
                let currentValue = parseInt(input.value) || 0;
                if (currentValue > 0) {
                    input.value = currentValue - 1;
                    updateOrder(); // <--- FIXED: Calls the math function directly!
                }
            });

            // Plus Button
            btnPlus.addEventListener('click', () => {
                let currentValue = parseInt(input.value) || 0;
                let max = parseInt(input.getAttribute('max')) || 15;

                if (currentValue < max) {
                    input.value = currentValue + 1;
                    updateOrder(); // <--- FIXED: Calls the math function directly!
                } else {
                    updateOrder(); // Runs it anyway to trigger the 15-limit error if needed
                }
            });
        }
    });
});