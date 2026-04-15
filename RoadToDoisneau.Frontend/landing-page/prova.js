const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -70% 0px',
    threshold: 0
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            document.body.setAttribute('data-active-section', sectionId);
            
            if (sectionId !== 'home') {
                document.querySelector('.navbar').classList.add('scrolled');
            } else {
                document.querySelector('.navbar').classList.remove('scrolled');
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

const sections = document.querySelectorAll('div[id], section[id], footer[id]');
sections.forEach(section => observer.observe(section));


const closingDate = new Date("2026-08-14T23:59:59").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = closingDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.querySelector(".countdown-container").innerHTML = "<h3>Mostra Conclusa!</h3>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
}

updateCountdown();

const countdownInterval = setInterval(updateCountdown, 1000);


function toggleWidget() {
    const widget = document.getElementById('contactWidget');
    widget.classList.toggle('active');
    
    const triggerText = widget.querySelector('.text');
    if (widget.classList.contains('active')) {
        triggerText.innerText = 'Chiudi';
    } else {
        triggerText.innerText = 'Contattaci';
    }
}