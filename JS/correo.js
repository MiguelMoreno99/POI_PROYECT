document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const sendBtn = document.getElementById('sendBtn');

    // Expresión regular para validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    emailInput.addEventListener('input', function () {
        validarCorreo();
    });
    subjectInput.addEventListener('input', function () {
        ValidarAsunto();
    });
    messageInput.addEventListener('input', function () {
        ValidarMensaje();
    });

    //Funciones para validar los campos
    function validarCorreo() {
        let isValid = true;
        if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Correo electrónico no válido.');
            isValid = false;
        } else {
            clearError(emailInput);
        }
        return isValid;
    }
    function ValidarAsunto() {
        let isValid = true;
        if (subjectInput.value.trim() === '') {
            showError(subjectInput, 'Ingrese un asunto primero.');
            isValid = false;
        } else {
            clearError(subjectInput);
        }
        return isValid;
    }
    function ValidarMensaje() {
        let isValid = true;
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Ingrese un mensaje primero.');
            isValid = false;
        } else {
            clearError(messageInput);
        }
        return isValid;
    }
    function validarFormulario() {
        if (validarCorreo() && ValidarAsunto()&& ValidarMensaje()) {
            return true;
        } else {
            return false;
        }
    }

    // Manejar el envío del formulario
    sendBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (validarFormulario()) {
            alert("Envio de correo exitoso!");
            window.location.href = "correo.html";
        } else {
            alert("Por favor, corrige los errores antes de enviar.");
            return false; // Evita el envío si hay errores
        }
    });
});