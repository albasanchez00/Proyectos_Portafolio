document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-recordatorio");
  const lista = document.getElementById("recordatorios-activos");

  let recordatorios = [];

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const descripcion = document.getElementById("descripcion").value;

    const nuevo = {
      id: crypto.randomUUID(), // identificador único
      titulo,
      fecha,
      hora,
      descripcion
    };

    recordatorios.push(nuevo);
    renderizarRecordatorios();
    form.reset();
  });

  function renderizarRecordatorios() {
    if (recordatorios.length === 0) {
      lista.innerHTML = "<p>No hay recordatorios aún.</p>";
      return;
    }

    lista.innerHTML = "";
    recordatorios.forEach((rec) => {
      const card = document.createElement("div");
      card.className = "recordatorio-card";
      card.innerHTML = `
        <h3>${rec.titulo}</h3>
        <p><strong>📅 Fecha:</strong> ${rec.fecha}</p>
        <p><strong>⏰ Hora:</strong> ${rec.hora}</p>
        <p><strong>📝 Descripción:</strong> ${rec.descripcion}</p>
      `;
      lista.appendChild(card);
    });
  }
});
