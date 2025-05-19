// Cuando la página se cargue este será el primer evento qeu se emepzará a ejecutar.
window.onload = () => {
    let form = document.querySelector("#registroForm");
    
 
    form.email.addEventListener("input", validarEmail);
    form.password.addEventListener("input", validarPassword);
    form.reset.addEventListener("click", () => {
        inputs = document.querySelectorAll("input"); //Es un Array de todos los inputs del HTML.
        inputs.forEach(element => {
            element.classList.remove("errorInput");
            element.classList.remove("validoInput");
        });
        let mensajeError = document.querySelectorAll(".msn");
        mensajeError.forEach(mensaje => {
            mensaje.textContent = "";
        })
    });
}


// Creámos una función donde validamos el formulario.
function validarFormulario() {
    if (validarEmail()) {
        return true;
    } else {
        return false;
    }
}

// Creamos las funciones con las que validaremos los datos ingresados.
function validarEmail() {
    let email = document.querySelector("#email");
    let msnError = document.querySelector(".emailError");

    if (!email.value.trim()) { //Si está vacío....
        email.classList.add("errorInput");
        email.classList.remove("validoInput");
        msnError.textContent = "La email es obligatorio";
        return false;
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email.value)) {
        email.classList.add("errorInput");
        email.classList.remove("validoInput");
        msnError.textContent = "El formato del email es erroneo";
        return false;
    } else {
        email.classList.add("validoInput");
        email.classList.remove("errorInput");
        msnError.textContent = "";
        return true;
    }
}

function validarPassword() {
    let password1 = document.querySelector("#password");
    let msnError = document.querySelector(".passwordError");

    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password.value)) {
        password.classList.add("errorInput");
        password.classList.remove("validoInput");
        msnError.textContent = "El password debe contener 8 carácteres: al menos 1 mayúscula, 1 minúscula y 1 número";
        return false;
    } else {
        password.classList.add("validoInput");
        password.classList.remove("errorInput");
        msnError.textContent = "";
        return true;
    } 
}