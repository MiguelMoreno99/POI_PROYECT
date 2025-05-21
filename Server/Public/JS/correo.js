document.addEventListener("DOMContentLoaded", () => {
    const socket = io(SERVER_URL); // Conectar al servidor con Socket.IO
    const usuarioActualId = localStorage.getItem("idUsuario");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");
    const sendBtn = document.getElementById("sendBtn");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const token = localStorage.getItem("token");

    if (token) {
        socket.emit("validar_sesion", token);
    } else {
        alert("Sesión expirada. Por favor, inicia sesión.");
        window.location.href = "inicio_sesion";
    }

    socket.on("validar_respuesta", (respuesta) => {
        if (respuesta.success) {
            console.log("Sesión válida para el usuario:", respuesta.usuario.Nombre);
            socket.emit("obtener_grupos", { id_usuario: respuesta.usuario.id_usuario });
        } else {
            alert("Tu sesión ya no es válida. Por favor, inicia sesión nuevamente.");
            localStorage.removeItem("token");
            window.location.href = "inicio_sesion";
        }
    });

    if (!usuarioActualId) {
        alert("Error: No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.");
        window.location.href = "inicio_sesion";
        return;
    }

    console.log("✅ ID del usuario actual cargado:", usuarioActualId);

    // Función para mostrar errores
    function showError(input, message) {
        const errorMessage = input.parentNode.querySelector(".error-message");
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
            input.classList.add("invalid");
        }
    }

    // Función para limpiar errores
    function clearError(input) {
        const errorMessage = input.parentNode.querySelector(".error-message");
        if (errorMessage) {
            errorMessage.textContent = "";
            errorMessage.style.display = "none";
            input.classList.remove("invalid");
        }
    }

    // Validaciones individuales
    function validarCorreo() {
        let isValid = true;
        if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, "Correo electrónico no válido.");
            isValid = false;
        } else {
            clearError(emailInput);
        }
        return isValid;
    }

    function ValidarAsunto() {
        let isValid = true;
        if (subjectInput.value.trim() === "") {
            showError(subjectInput, "Ingrese un asunto primero.");
            isValid = false;
        } else {
            clearError(subjectInput);
        }
        return isValid;
    }

    function ValidarMensaje() {
        let isValid = true;
        if (messageInput.value.trim() === "") {
            showError(messageInput, "Ingrese un mensaje primero.");
            isValid = false;
        } else {
            clearError(messageInput);
        }
        return isValid;
    }

    function validarFormulario() {
        let isValid = true;
        if (!validarCorreo()) isValid = false;
        if (!ValidarAsunto()) isValid = false;
        if (!ValidarMensaje()) isValid = false;
        return isValid;
    }

    // Escuchar cambios en los campos
    emailInput.addEventListener("input", validarCorreo);
    subjectInput.addEventListener("input", ValidarAsunto);
    messageInput.addEventListener("input", ValidarMensaje);

    // Envío del formulario
    sendBtn.addEventListener("click", function (event) {
        event.preventDefault();

        console.log("➡️ Botón 'Enviar Correo' presionado");

        if (validarFormulario()) {
            console.log("✅ Validación exitosa, enviando datos al servidor");

            const datosCorreo = {
                remitenteId: usuarioActualId,
                destinatarioCorreo: emailInput.value.trim(),
                asunto: subjectInput.value.trim(),
                texto: messageInput.value.trim()
            };

            console.log("📩 Datos a enviar:", datosCorreo);

            socket.emit("enviar_correo", datosCorreo); // Emitimos al servidor
        } else {
            alert("Por favor, corrige los errores antes de enviar.");
        }
    });

    // Escuchar confirmación del servidor
    socket.on("correo_enviado", (respuesta) => {
        console.log("✅ Respuesta del servidor recibida:", respuesta);
        if (respuesta.success) {
            alert("Correo enviado correctamente.");
            window.location.href = "correo";
        } else {
            console.log("⚠️ La respuesta del servidor indica que hubo un problema.");
        }
    });

    // Escuchar error del servidor
    socket.on("correo_error", (respuesta) => {
        console.log("❌ Error recibido del servidor:", respuesta.message);
        alert("Error al enviar el correo: " + respuesta.message);
    });
});