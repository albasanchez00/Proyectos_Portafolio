export const money = (n) => new Intl.NumberFormat('es-ES', {
  style: 'currency', currency: 'EUR'
}).format(n);

export const toNumber = (v) => Number.parseFloat(String(v).replace(',', '.')) || 0;
