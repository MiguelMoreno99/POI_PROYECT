document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todos los campos
    const nombreInput = document.getElementById('nombre');
    const apellidoPaternoInput = document.getElementById('apellido_paterno');
    const apellidoMaternoInput = document.getElementById('apellido_materno');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const fotoInput = document.getElementById('foto');
    const profilePreview = document.getElementById('profilePreview');
    const registerBtn = document.getElementById('registerBtn');

    // Expresiones regulares para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Correo válido
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/; // Contraseña válida
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Solo letras y espacios

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
    nombreInput.addEventListener('input', function () {
        validarNombre();
    });
    apellidoPaternoInput.addEventListener('input', function () {
        validarApellidoPaterno();
    });
    apellidoMaternoInput.addEventListener('input', function () {
        validarApellidoMaterno();
    });
    emailInput.addEventListener('input', function () {
        validarCorreo();
    });
    passwordInput.addEventListener('input', function () {
        ValidarContrasenia();
        validarContraseniaIgual();
    });
    confirmPasswordInput.addEventListener('input', function () {
        validarContraseniaIgual();
    });
    fotoInput.addEventListener('change', function () {
        validarImagen();
    });

    //Funciones para validar los campos
    function validarNombre() {
        let isValid = true;
        if (nombreInput.value.trim() === '') {
            showError(nombreInput, 'El nombre es obligatorio.');
            isValid = false;
        } else if (!nombreRegex.test(nombreInput.value)) {
            showError(nombreInput, 'Solo se permiten letras y espacios.');
            isValid = false;
        }
        else {
            clearError(nombreInput);
        }
        return isValid;
    }
    function validarApellidoPaterno() {
        let isValid = true;
        if (apellidoPaternoInput.value.trim() === '') {
            showError(apellidoPaternoInput, 'El apellido paterno es obligatorio.');
            isValid = false;
        } else if (!nombreRegex.test(apellidoPaternoInput.value)) {
            showError(apellidoPaternoInput, 'Solo se permiten letras y espacios.');
            isValid = false;
        } else {
            clearError(apellidoPaternoInput);
        }
        return isValid;
    }
    function validarApellidoMaterno() {
        let isValid = true;
        if (apellidoMaternoInput.value.trim() === '') {
            showError(apellidoMaternoInput, 'El apellido materno es obligatorio.');
            isValid = false;
        } else if (!nombreRegex.test(apellidoMaternoInput.value)) {
            showError(apellidoMaternoInput, 'Solo se permiten letras y espacios.');
            isValid = false;
        } else {
            clearError(apellidoMaternoInput);
        }
        return isValid;
    }
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
        if (!passwordRegex.test(passwordInput.value)) {
            showError(
                passwordInput,
                'La contraseña debe tener al menos 8 caracteres, 1 número, 1 mayúscula, 1 minúscula y 1 carácter especial.'
            );
            isValid = false;
        } else {
            clearError(passwordInput);
        }
        return isValid;
    }
    function validarContraseniaIgual() {
        let isValid = true;
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'Las contraseñas no coinciden.');
            isValid = false;
        } else {
            clearError(confirmPasswordInput);
        }
        return isValid;
    }
    function validarImagen() {
        let isValid = true;
        if (!fotoInput.files || fotoInput.files.length === 0) {
            showError(fotoInput, 'Debes seleccionar una imagen.');
            isValid = false;
        } else {
            clearError(fotoInput);
        }
        return isValid;
    }
    function validarFormulario() {
        if (validarNombre() && validarApellidoPaterno() && validarApellidoMaterno() && validarCorreo() && ValidarContrasenia() && validarContraseniaIgual() && validarImagen()) {
            return true;
        } else {
            return false;
        }
    }

    // Previsualización de la imagen
    fotoInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Manejar el envío del formulario
    registerBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (validarFormulario()) {
            alert("Registro exitoso!");
            window.location.href = "inicio_sesion.html"; // Cambia "index.html" por tu página principal
        } else {
            alert("Por favor, corrige los errores antes de enviar.");
            return false; // Evita el envío si hay errores
        }
    });
});