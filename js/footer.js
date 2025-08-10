// Footer rendering logic for geiltonxavier.github.io
document.addEventListener('DOMContentLoaded', function() {
  fetch('footer.json')
    .then(response => response.json())
    .then(footer => {
      const container = document.getElementById('footerContainer');
      if (!container) return;
      let html = '';
      // Contact
      html += '<div class="footer-contact">';
      footer.contact.forEach(item => {
        html += `<span class="footer-contact-item">${item.icon} ${item.value}</span>`;
      });
      html += '</div>';
      // CV
      html += `<div class="footer-cv"><a href="${footer.cv.url}" class="footer-cv-link">${footer.cv.label}</a></div>`;
      // Social
      html += '<div class="footer-social">';
      footer.social.forEach(social => {
        // Usa <i> para fallback, mas também inclui <span> para forçar o SVG se FontAwesome 6 estiver disponível
        html += `<a href="${social.url}" class="footer-social-link" target="_blank" rel="noopener" title="${social.name}">
          <i class="${social.icon}" aria-hidden="true"></i>
          <span class="sr-only">${social.name}</span>
        </a>`;
      });
      html += '</div>';
      // Text
      html += `<div class="footer-text">${footer.text}</div>`;
      container.innerHTML = html;
      // Força o FontAwesome a reprocessar os ícones se disponível (SVG ou Webfonts)
      if (window.FontAwesome && window.FontAwesome.dom && window.FontAwesome.dom.i2svg) {
        window.FontAwesome.dom.i2svg();
      } else if (window.FontAwesome && window.FontAwesome.library && window.FontAwesome.library.dom) {
        window.FontAwesome.library.dom.i2svg();
      }
    });
});
