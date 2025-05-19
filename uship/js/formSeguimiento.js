// // 3. Creamos el seguimiento, comenzando por USP seguido de {7 digitos}.
function validarSeguimiento() {
    const idSeg = document.getElementById('idSeg').value;
    // Expresión regular para validar el formato USP seguido de 7 dígitos
    const usp = /^USP\d{7}$/;
    if (usp.test(idSeg)) {
        document.getElementById('resultado').textContent = 'Número de seguimiento válido';
    } else {
        document.getElementById('resultado').textContent = 'Número de seguimiento inválido.Debe comenzar por USP seguido de 7 dígitos.';
    }
}