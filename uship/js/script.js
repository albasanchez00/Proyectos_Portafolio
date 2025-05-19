// 1.Calcular Envío
// Creamos la tabla de las comunidades.
const comunidades = [
    "Andalucía", "Cataluña", "Madrid", "Valencia", "Galicia",
    "Castilla y León", "País Vasco", "Canarias", "Castilla-La Mancha",
    "Murcia", "Aragón", "Extremadura", "Asturias", "Baleares",
    "Cantabria", "Navarra", "La Rioja", "Ceuta", "Melilla"
];


// Función para llenar el select con las comunidades
function llenarSelect(id) {
    const select = document.getElementById(id);
    comunidades.forEach(comunidad => {
        const option = document.createElement('option');
        option.value = comunidad;
        option.textContent = comunidad;
        select.appendChild(option);
    });
}

// Llenar ambos selects al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    llenarSelect('origen');
    llenarSelect('destino');
});


function calcularEnvio() {
    // Obtener valores seleccionados
    const origen = document.getElementById('origen').value;
    const destino = document.getElementById('destino').value;
    const peso = parseFloat(document.getElementById('peso').value);

    // Validaciones
    if (!origen) {
        alert('Por favor, selecciona la comunidad de origen.');
        return;
    }
    if (!destino) {
        alert('Por favor, selecciona la comunidad de destino.');
        return;
    }
    if (isNaN(peso) || peso <= 0) {
        alert('Por favor, ingresa un peso válido para el paquete.');
        return;
    }

    // Calcular carburante
    let carburante = origen === destino ? 10 : 20;

    // Calcular costo
    let costo;
    if (peso < 5) {
        costo = 5;
    } else if (peso < 10) {
        costo = 10;
    } else if (peso < 15) {
        costo = 15;
    } else if (peso < 20) {
        costo = 20;
    } else {
        alert('Peso del paquete no válido. Debe ser menor a 20Kg.');
        return;
    }
    // Calcular envío
    let envio = carburante + costo;


    // Mostrar resultado
    document.getElementById('resultado').textContent = 'El costo del envío es: €' + envio;
}




// 2. Mostrar y Ocultar Img al hacer click botón.




