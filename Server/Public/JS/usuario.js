document.addEventListener("DOMContentLoaded", () => {
    const socket = io(SERVER_URL); // Conectar al servidor con WebSockets
    const usuarioActualId = localStorage.getItem("idUsuario"); // Obtener el ID del usuario desde el almacenamiento local

    const token = localStorage.getItem("token");

    if (token) {
        socket.emit("validar_sesion", token);
    } else {
        alert("Sesión expirada. Por favor, inicia sesión.");
        window.location.href = "inicio_sesion";
    }

    socket.on("validar_respuesta", (respuesta) => {
        if (respuesta.success) {
            console.log("✅ Sesión válida para el usuario:", respuesta.usuario.Nombre);
            socket.emit("obtener_usuario", { id_usuario: respuesta.usuario.id_usuario });
        } else {
            alert("Tu sesión ya no es válida. Por favor, inicia sesión nuevamente.");
            localStorage.removeItem("token");
            window.location.href = "inicio_sesion";
        }
    });

    if (!usuarioActualId) {
        alert("Error: No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.");
        window.location.href = "inicio_sesion.php";
        return;
    }

    console.log("🔍 Solicitando datos del usuario con ID:", usuarioActualId);
    socket.emit("obtener_usuario", { id_usuario: usuarioActualId });

    // Escuchar respuesta del servidor con los datos del usuario y los logros
    socket.on("usuario_respuesta", (data) => {
        if (data.success) {
            console.log("✅ Datos del usuario recibidos:", data.usuario);
            console.log("🏆 Logros obtenidos:", data.logros);
            console.log(`🌟 Total de logros obtenidos: ${data.totalLogros}`);

            // ✅ Actualizar la información del usuario en la página
            document.getElementById("correoUsuario").innerText = data.usuario.correo_electronico;
            document.getElementById("nombre").value = data.usuario.Nombre;
            document.getElementById("apellido_paterno").value = data.usuario.Apellido_paterno;
            document.getElementById("apellido_materno").value = data.usuario.Apellido_materno;

            // ✅ Mostrar imagen de perfil
            const profileImage = document.getElementById("profilePreview");
            profileImage.src = data.usuario.imagen && data.usuario.imagen !== "" 
                ? `${SERVER_URL}/${data.usuario.imagen}` 
                : "IMG/perfil.webp";

            // ✅ Mostrar el número total de logros obtenidos en lugar de "4⭐"
            document.getElementById("totalLogros").innerText = `${data.totalLogros}⭐`;

            // ✅ Insertar los logros en la lista
            const logrosContainer = document.getElementById("listaLogros");
            logrosContainer.innerHTML = ""; // Limpiar lista

            if (data.logros.length > 0) {
                data.logros.forEach(logro => {
                    const listItem = document.createElement("li");
                    listItem.textContent = logro.Nombre;
                    logrosContainer.appendChild(listItem);
                });
                console.log("✅ Logros mostrados correctamente.");
            } else {
                logrosContainer.innerHTML = "<li>No hay logros obtenidos</li>";
            }
        } else {
            console.error("❌ Error al recibir datos del usuario:", data.message);
        }
    });

    // Manejo de validaciones y actualización de datos
    const nombreInput = document.getElementById("nombre");
    const apellidoPaternoInput = document.getElementById("apellido_paterno");
    const apellidoMaternoInput = document.getElementById("apellido_materno");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm_password");
    const guardar_cambiosBtn = document.getElementById("guardar_cambiosBtn");

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    function showError(input, message) {
        const errorMessage = input.parentNode.querySelector(".error-message");
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
            input.classList.add("invalid");
        }
    }

    function clearError(input) {
        const errorMessage = input.parentNode.querySelector(".error-message");
        if (errorMessage) {
            errorMessage.textContent = "";
            errorMessage.style.display = "none";
            input.classList.remove("invalid");
        }
    }

    function validarNombre() {
        if (nombreInput.value.trim() === "" || !nombreRegex.test(nombreInput.value)) {
            showError(nombreInput, "El nombre es obligatorio y solo puede contener letras y espacios.");
            return false;
        }
        clearError(nombreInput);
        return true;
    }

    function validarApellidoPaterno() {
        if (apellidoPaternoInput.value.trim() === "" || !nombreRegex.test(apellidoPaternoInput.value)) {
            showError(apellidoPaternoInput, "El apellido paterno es obligatorio y solo puede contener letras y espacios.");
            return false;
        }
        clearError(apellidoPaternoInput);
        return true;
    }

    function validarApellidoMaterno() {
        if (apellidoMaternoInput.value.trim() === "" || !nombreRegex.test(apellidoMaternoInput.value)) {
            showError(apellidoMaternoInput, "El apellido materno es obligatorio y solo puede contener letras y espacios.");
            return false;
        }
        clearError(apellidoMaternoInput);
        return true;
    }

    function validarContrasenia() {
        if (!passwordRegex.test(passwordInput.value)) {
            showError(passwordInput, "La contraseña debe tener al menos 8 caracteres, 1 número, 1 mayúscula, 1 minúscula y 1 carácter especial.");
            return false;
        }
        clearError(passwordInput);
        return true;
    }

    function validarContraseniaIgual() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, "Las contraseñas no coinciden.");
            return false;
        }
        clearError(confirmPasswordInput);
        return true;
    }

    function validarFormulario() {
        return validarNombre() && validarApellidoPaterno() && validarApellidoMaterno() && validarContrasenia() && validarContraseniaIgual();
    }

    // ✅ Guardar cambios y actualizar en la base de datos
    guardar_cambiosBtn.addEventListener("click", function (event) {
        event.preventDefault();

        if (validarFormulario()) {
            const datosActualizados = {
                id_usuario: usuarioActualId,
                Nombre: nombreInput.value.trim(),
                Apellido_paterno: apellidoPaternoInput.value.trim(),
                Apellido_materno: apellidoMaternoInput.value.trim(),
                contrasenia: passwordInput.value.trim()
            };

            console.log("📡 Enviando datos actualizados:", datosActualizados);
            socket.emit("actualizar_usuario", datosActualizados);
        } else {
            alert("Por favor, corrige los errores antes de actualizar.");
        }
    });

    // ✅ Escuchar respuesta del servidor
    socket.on("usuario_actualizado", (respuesta) => {
        if (respuesta.success) {
            alert("✅ Información actualizada correctamente.");
            window.location.reload();
        } else {
            alert("❌ Error al actualizar la información: " + respuesta.message);
        }
    });
});