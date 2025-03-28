document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const socket = io('http://localhost:2800'); // Conexión con el servidor mediante Socket.IO

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
        let isValid = true; // Se asume que todo está correcto

        if (!validarCorreo()) isValid = false;
        if (!ValidarContrasenia()) isValid = false;

        return isValid; // Retorna false si hay al menos un error
    }

    // Manejar el envío del formulario
    loginBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (validarFormulario()) {
            const correo = emailInput.value.trim(); // Obtener el correo ingresado
            const contrasenia = passwordInput.value.trim(); // Obtener la contraseña ingresada
            // Enviar los datos al servidor
            const loginData = { correo, contrasenia };
            socket.emit('iniciar_sesion', loginData);
        } else {
            alert("Por favor, corrige los errores antes de enviar.");
            return false; // Evita el envío si hay errores
        }
    });

    // Escuchar la respuesta del servidor después de iniciar sesión
    socket.on('sesion_respuesta', (respuesta) => {
        if (respuesta.success) {
            alert(respuesta.message); // Mostrar mensaje de éxito

            // Guardar el token, idUsuario y nombreUsuario en el localStorage
            localStorage.setItem('token', respuesta.token);
            localStorage.setItem('idUsuario', respuesta.usuario.id_usuario); // Guardar ID del usuario
            localStorage.setItem('nombreUsuario', respuesta.usuario.Nombre); // Guardar nombre del usuario

            window.location.href = "grupos"; // Redirigir al grupo principal
        } else {
            alert(respuesta.message); // Mostrar mensaje de error
        }
    });

    // Validar sesión al cargar la página
    const token = localStorage.getItem('token'); // Recuperar el token
    if (token) {
        socket.emit('validar_sesion', token); // Validar token en el servidor
    }

    // Manejar la respuesta de validación de sesión
    socket.on('validar_respuesta', (respuesta) => {
        if (!respuesta.success) {
            alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
            localStorage.removeItem('token'); // Eliminar token inválido
            localStorage.removeItem('idUsuario'); // Eliminar ID del usuario
            localStorage.removeItem('nombreUsuario'); // Eliminar nombre del usuario
            window.location.href = "inicio_sesion"; // Redirigir al inicio de sesión
        } else {
            console.log('Sesión activa para:', respuesta.usuario.Nombre); // Depuración
        }
    });
});