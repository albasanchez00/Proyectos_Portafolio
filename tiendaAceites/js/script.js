document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-links');
  const links = menu.querySelectorAll('a[href]');
  const backdrop = document.getElementById('nav-backdrop');

  if (!toggle || !menu) return;

  const mqDesktop = window.matchMedia('(min-width: 769px)');
  let lastFocused = null;

  function openMenu() {
    document.body.classList.add('nav-open');
    toggle.classList.add('active');
    menu.classList.add('show');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    backdrop.hidden = false;

    lastFocused = document.activeElement;
    // focus en el primer link
    const firstLink = links[0];
    if (firstLink) firstLink.focus();

    // activar focus trap
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onDocClick, true);
  }

  function closeMenu() {
    document.body.classList.remove('nav-open');
    toggle.classList.remove('active');
    menu.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    backdrop.hidden = true;

    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('click', onDocClick, true);

    if (lastFocused) toggle.focus();
  }

  function toggleMenu() {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  }

  function onKeyDown(e) {
    // Cerrar con ESC
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }

    // Focus trap (Tab/Shift+Tab)
    if (e.key === 'Tab' && menu.classList.contains('show')) {
      const focusables = Array.from(menu.querySelectorAll('a[href], button:not([disabled])'))
        .filter(el => el.offsetParent !== null);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  }

  function onDocClick(e) {
    const clickInsideMenu = menu.contains(e.target);
    const clickOnToggle = toggle.contains(e.target);
    if (!clickInsideMenu && !clickOnToggle) {
      closeMenu();
    }
  }

  // Click hamburguesa / Enter / Space
  toggle.addEventListener('click', toggleMenu);
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
  });

  // Cerrar al pulsar un enlace del menú
  links.forEach(a => a.addEventListener('click', () => closeMenu()));

  // Cerrar al pasar a escritorio
  mqDesktop.addEventListener('change', (e) => {
    if (e.matches) closeMenu();
  });

  // Backdrop clickable
  if (backdrop) backdrop.addEventListener('click', closeMenu);
});


