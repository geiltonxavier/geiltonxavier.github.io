// Render footer from footer.json (garante que o container existe)
document.addEventListener('DOMContentLoaded', function() {
  fetch('footer.json')
    .then(response => response.json())
    .then(footer => {
      const container = document.getElementById('footerContainer');
      if (!container) return;
      let html = '';
      // Contact info (if present)
      if (footer.contact && Array.isArray(footer.contact)) {
        html += '<div class="contact-info">';
        footer.contact.forEach(item => {
          html += `<div class="contact-item"><span>${item.icon || ''}</span><span>${item.value}</span></div>`;
        });
        html += '</div>';
      }
      // Download CV (if present)
      if (footer.cv) {
        html += `<a href="${footer.cv.url}" class="download-cv" target="_blank">${footer.cv.label || 'Download CV'}</a>`;
      }
      // Social links
      if (footer.social && Array.isArray(footer.social)) {
        html += '<div class="footer-social" style="margin:2rem 0;">';
        footer.social.forEach(social => {
          html += `<a href="${social.url}" class="footer-social-link" target="_blank" title="${social.name}" style="margin:0 10px;font-size:1.5rem;"><i class="${social.icon}"></i></a>`;
        });
        html += '</div>';
      }
      // Footer text
      if (footer.text) {
        html += `<p style="margin-top: 2rem; opacity: 0.8;">${footer.text}</p>`;
      }
      container.innerHTML = html;
    });
});
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

// Handle navigation clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
        // Show target section or hero
        if (targetId === 'home') {
            hero.style.display = 'flex';
        } else {
            hero.style.display = 'none';
            document.getElementById(targetId).classList.add('active');
        }
    });
});

// Handle CTA button click
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
        e.preventDefault();
        hero.style.display = 'none';
        document.getElementById('about').classList.add('active');
        // Update navigation
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('a[href="#about"]').classList.add('active');
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
