// Conectar con el servidor mediante WebSockets
const socket = io(SERVER_URL);


// Obtener elementos del formulario
const nombreInput = document.getElementById("nombreGrupo");
const crear_grupoBtn = document.getElementById("crear_grupoBtn");

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

// Validar nombre del grupo
nombreInput.addEventListener("input", function () {
    validarNombre();
});

function validarNombre() {
    if (nombreInput.value.trim() === "") {
        showError(nombreInput, "El nombre del grupo es obligatorio.");
        return false;
    }
    clearError(nombreInput);
    return true;
}

function validarFormulario() {
    return validarNombre();
}

// Manejar la creación de grupos
crear_grupoBtn.addEventListener("click", function (event) {
    event.preventDefault();

    if (validarFormulario()) {
        const nombreGrupo = nombreInput.value.trim();
        const id_creador = localStorage.getItem("idUsuario");

        if (!id_creador) {
            alert("Error: No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.");
            window.location.href = "inicio_sesion";
            return;
        }

        console.log("📡 Enviando datos de nuevo grupo:", { nombre: nombreGrupo, id_creador });
        socket.emit("crear_grupo", { nombre: nombreGrupo, id_creador });
    } else {
        alert("Por favor, corrige los errores antes de enviar.");
    }
});

// Escuchar respuesta del servidor sobre la creación del grupo
socket.on("grupo_creado", (data) => {
    if (data.success) {
        alert(`✅ El grupo "${data.nombre}" se ha creado exitosamente.`);
        closeModal();
        socket.emit("obtener_grupos", { id_usuario: localStorage.getItem("idUsuario") });
    } else {
        alert("❌ Hubo un error al crear el grupo.");
    }
});

// Validar sesión del usuario y obtener grupos
document.addEventListener("DOMContentLoaded", function () {
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
            localStorage.setItem("idUsuario", respuesta.usuario.id_usuario);
            socket.emit("obtener_grupos", { id_usuario: respuesta.usuario.id_usuario });
        } else {
            alert("Tu sesión ya no es válida. Por favor, inicia sesión nuevamente.");
            localStorage.removeItem("token");
            window.location.href = "inicio_sesion";
        }
    });
});

// Mostrar los grupos del usuario con redirección a Grupo.php
socket.on("lista_grupos", (data) => {
    if (data.success) {
        const container = document.getElementById("teams-list");
        container.innerHTML = "";

        data.grupos.forEach(grupo => {
            const teamElement = document.createElement("div");
            teamElement.classList.add("team");
            teamElement.innerHTML = `
                <img src="IMG/Equipo2.png" alt="Icono">
                <p>${grupo.Nombre}</p>
            `;
            teamElement.onclick = () => {
                const id_usuario = localStorage.getItem("idUsuario");
                localStorage.setItem("grupoSeleccionado", grupo.id_grupo);
                localStorage.setItem("usuarioSeleccionado", id_usuario);

                console.log("📌 ID del grupo guardado:", grupo.id_grupo);
                console.log("👤 ID del usuario guardado:", id_usuario);

                window.location.href = "grupo";
            };
            container.appendChild(teamElement);
        });
    } else {
        console.log("No se pudieron obtener los grupos.");
    }
});

// Funciones para abrir y cerrar el modal de creación de grupos
function openModal() {
    document.getElementById("myModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}