// Conectar con el servidor mediante WebSockets
const socket = io(SERVER_URL);

// Obtener ID del grupo y del usuario desde localStorage
const id_grupo = localStorage.getItem("grupoSeleccionado");
const id_usuario = localStorage.getItem("idUsuario");

// Seleccionar elementos de la página
const grupoNombre = document.getElementById("grupo-nombre");
const mensajesContainer = document.querySelector(".chat-messages");
const messageBox = document.getElementById("message-box");
const sendBtn = document.getElementById("send-btn");
const imagenBtn = document.getElementById("imagenes-btn");
const imagenInput = document.getElementById("imagen-input");
const imagenPreview = document.getElementById("imagen-preview");

console.log("📌 ID del usuario actual cargado:", id_usuario);

let cifradoActivado = false;
const claveSecreta = "clave_secreta_segura"; // Puedes mejorarla usando una clave por grupo o usuario

document.getElementById("cifrado-btn").addEventListener("click", () => {
    cifradoActivado = !cifradoActivado;
    const boton = document.getElementById("cifrado-btn");
    boton.innerText = cifradoActivado ? "Activado" : "Desactivado";
});


// Verificar si se obtuvo un ID de grupo
if (id_grupo) {
    console.log("📡 ID del grupo cargado desde localStorage:", id_grupo);
    socket.emit("obtener_nombre_grupo", { id_grupo });
    socket.emit("obtener_mensajes_grupo", { id_grupo }); // Cargar mensajes del grupo
} else {
    console.error("❌ Error: No se encontró el ID del grupo en localStorage.");
    grupoNombre.innerText = "Grupo Desconocido";
}

// Escuchar respuesta del servidor con el nombre del grupo
socket.on("nombre_grupo_respuesta", (data) => {
    if (data.success) {
        grupoNombre.innerText = data.nombre;
    } else {
        grupoNombre.innerText = "Grupo no encontrado";
    }
});

// Escuchar respuesta del servidor con los mensajes del grupo
socket.on("mensajes_grupo_respuesta", (data) => {
    if (data.success) {
        mensajesContainer.innerHTML = ""; // Limpiar mensajes previos

        data.mensajes.forEach(mensaje => {
            mostrarMensajeGrupo(
                mensaje.texto,
                mensaje.imagen_mensaje,
                mensaje.fecha_creacion,
                mensaje.Nombre,
                mensaje.Apellido_paterno
            );
        });
    } else {
        mensajesContainer.innerHTML = `<p>Error al obtener mensajes: ${data.message}</p>`;
    }
});

// Función para mostrar mensajes en el grupo con usuario y fecha
function mostrarMensajeGrupo(texto, imagen, fecha, nombre, apellido) {
    const div = document.createElement("div");
    div.classList.add("message");

    const usuarioInfo = document.createElement("label");
    usuarioInfo.textContent = `${nombre} ${apellido} (${new Date(fecha).toLocaleString()})`;
    usuarioInfo.classList.add("user");

    div.appendChild(usuarioInfo);

    if (texto) {
        try {
            const bytes = CryptoJS.AES.decrypt(texto, claveSecreta);
            const textoDescifrado = bytes.toString(CryptoJS.enc.Utf8);
            texto = textoDescifrado || texto; // Si no se puede descifrar, se muestra el original
        } catch (err) {
            console.warn("No se pudo descifrar el mensaje:", err);
        }

        const textoMensaje = document.createElement("p");
        textoMensaje.textContent = texto;
        div.appendChild(textoMensaje);
    }

    if (imagen && imagen !== "null") {
        const imgElement = document.createElement("img");
        imgElement.src = `${SERVER_URL}/${imagen}`;
        imgElement.alt = "Imagen enviada";
        imgElement.style.maxWidth = "200px";
        imgElement.style.marginTop = "10px";
        div.appendChild(imgElement);
    }

    mensajesContainer.appendChild(div);
    mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
}

// 🟠 Manejo de selección de imágenes y vista previa
imagenBtn.addEventListener("click", (event) => {
    event.preventDefault();
    imagenInput.click();
});

imagenInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagenPreview.src = e.target.result;
            imagenPreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// 🟠 Enviar mensaje con imagen al servidor
sendBtn.addEventListener("click", async () => {
    let texto = messageBox.value.trim();
    const imagenFile = imagenInput.files[0];

    if (!texto && !imagenFile) {
        alert("Debes escribir un mensaje o adjuntar una imagen.");
        return;
    }

    // 🔒 Cifrar el texto si el cifrado está activado
    if (cifradoActivado && texto) {
        texto = CryptoJS.AES.encrypt(texto, claveSecreta).toString();
    }

    const formData = new FormData();
    formData.append("texto", texto);
    formData.append("id_usuario", id_usuario);
    formData.append("id_grupo", id_grupo);
    formData.append("imagen_mensaje", imagenFile ? imagenFile : "null");

    fetch(`${SERVER_URL}/subir_imagen_mensaje`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            socket.emit("enviar_mensaje_grupo", {
                texto,
                id_usuario,
                id_grupo,
                imagen_mensaje: data.ruta !== "null" ? data.ruta : null
            });

            messageBox.value = "";
            imagenPreview.style.display = "none";
            imagenInput.value = "";
        } else {
            alert("❌ Error al enviar el mensaje: " + data.message);
        }
    })
    .catch(error => console.error("❌ Error en la petición:", error));
});


// 🟠 Recibir mensajes en tiempo real dentro del grupo
socket.on("nuevo_mensaje_grupo", (mensaje) => {
    mostrarMensajeGrupo(
        mensaje.texto,
        mensaje.imagen_mensaje,
        mensaje.fecha_creacion,
        mensaje.Nombre,
        mensaje.Apellido_paterno
    );
});

// 🟢 Cargar lista de usuarios al abrir las ventanas modales
socket.on("lista_usuarios", (data) => {
    const listaUsuarios = document.getElementById("lista-usuarios");

    if (data.success) {
        listaUsuarios.innerHTML = ""; // Limpiar lista previa

        data.usuarios.forEach(usuario => {
            const usuarioItem = document.createElement("li");
            usuarioItem.innerHTML = `
                <input type="checkbox" value="${usuario.id_usuario}">
                ${usuario.Nombre} ${usuario.Apellido_paterno} - ${usuario.correo_electronico}
            `;
            listaUsuarios.appendChild(usuarioItem);
        });
    } else {
        console.error("❌ No se pudieron obtener los usuarios.");
    }
});

// 🟢 Cargar lista de integrantes al eliminar
socket.on("lista_integrantes", (data) => {
    const listaEliminar = document.getElementById("lista-eliminar");

    if (data.success) {
        listaEliminar.innerHTML = ""; // Limpiar lista previa

        data.integrantes.forEach(usuario => {
            const usuarioItem = document.createElement("li");
            usuarioItem.innerHTML = `
                <input type="checkbox" value="${usuario.id_usuario}">
                ${usuario.Nombre} ${usuario.Apellido_paterno} - ${usuario.correo_electronico}
            `;
            listaEliminar.appendChild(usuarioItem);
        });
    } else {
        console.error("❌ No se pudieron obtener los integrantes.");
    }
});

// 🟢 Agregar usuarios seleccionados a la tabla `Usuario_Grupo` al presionar el botón "Agregar"
document.getElementById("agregar-btn").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#lista-usuarios input[type='checkbox']:checked");
    const usuariosSeleccionados = Array.from(checkboxes).map(checkbox => checkbox.value);

    console.log("📡 ID del grupo:", id_grupo);
    console.log("👥 Usuarios seleccionados:", usuariosSeleccionados);

    if (!id_grupo || usuariosSeleccionados.length === 0) {
        console.error("❌ No hay datos válidos para agregar.");
        alert("Por favor, selecciona al menos un usuario.");
        return;
    }

    socket.emit("Agregar_usuarios_grupo", { id_grupo, usuariosSeleccionados });

    socket.on("agregar_usuario_respuesta", (data) => {
        console.log("📡 Respuesta del servidor:", data);
        if (data.success) {
            alert("✅ Usuarios agregados exitosamente al grupo.");
            closeModal("Agregar");
        } else {
            alert("❌ Hubo un error al agregar usuarios.");
        }
    });
});

// 🟢 Eliminar usuarios seleccionados de la tabla `Usuario_Grupo` al presionar el botón "Eliminar"
document.getElementById("eliminar-btn").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#lista-eliminar input[type='checkbox']:checked");
    const usuariosSeleccionados = Array.from(checkboxes).map(checkbox => checkbox.value);

    console.log("📡 ID del grupo:", id_grupo);
    console.log("👥 Usuarios a eliminar:", usuariosSeleccionados);

    if (!id_grupo || usuariosSeleccionados.length === 0) {
        console.error("❌ No hay datos válidos para eliminar.");
        alert("Por favor, selecciona al menos un usuario.");
        return;
    }

    socket.emit("Eliminar_integrantes_grupo", { id_grupo, usuariosSeleccionados });

    socket.on("eliminar_usuario_respuesta", (data) => {
        console.log("📡 Respuesta del servidor:", data);
        if (data.success) {
            alert("✅ Usuarios eliminados exitosamente del grupo.");
            closeModal("Eliminar");
        } else {
            alert("❌ Hubo un error al eliminar usuarios.");
        }
    });
});

// 🟢 Abandonar grupo y eliminar al usuario de la tabla `Usuario_Grupo`
document.getElementById("salir-btn").addEventListener("click", () => {
    console.log("📡 ID del grupo:", id_grupo);
    console.log("👤 Usuario que abandona:", id_usuario);

    if (!id_grupo || !id_usuario) {
        console.error("❌ No hay datos válidos para abandonar.");
        alert("Hubo un error al procesar la solicitud.");
        return;
    }

    socket.emit("Abandonar_grupo", { id_grupo, id_usuario });

    socket.on("abandonar_respuesta", (data) => {
        console.log("📡 Respuesta del servidor:", data);
        if (data.success) {
            alert("✅ Has abandonado el grupo exitosamente.");
            window.location.href = "grupos"; // Redirigir a la pantalla de grupos
        } else {
            alert("❌ Hubo un error al abandonar el grupo.");
        }
    });
});