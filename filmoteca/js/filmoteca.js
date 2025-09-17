// === filmoteca.js — estilo Netflix/Prime corregido ===

// 1) Catálogo inicial (se guarda en localStorage solo si no existe)
const catalogo = [/* ...tu listado de películas... */];
if (!localStorage.getItem("catalogo")) {
  localStorage.setItem("catalogo", JSON.stringify(catalogo));
}

// 2) Utils de storage
const getCatalogo = () => JSON.parse(localStorage.getItem("catalogo")) || [];
const getMiLista  = () => JSON.parse(localStorage.getItem("miLista")) || [];
const setMiLista  = (lista) => localStorage.setItem("miLista", JSON.stringify(lista));
const getVistas   = () => JSON.parse(localStorage.getItem("peliculasVistas")) || {};
const setVistas   = (v) => localStorage.setItem("peliculasVistas", JSON.stringify(v));

// 3) Helpers UI
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}
function placeholderOnError(img) {
  img.onerror = null;
  img.src = "./media/placeholder-poster.svg";
  img.alt = "Póster no disponible";
}

// 4) Refs DOM
const contenedor   = document.getElementById("peliculas-container");
const miListaBtn   = document.getElementById("mi-lista");
const searchBtn    = document.getElementById("search-button");
const searchInput  = document.getElementById("search-input");

// 5) Agrupar por género
function agruparPorGenero(peliculas) {
  const map = new Map();
  peliculas.forEach(p => p.genero.forEach(g => {
    const key = g.trim();
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  }));
  return map;
}

// 6) Thumb
function crearThumb(pelicula, {enLista=false, visto=false}={}) {
  const el = document.createElement('article');
  el.className = 'thumb'; el.tabIndex = 0;

  if (visto) {
    const b = document.createElement('span');
    b.className = 'thumb__badge';
    b.textContent = 'Visto';
    el.appendChild(b);
  }

  el.innerHTML += `
    <img class="thumb__img" src="${pelicula.image}" alt="Póster de ${pelicula.nombre}" loading="lazy">
    <div class="thumb__overlay">
      <div class="thumb__title">${pelicula.nombre}</div>
      <div class="thumb__meta">${pelicula.anioEstreno} · ${pelicula.genero.join(' / ')}</div>
      <div class="thumb__actions">
        <button class="btn-mini btn-play" aria-label="Reproducir ${pelicula.nombre}">
          <img src="./media/icon-play-circle.svg" alt="" aria-hidden="true"> Reproducir
        </button>
        ${enLista ? `
          <button class="btn-mini btn-icon btn-visto" aria-label="${visto ? 'Desmarcar' : 'Marcar'} como visto — ${pelicula.nombre}">
            <img src="${visto ? './media/icon-visibility-off.svg' : './media/icon-visibility.svg'}" alt="" aria-hidden="true">
          </button>
          <button class="btn-mini btn-icon btn-eliminar" aria-label="Eliminar ${pelicula.nombre} de mi lista">
            <img src="./media/icon-cancel.svg" alt="" aria-hidden="true">
          </button>` : `
          <button class="btn-mini btn-icon btn-agregar" aria-label="Agregar ${pelicula.nombre} a mi lista">
            <img src="./media/icon-add.svg" alt="" aria-hidden="true">
          </button>`}
      </div>
    </div>
  `;

  // Eventos
  el.querySelector('.btn-play')?.addEventListener('click', () => showToast(`Reproduciendo: ${pelicula.nombre}`));
  if (enLista) {
    el.querySelector('.btn-eliminar')?.addEventListener('click', () => eliminarDeMiLista(pelicula));
    el.querySelector('.btn-visto')?.addEventListener('click', () => alternarVisto(pelicula));
  } else {
    el.querySelector('.btn-agregar')?.addEventListener('click', () => agregarAMiLista(pelicula));
  }

  // Fallback imagen
  const img = el.querySelector('.thumb__img');
  img.onerror = () => placeholderOnError(img);

  return el;
}

// 7) Rail
function crearRail(titulo, peliculas, opcionesPorNombre = {}) {
  const rail = document.createElement('section');
  rail.className = 'rail';
  rail.setAttribute('role', 'region');
  rail.setAttribute('aria-label', titulo);

  rail.innerHTML = `
    <div class="rail__header">
      <h3 class="rail__title">${titulo}</h3>
      <!-- dejamos el bloque por si quieres botones ahí en el futuro -->
      <div class="rail__controls" hidden>
        <button class="arrow-btn rail-prev" aria-label="Anterior">❮</button>
        <button class="arrow-btn rail-next" aria-label="Siguiente">❯</button>
      </div>
    </div>
    <div class="rail__track"></div>

    <!-- NUEVO: navegación flotante centrada verticalmente -->
    <div class="rail__nav" aria-hidden="true">
      <button class="arrow-btn rail-prev" aria-label="Anterior">❮</button>
      <button class="arrow-btn rail-next" aria-label="Siguiente">❯</button>
    </div>
  `;

  const track  = rail.querySelector('.rail__track');
  const vistas = getVistas();

  peliculas.forEach(p => {
    const opts = opcionesPorNombre[p.nombre] || { enLista:false, visto: !!vistas[p.nombre] };
    track.appendChild( crearThumb(p, opts) );
  });

  // Navegación
  const step = () => Math.min(Math.max(track.clientWidth * 0.85, 300), 800);
  const prevBtns = rail.querySelectorAll('.rail-prev');
  const nextBtns = rail.querySelectorAll('.rail-next');
  prevBtns.forEach(b => b.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' })));
  nextBtns.forEach(b => b.addEventListener('click', () => track.scrollBy({ left:  step(), behavior: 'smooth' })));

  // Scroll con rueda — solo si hay overflow y no estamos en extremos
  const wheelHandler = (e) => {
    const { deltaY, deltaX } = e;
    const canScrollX = track.scrollWidth > track.clientWidth + 1;
    if (!canScrollX) return;
    const mostlyY = Math.abs(deltaY) > Math.abs(deltaX);
    if (!mostlyY) return;

    const atStart = track.scrollLeft <= 0 && deltaY < 0;
    const atEnd   = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1 && deltaY > 0;
    if (atStart || atEnd) return;

    e.preventDefault();
    track.scrollBy({ left: deltaY, behavior: 'smooth' });
  };
  track.addEventListener('wheel', wheelHandler, { passive:false });

  // Mostrar/ocultar nav + degradados solo si hay overflow
  const updateScrollable = () => {
    const can = track.scrollWidth > track.clientWidth + 1;
    rail.classList.toggle('is-scrollable', can);
  };
  updateScrollable();
  new ResizeObserver(updateScrollable).observe(track);

  return rail;
}


// 8) Renders
function renderHomeRails() {
  if (!contenedor) return;
  contenedor.innerHTML = '';
  const pelis = getCatalogo();

  contenedor.appendChild(crearRail('Destacadas', pelis.slice(0, 6)));

  const map = agruparPorGenero(pelis);
  [...map.keys()].sort().forEach(g => contenedor.appendChild(crearRail(g, map.get(g))));
}
function renderMiListaRail() {
  if (!contenedor) return;
  contenedor.innerHTML = '';
  const lista = getMiLista();
  if (lista.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'Tu lista está vacía.';
    p.style.textAlign = 'center';
    contenedor.appendChild(p);
    return;
  }
  const opts = {};
  lista.forEach(p => opts[p.nombre] = { enLista:true, visto:p.visto === true });
  contenedor.appendChild(crearRail('Mi lista', lista, opts));
}
function renderResultados(query) {
  if (!contenedor) return;
  contenedor.innerHTML = '';
  const q = query.trim().toLowerCase();
  const res = getCatalogo().filter(p => 
    p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)
  );
  if (res.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No hay resultados.';
    p.style.textAlign = 'center';
    contenedor.appendChild(p);
    return;
  }
  contenedor.appendChild(crearRail(`Resultados: “${query}”`, res));
}

// 9) Lógica lista / visto
function agregarAMiLista(p) {
  const lista = getMiLista();
  const vistas = getVistas();
  if (lista.some(x => x.nombre === p.nombre)) return showToast("Ya está en tu lista.");
  setMiLista([...lista, { ...p, visto: !!vistas[p.nombre] }]);
  showToast("Película agregada a tu lista.");
}
function eliminarDeMiLista(p) {
  setMiLista(getMiLista().filter(x => x.nombre !== p.nombre));
  showToast("Película eliminada de tu lista.");
  renderMiListaRail();
}
function alternarVisto(p) {
  const lista = getMiLista();
  const i = lista.findIndex(x => x.nombre === p.nombre);
  if (i === -1) return showToast("No está en tu lista.");
  lista[i].visto = !lista[i].visto;
  setMiLista(lista);
  const vistas = getVistas();
  lista[i].visto ? vistas[p.nombre] = true : delete vistas[p.nombre];
  setVistas(vistas);
  renderMiListaRail();
}

// 10) Búsqueda y arranque
function buscarPeliculas() {
  const q = (searchInput?.value || '').trim();
  if (!q) return renderHomeRails();
  renderResultados(q.toLowerCase());
}
document.addEventListener('DOMContentLoaded', () => {
  renderHomeRails();
  miListaBtn?.addEventListener('click', renderMiListaRail);
  searchBtn?.addEventListener('click', buscarPeliculas);
  searchInput?.addEventListener('keydown', e => { if (e.key === 'Enter') buscarPeliculas(); });
});
