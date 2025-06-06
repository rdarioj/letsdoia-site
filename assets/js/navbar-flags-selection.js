document.addEventListener('DOMContentLoaded', function() {
  var path = window.location.pathname;
  var flagLinks = document.querySelectorAll('.navbar-flags a, .navbar-flags-mobile a');

  flagLinks.forEach(function(link) {
    // Limpia cualquier resaltado previo
    link.style.boxShadow = '';
    link.style.transform = '';

    // Lógica para seleccionar solo la bandera correcta
    if (
      (path.includes('/en/') && link.getAttribute('href').includes('/en/index.html')) ||
      (path.includes('/it/') && link.getAttribute('href').includes('/it/index.html')) ||
      (
        // Español por defecto: ni /en/ ni /it/ en la ruta, y el link apunta a index.html en la raíz
        !path.includes('/en/') && !path.includes('/it/') &&
        (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === './index.html' || link.getAttribute('href') === '/index.html')
      )
    ) {
      link.style.boxShadow = '0 0 0 2px #2563eb';
      link.style.transform = 'scale(1.08)';
    }
  });
});