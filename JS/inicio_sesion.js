document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');

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
    passwordInput.addEventListener('input', function () {
        ValidarContrasenia();
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
    function ValidarContrasenia() {
        let isValid = true;
        if (passwordInput.value.trim() === '') {
            showError(passwordInput, 'Ingrese una contraseña primero.');
            isValid = false;
        } else {
            clearError(passwordInput);
        }
        return isValid;
    }
    function validarFormulario() {
        if (validarCorreo() && ValidarContrasenia()) {
            return true;
        } else {
            return false;
        }
    }

    // Manejar el envío del formulario
    loginBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (validarFormulario()) {
            alert("Inicio de Sesion Exitoso!");
            window.location.href = "grupos.html"; // Cambia "index.html" por tu página principal
        } else {
            alert("Por favor, corrige los errores antes de enviar.");
            return false; // Evita el envío si hay errores
        }
    });
});