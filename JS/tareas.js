// Seleccionar todos los campos
const tituloTareaInput = document.getElementById('tituloTareaInput');
const instruccionesTareaInput = document.getElementById('instruccionesTareaInput');
const FechaTareaInput = document.getElementById('FechaTareaInput');
const crear_tareaBtn = document.getElementById('crear_tareaBtn');

// Función para mostrar errores
function showError(input, message) {
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        input.classList.add('invalid');
    }
}
// Función para limpiar errores
function clearError(input) {
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        input.classList.remove('invalid');
    }
}

// Escuchar cambios en los campos
tituloTareaInput.addEventListener('input', function () {
    validarTitulo();
});
instruccionesTareaInput.addEventListener('input', function () {
    validarInstrucciones();
});
FechaTareaInput.addEventListener('input', function () {
    validarFecha();
});

//Funciones para validar los campos
function validarTitulo() {
    let isValid = true;
    if (tituloTareaInput.value.trim() === '') {
        showError(tituloTareaInput, 'El Titulo de la tarea es obligatorio.');
        isValid = false;
    }
    else {
        clearError(tituloTareaInput);
    }
    return isValid;
}
function validarInstrucciones() {
    let isValid = true;
    if (instruccionesTareaInput.value.trim() === '') {
        showError(instruccionesTareaInput, 'Las instrucciones de la Tarea son obligatorias.');
        isValid = false;
    }
    else {
        clearError(instruccionesTareaInput);
    }
    return isValid;
}
function validarFecha() {
    let isValid = true;
    const fechaIngresada = new Date(FechaTareaInput.value);
    const fechaActual = new Date();

    // Ajustar la fecha actual para comparar solo la parte de la fecha (sin hora)
    fechaActual.setHours(0, 0, 0, 0);

    if (isNaN(fechaIngresada.getTime())) {
        showError(FechaTareaInput, 'Debe ingresar una fecha válida.');
        isValid = false;
    } else if (fechaIngresada <= fechaActual) {
        showError(FechaTareaInput, 'La fecha debe ser mayor a la fecha actual.');
        isValid = false;
    } else {
        clearError(FechaTareaInput);
    }

    return isValid;
}
function validarFormulario() {
    let isValid = true; // Se asume que todo está correcto

    if (!validarTitulo()) isValid = false;
    if (!validarInstrucciones()) isValid = false;
    if (!validarFecha()) isValid = false;

    return isValid; // Retorna false si hay al menos un error
}

// Manejar el envío del formulario
crear_tareaBtn.addEventListener('click', function (event) {
    event.preventDefault();
    if (validarFormulario()) {
        const name = document.getElementById('tituloTareaInput').value;
        const date = document.getElementById('FechaTareaInput').value;
        alert("¡TAREA CREADA CON EXITO! \n Nombre: " + name + " \n Fecha de entrega: " + date);
        closeModal();
        window.location.href = "tareas";
    } else {
        alert("Por favor, corrige los errores antes de enviar.");
        return false; // Evita el envío si hay errores
    }
});

function openModal() {
    document.getElementById('myModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}