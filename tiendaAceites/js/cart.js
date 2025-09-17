import { toNumber } from './format.js';

const STORAGE_KEY = 'shop.cart.v1';
let state = load();

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? { items: [] }; }
  catch { return { items: [] }; }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

const listeners = new Set();
function dispatch(){ for (const l of listeners) l(getCart()); }

function findIndex(id){ return state.items.findIndex(i => i.id === id); }

export function subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); }
export function getCart(){ return structuredClone(state); }
export function clear(){ state = { items: [] }; save(); dispatch(); }

export function addItem({ id, name, price, image, url, qty = 1 }) {
  qty = Math.max(1, Number(qty)||1);
  price = toNumber(price);
  const i = findIndex(id);
  if (i >= 0) state.items[i].qty += qty;
  else state.items.push({ id, name, price, image, url, qty });
  save(); dispatch();
}
export function updateQty(id, qty){
  qty = Math.max(1, Number(qty)||1);
  const i = findIndex(id);
  if (i >= 0){ state.items[i].qty = qty; save(); dispatch(); }
}
export function removeItem(id){
  state.items = state.items.filter(i => i.id !== id);
  save(); dispatch();
}
export function getTotals(){
  const subtotal = state.items.reduce((a,i)=>a+i.price*i.qty,0);
  const envio = subtotal >= 50 ? 0 : (state.items.length ? 4.90 : 0); // umbral envío gratis
  const impuestos = subtotal * 0.10; // ejemplo IVA 10% (ajusta)
  const total = subtotal + envio + impuestos;
  return { subtotal, envio, impuestos, total };
}
