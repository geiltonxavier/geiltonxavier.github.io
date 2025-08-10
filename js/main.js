// Main JavaScript for Geilton Xavier Portfolio
// Author: Geilton Xavier
// Date: 2025-08-10


// Light/Dark theme toggle
const bgThemeToggle = document.getElementById('bgThemeToggle');
const heroSection = document.getElementById('home');

if (bgThemeToggle && heroSection) {
    bgThemeToggle.addEventListener('click', () => {
        const isDark = heroSection.classList.contains('bg-dark');
        heroSection.classList.remove('bg-image', 'bg-dark');
        if (isDark) {
            heroSection.classList.add('bg-image');
            bgThemeToggle.textContent = '🌙';
        } else {
            heroSection.classList.add('bg-dark');
            bgThemeToggle.textContent = '☀️';
        }
    });
}

// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const navbar = document.getElementById('navbar');
const hero = document.getElementById('home');


// SPA Routing using hash
function showSectionFromHash() {
    let hash = window.location.hash || '#home';
    let targetId = hash.replace('#', '');
    // Remove active class from all links and sections
    navLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    // Show target section or hero
    if (targetId === 'home' || !document.getElementById(targetId)) {
        hero.style.display = 'flex';
        document.querySelector('a[href="#home"]').classList.add('active');
    } else {
        hero.style.display = 'none';
        document.getElementById(targetId).classList.add('active');
        let nav = document.querySelector('a[href="#' + targetId + '"]');
        if (nav) nav.classList.add('active');
    }
}

// Listen to hash changes
window.addEventListener('hashchange', showSectionFromHash);
// On page load
document.addEventListener('DOMContentLoaded', showSectionFromHash);

// Handle navigation clicks (update hash)
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        window.location.hash = targetId;
    });
});

// Handle CTA button click
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#about';
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize - show home section and set default background
hero.style.display = 'flex';
heroSection.classList.remove('bg-svg', 'bg-gradient', 'bg-css', 'bg-dark');
heroSection.classList.add('bg-image');
if (bgThemeToggle) bgThemeToggle.textContent = '🌙';
