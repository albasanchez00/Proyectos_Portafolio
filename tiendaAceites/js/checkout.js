// /js/checkout.js
import { getCart, getTotals, clear } from './cart.js';
import { money } from './format.js';
import { showOrderToast } from '../js/order-toast.js'; // <-- importa el toast

const ul = document.getElementById('summary-items');
const totalsBox = document.getElementById('summary-totals');
const form = document.getElementById('checkout-form');
const err = document.getElementById('checkout-error');

function renderSummary() {
  const { items } = getCart();
  ul.innerHTML = items.length
    ? items.map(it => `
        <li>
          <img src="${it.image}" alt="">
          <span>${it.name} × ${it.qty}</span>
          <strong>${money(it.qty * it.price)}</strong>
        </li>`).join('')
    : `<li>Tu carrito está vacío.</li>`;

  const t = getTotals();
  totalsBox.innerHTML = `
    <p>Subtotal: <strong>${money(t.subtotal)}</strong></p>
    <p>Envío: <strong>${t.envio === 0 ? 'Gratis' : money(t.envio)}</strong></p>
    <p>Impuestos (10%): <strong>${money(t.impuestos)}</strong></p>
    <p class="totals__grand">Total: <strong>${money(t.total)}</strong></p>`;
}
renderSummary();

// Sanitiza CP y teléfono (UX)
const zip = form.querySelector('input[name="zip"]');
if (zip) zip.addEventListener('input', () => { zip.value = zip.value.replace(/\D/g, '').slice(0,5); });

const phone = form.querySelector('input[name="phone"]');
if (phone) phone.addEventListener('input', () => { phone.value = phone.value.replace(/[^\d\s+()-]/g, ''); });

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  err.textContent = '';

  const { items } = getCart();
  if (!items.length) {
    err.textContent = 'Tu carrito está vacío.';
    return;
  }

  // Validación nativa del navegador
  if (!form.reportValidity()) {
    err.textContent = 'Revisa los campos marcados.';
    return;
  }

  const order = {
    customer: Object.fromEntries(new FormData(form).entries()),
    cart: items,
    totals: getTotals(),
    createdAt: new Date().toISOString(),
    source: 'web'
  };

  try {
    // TODO: enviar al backend cuando lo tengas listo.
    // const res = await fetch('/api/orders', { ... });
    // if (!res.ok) throw new Error('No se pudo crear el pedido');

    console.log('Pedido simulado:', order);

    // Limpia carrito y muestra el toast de agradecimiento (cuenta atrás + redirección)
    clear();
    renderSummary(); // refresca la UI debajo del overlay
    showOrderToast({ seconds: 3, redirect: '../index.html' });
  } catch (e) {
    err.textContent = 'Hubo un problema al procesar tu pedido. Inténtalo de nuevo.';
  }
});
