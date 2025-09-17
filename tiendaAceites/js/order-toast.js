// /js/order-toast.js
export function showOrderToast({ seconds = 3, redirect = '../index.html' } = {}){
  const toast = document.getElementById('order-toast');
  const counter = document.getElementById('order-toast-count');

  if (!toast) return;
  let remaining = seconds;

  // Mostrar overlay
  toast.hidden = false;
  document.body.classList.add('nav-open'); // bloquea scroll si ya usas esta clase
  if (counter) counter.textContent = String(remaining);

  // Cuenta atrás + redirección
  const timer = setInterval(() => {
    remaining -= 1;
    if (counter) counter.textContent = String(Math.max(remaining, 0));
    if (remaining <= 0){
      clearInterval(timer);
      window.location.href = redirect;
    }
  }, 1000);

  // Por accesibilidad: enfocar CTA
  const cta = toast.querySelector('.order-toast__cta');
  if (cta) setTimeout(() => cta.focus(), 100);
}