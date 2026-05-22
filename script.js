const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const revealTargets = document.querySelectorAll('.reveal');
const contactForm = document.getElementById('contact-form');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateNavbarState() {
    if (window.scrollY > 12) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function updateActiveLink() {
    let activeSection = '';

    document.querySelectorAll('section[id]').forEach((section) => {
        const sectionTop = section.offsetTop - 180;
        if (window.scrollY >= sectionTop) {
            activeSection = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${activeSection}`);
    });
}

function revealElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -80px 0px'
    });

    revealTargets.forEach((target) => observer.observe(target));
}

function setupMobileNav() {
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

function setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetSelector = anchor.getAttribute('href');
            if (!targetSelector || targetSelector === '#') return;

            const target = document.querySelector(targetSelector);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-circle-check"></i><span>${message}</span>`;
    document.body.appendChild(notification);

    window.setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-6px)';
        notification.style.transition = 'opacity 220ms ease, transform 220ms ease';
    }, 2200);

    window.setTimeout(() => {
        notification.remove();
    }, 2600);
}

function setupContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('.btn-submit');
        if (!submitButton) return;

        const originalContent = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

        window.setTimeout(() => {
            submitButton.innerHTML = '<span>Sent</span><i class="fas fa-check"></i>';
            showNotification('Message sent successfully. I will reply soon.');

            window.setTimeout(() => {
                submitButton.innerHTML = originalContent;
                submitButton.disabled = false;
                contactForm.reset();
            }, 1400);
        }, 900);
    });
}

function setupHeroParallax() {
    if (prefersReducedMotion) return;

    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;

        window.requestAnimationFrame(() => {
            const translateY = Math.min(window.scrollY * 0.06, 24);
            heroVisual.style.transform = `translateY(${translateY}px)`;
            ticking = false;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbarState();
    updateActiveLink();
    revealElements();
    setupMobileNav();
    setupSmoothAnchors();
    setupContactForm();
    setupHeroParallax();
});

window.addEventListener('scroll', () => {
    updateNavbarState();
    updateActiveLink();
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});