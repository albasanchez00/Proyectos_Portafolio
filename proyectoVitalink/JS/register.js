document.getElementById("form-registro").addEventListener("submit", function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const datos = {
    nombre: formData.get("nombre"),
    apellidos: formData.get("apellidos"),
    nacimiento: formData.get("nacimiento"), // ISO string o yyyy-MM-dd
    tipo_documento: formData.get("tipo_documento"),
    numero_identificacion: formData.get("numero_identificacion"),
    telefono: formData.get("telefono"),
    numero_tarjeta_sanitaria: formData.get("numero_tarjeta_sanitaria"),
    genero: formData.get("genero"),
    contrasenia: formData.get("contrasenia"),
    correo_electronico: formData.get("correo_electronico"),
    direccion: formData.get("direccion"),
    ciudad_id: formData.get("ciudad_id")
  };

  fetch("http://localhost:8080/api/registro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  })
  .then(res => res.text())
  .then(respuesta => {
    alert("Respuesta del servidor: " + respuesta);
  })
  .catch(error => {
    console.error("Error al registrar:", error);
    alert("Hubo un error al registrar el usuario.");
  });
});