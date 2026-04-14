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

    const hamburger = document.querySelector(".hamburger");
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

// Gallery

const gallery = document.querySelector('.hero-gallery');

if (gallery) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.70
    });

    observer.observe(gallery);
}

// Booklet

const booklet = document.querySelector('.booklet img');

if (booklet) {
    const bookletObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            } else {
                entry.target.classList.remove('fade-in-visible');
            }
        });
    }, {
        threshold: 0.2
    });

    bookletObserver.observe(booklet);
}

// Interview

function toggleAllInterviews(btn) {
    const container = document.getElementById('interviews-container');
    
    if (container.style.display === "none") {
        container.style.display = "block";
        btn.textContent = "Read Less";
    } else {
        container.style.display = "none";
        btn.textContent = "Read More";
    }
}