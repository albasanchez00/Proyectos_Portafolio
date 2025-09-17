import { addItem, getCart, subscribe, removeItem, updateQty, getTotals } from './cart.js';
import { money } from './format.js';

// Añadir al carrito (delegación)
const announcer = document.getElementById('cart-announcer');
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;
  const root = btn.closest('.product-card');
  const qtyInput = root?.querySelector('.product-card__qty');
  const qty = qtyInput ? Number(qtyInput.value) || 1 : 1;

  addItem({
    id: btn.dataset.id,
    name: btn.dataset.name,
    price: btn.dataset.price,
    image: btn.dataset.image,
    url: btn.dataset.url,
    qty
  });
  if (announcer) announcer.textContent = `${btn.dataset.name} añadido al carrito. Cantidad: ${qty}.`;
});

// Mini contador/total en header
const miniCount = document.getElementById('mini-cart-count');
const miniTotal = document.getElementById('mini-cart-total');
function renderMini() {
  const cart = getCart();
  const count = cart.items.reduce((a,i)=>a+i.qty,0);
  const total = cart.items.reduce((a,i)=>a+i.qty*i.price,0);
  if (miniCount) miniCount.textContent = String(count);
  if (miniTotal) miniTotal.textContent = money(total);
}
renderMini();
subscribe(renderMini);

// Montar tabla del carrito (para carrito.html)
export function mountCartTable(){
  const tbody = document.querySelector('#cart-table-body');
  const totalsBox = document.querySelector('#cart-totals');
  if (!tbody || !totalsBox) return;

  const row = (it) => `
    <tr>
      <td><img src="${it.image}" alt="" width="48" height="48"> ${it.name}</td>
      <td>${money(it.price)}</td>
      <td><input type="number" min="1" class="cart-qty" data-id="${it.id}" value="${it.qty}" aria-label="Cantidad de ${it.name}"></td>
      <td>${money(it.price * it.qty)}</td>
      <td><button class="btn btn--link remove-item" data-id="${it.id}" aria-label="Quitar ${it.name}">✕</button></td>
    </tr>`;

  function render(){
    const cart = getCart();
    tbody.innerHTML = cart.items.length ? cart.items.map(row).join('') : `<tr><td colspan="5">Tu carrito está vacío.</td></tr>`;
    const t = getTotals();
    totalsBox.innerHTML = `
      <p>Subtotal: <strong>${money(t.subtotal)}</strong></p>
      <p>Envío: <strong>${t.envio === 0 ? 'Gratis' : money(t.envio)}</strong></p>
      <p>Impuestos (10%): <strong>${money(t.impuestos)}</strong></p>
      <p class="totals__grand">Total: <strong>${money(t.total)}</strong></p>
      <a href="./checkout.html" class="btn btn--primary"${getCart().items.length ? '' : ' aria-disabled="true"'}>Finalizar compra</a>
    `;
  }

  document.addEventListener('input', (e) => {
    const input = e.target.closest('.cart-qty');
    if (!input) return;
    updateQty(input.dataset.id, input.value);
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-item');
    if (!btn) return;
    removeItem(btn.dataset.id);
  });

  render(); subscribe(render);
}
