// filmoteca.js actualizado con persistencia de estado 'visto' y manejo robusto de imágenes

const catalogo = [
  {
    image: "./media/The-Shawshank-Redemption.jpg",
    nombre: "The Shawshank Redemption",
    descripcion: "Un banquero es condenado injustamente por el asesinato de su esposa y encuentra la esperanza y la redención dentro de los muros de la prisión de Shawshank.",
    genero: ["Drama", "Crimen"],
    anioEstreno: 1994
  },
  {
    image: "./media/Inception.jpg",
    nombre: "Inception",
    descripcion: "Un ladrón especializado en robar secretos a través de los sueños debe realizar la tarea inversa: implantar una idea en la mente de su objetivo.",
    genero: ["Ciencia ficción", "Thriller"],
    anioEstreno: 2010
  },
  {
    image: "./media/Parasite.jpg",
    nombre: "Parasite (Gisaengchung)",
    descripcion: "Una familia pobre se infiltra progresivamente en la vida de una adinerada, desatando una oscura serie de eventos.",
    genero: ["Drama", "Thriller", "Sátira social"],
    anioEstreno: 2019
  },
  {
    image: "./media/The-Grand-Budapest-Hotel.jpg",
    nombre: "The Grand Budapest Hotel",
    descripcion: "Un excéntrico conserje y su joven protegido se ven envueltos en un robo de arte, una batalla por una herencia y el caos de la Europa de entreguerras.",
    genero: ["Comedia", "Aventura", "Crimen"],
    anioEstreno: 2014
  },
  {
    image: "./media/Coco.jpg",
    nombre: "Coco",
    descripcion: "Un niño mexicano llamado Miguel viaja al mundo de los muertos para descubrir la historia de su familia y cumplir su sueño de ser músico.",
    genero: ["Animación", "Aventura", "Familiar"],
    anioEstreno: 2017
  },
  {
    image: "./media/Whiplash.jpg",
    nombre: "Whiplash",
    descripcion: "Un joven baterista ambicioso se enfrenta al despiadado y exigente maestro de su conservatorio, llevando su talento y resistencia al límite en busca de la perfección.",
    genero: ["Drama", "Musica"],
    anioEstreno: 2017
  }
];

if (!localStorage.getItem("catalogo")) {
  localStorage.setItem("catalogo", JSON.stringify(catalogo));
}

const contenedor = document.getElementById("peliculas-container");
const miListaButton = document.getElementById("mi-lista");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");

function getPeliculasVistas() {
  return JSON.parse(localStorage.getItem('peliculasVistas')) || {};
}

function setPeliculasVistas(vistas) {
  localStorage.setItem('peliculasVistas', JSON.stringify(vistas));
}

function mostrarPeliculas(peliculas) {
  contenedor.innerHTML = "";
  const vistas = getPeliculasVistas();

  peliculas.forEach(pelicula => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "pelicula-card";

    if (vistas[pelicula.nombre]) {
      tarjeta.classList.add('visto');
    }

    tarjeta.innerHTML = `
      <img src="${pelicula.image}" alt="${pelicula.nombre}">
      <h2>${pelicula.nombre}</h2>
      <p>${pelicula.descripcion}</p>
      <p><strong>Géneros:</strong> ${pelicula.genero.join(", ")}</p>
      <p><strong>Año de estreno:</strong> ${pelicula.anioEstreno}</p>
      <button class="btn-reproducir"><img src="./media/icon-play-circle.svg">Reproducir</button>
      <button class="btn-agregar"><img src="./media/icon-add.svg">Agregar a mi lista</button>
    `;

    contenedor.appendChild(tarjeta);

    tarjeta.querySelector(".btn-reproducir").addEventListener("click", () => {
      alert(`Reproduciendo: ${pelicula.nombre}`);
    });
    tarjeta.querySelector(".btn-agregar").addEventListener("click", () => {
      agregarAMiLista(pelicula);
    });
  });
  miListaButton.style.display = peliculas.length > 0 ? 'block' : 'none';
}

function agregarAMiLista(pelicula) {
  let miLista = JSON.parse(localStorage.getItem('miLista')) || [];
  const vistas = getPeliculasVistas();

  if (miLista.some(p => p.nombre === pelicula.nombre)) {
    alert("Esta película ya está en tu lista.");
    return;
  }

  const peliculaParaAgregar = { ...pelicula, visto: !!vistas[pelicula.nombre] };

  miLista.push(peliculaParaAgregar);
  localStorage.setItem('miLista', JSON.stringify(miLista));
  alert("Película agregada a tu lista.");
}

function mostrarMiLista() {
  const miLista = JSON.parse(localStorage.getItem('miLista')) || [];
  contenedor.innerHTML = '';

  if (miLista.length === 0) {
    const mensaje = document.createElement('p');
    mensaje.textContent = "Tu lista está vacía.";
    mensaje.style.textAlign = 'center';
    contenedor.appendChild(mensaje);
    return;
  }

  miLista.forEach(pelicula => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "pelicula-card";
    const visto = pelicula.visto === true;

    if (visto) tarjeta.classList.add('visto');

    tarjeta.innerHTML = `
      <img src="${pelicula.image}" alt="${pelicula.nombre}">
      <h2>${pelicula.nombre}</h2>
      <p>${pelicula.descripcion}</p>
      <p><strong>Géneros:</strong> ${pelicula.genero.join(", ")}</p>
      <p><strong>Año de estreno:</strong> ${pelicula.anioEstreno}</p>
      <button class="btn-reproducir"><img src="./media/icon-play-circle.svg">Reproducir</button>
      <button class="btn-eliminar"><img src="./media/icon-cancel.svg">Eliminar de mi lista</button>
      <button class="btn-visto">${visto ? '<img src="./media/icon-visibility-off.svg">Desmarcar como visto' : '<img src="./media/icon-visibility.svg">Marcar como visto'}</button>
    `;

    contenedor.appendChild(tarjeta);

    tarjeta.querySelector(".btn-reproducir").addEventListener("click", () => {
      alert(`Reproduciendo: ${pelicula.nombre}`);
    });
    tarjeta.querySelector(".btn-eliminar").addEventListener("click", () => {
      eliminarDeMiLista(pelicula);
    });
    tarjeta.querySelector(".btn-visto").addEventListener("click", () => {
      alternarVisto(pelicula);
    });
  });
}

function eliminarDeMiLista(pelicula) {
  let miLista = JSON.parse(localStorage.getItem('miLista')) || [];
  miLista = miLista.filter(p => p.nombre !== pelicula.nombre);
  localStorage.setItem('miLista', JSON.stringify(miLista));
  alert("Película eliminada de tu lista.");
  mostrarMiLista();
}

function alternarVisto(pelicula) {
  let miLista = JSON.parse(localStorage.getItem('miLista')) || [];
  const index = miLista.findIndex(p => p.nombre === pelicula.nombre);
  if (index !== -1) {
    miLista[index].visto = !miLista[index].visto;
    localStorage.setItem('miLista', JSON.stringify(miLista));

    const vistas = getPeliculasVistas();
    if (miLista[index].visto) {
      vistas[pelicula.nombre] = true;
    } else {
      delete vistas[pelicula.nombre];
    }
    setPeliculasVistas(vistas);

    mostrarMiLista();
  } else {
    alert("Esta película no está en tu lista.");
  }
}

function buscarPeliculas() {
  const query = searchInput.value.toLowerCase();
  const peliculas = JSON.parse(localStorage.getItem('catalogo')) || [];
  const resultados = peliculas.filter(pelicula =>
    pelicula.nombre.toLowerCase().includes(query) ||
    pelicula.descripcion.toLowerCase().includes(query)
  );
  mostrarPeliculas(resultados);
}

miListaButton.addEventListener('click', mostrarMiLista);
searchButton.addEventListener('click', buscarPeliculas);
document.getElementById("btn-login").addEventListener("click", function () {
  alert("Inicio de sesión exitoso.");
});

document.addEventListener("DOMContentLoaded", () => {
  const catalogoGuardado = JSON.parse(localStorage.getItem('catalogo'));
  if (catalogoGuardado) {
    mostrarPeliculas(catalogoGuardado);
  }
});
