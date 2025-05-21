document.addEventListener("DOMContentLoaded", function () {
    const socket = io(SERVER_URL);
    const usuariosList = document.querySelector(".chat-list");
    const mensajesContainer = document.querySelector(".chat-messages");
    const userInfoHeader = document.querySelector(".user-info h3");
    const estadoUsuario = document.querySelector(".estadoUsuario");
    const sendBtn = document.getElementById("send-btn");
    const messageBox = document.getElementById("message-box");
    const usuarioActualId = localStorage.getItem("idUsuario");
    const videollamadaBtn = document.getElementById("videollamada-btn");
    const cifradoBtn = document.getElementById("cifrado-btn");

    let estadoCifradoPorUsuario = {}; 

    videollamadaBtn.disabled = true;
    cifradoBtn.disabled = true;

    console.log("ID del usuario actual cargado:", usuarioActualId);

    socket.emit("obtener_usuarios_directos", { usuarioActualId });

socket.on("usuarios_directos_respuesta", (respuesta) => {
    if (respuesta.success) {
        usuariosList.innerHTML = "";
        respuesta.usuarios.forEach((usuario) => {
            const li = document.createElement("li");
            li.classList.add("chat-item");

            // Estrella si tiene logros
            const estrella = usuario.total_logros > 0 ? ` <span style="color:gold;">⭐ ${usuario.total_logros}</span>` : "";

            // Estado: 1 = Activo, 0 = Inactivo
            const estadoTexto = usuario.estatus == 1 ? "🟢 Activo" : "🔴 Inactivo";
            const estadoColor = usuario.estatus == 1 ? "green" : "red";

            li.innerHTML = `
                <div>
                    <strong>${usuario.Nombre}</strong>${estrella}<br>
                    <span style="color:${estadoColor}; font-size: 0.85em;">${estadoTexto}</span>
                </div>
            `;

            li.addEventListener("click", () => {
                cargarMensajes(usuario.id_usuario, usuario.Nombre, usuario.estatus);
            });

            usuariosList.appendChild(li);
        });
    } else {
        alert("Error al cargar la lista de usuarios: " + respuesta.message);
    }
});



    function cargarMensajes(idUsuario, nombreUsuario, estatus) {
        userInfoHeader.textContent = nombreUsuario;
        userInfoHeader.setAttribute("data-id", idUsuario);
        mensajesContainer.innerHTML = "<p>Cargando mensajes...</p>";
        localStorage.setItem("usuarioVideollamada", idUsuario);

        videollamadaBtn.disabled = false;
        cifradoBtn.disabled = false;

        cifradoBtn.onclick = () => toggleCifrado(idUsuario);
        actualizarEstadoBotonCifrado(idUsuario);

        document.getElementById('videollamada-btn').addEventListener('click', () => {
            const idUsuarioLlamado = userInfoHeader.getAttribute("data-id");
            if (idUsuarioLlamado) {
                window.location.href = `videollamada?chatId=${idUsuarioLlamado}`;
            }
        });

        socket.emit("obtener_mensajes", {
            idUsuario1: usuarioActualId,
            idUsuario2: idUsuario,
        });

        socket.on("mensajes_respuesta", (respuesta) => {
            if (respuesta.success) {
                mensajesContainer.innerHTML = "";
                respuesta.mensajes.forEach((mensaje) => {
                    let texto = mensaje.texto_mensaje;
                    if (estadoCifradoPorUsuario[idUsuario]) {
                        try {
                            texto = desencriptarMensaje(texto);
                        } catch {
                            console.warn("⚠ No se pudo desencriptar el mensaje.");
                        }
                    }
                    mostrarMensaje(
                        texto,
                        mensaje.imagen_mensaje,
                        mensaje.fecha_creacion,
                        mensaje.id_usuario1_mensaje
                    );
                });
            } else {
                mensajesContainer.innerHTML = `<p>Error al cargar mensajes: ${respuesta.message}</p>`;
            }
        });
    }

    function mostrarMensaje(texto, imagen, fecha, remitenteId) {
        const div = document.createElement("div");
        div.classList.add(remitenteId == usuarioActualId ? "sent" : "received");
        const fechaTexto = `(${new Date(fecha).toLocaleString()})`;

        if (texto) {
            div.textContent = `${texto} ${fechaTexto}`;
        } else {
            div.textContent = fechaTexto;
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

    function toggleCifrado(idUsuario) {
        estadoCifradoPorUsuario[idUsuario] = !estadoCifradoPorUsuario[idUsuario];
        actualizarEstadoBotonCifrado(idUsuario);
    }

    function actualizarEstadoBotonCifrado(idUsuario) {
        if (estadoCifradoPorUsuario[idUsuario]) {
            cifradoBtn.classList.add("active");
            cifradoBtn.textContent = "Activado";
        } else {
            cifradoBtn.classList.remove("active");
            cifradoBtn.textContent = "Desactivado";
        }
    }

    const imagenBtn = document.getElementById("imagenes-btn");
    const imagenInput = document.getElementById("imagen-input");
    const imagenPreview = document.getElementById("imagen-preview");

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

    sendBtn.addEventListener("click", async () => {
        const textoOriginal = messageBox.value.trim();
        const idUsuarioDestino = userInfoHeader.getAttribute("data-id");
        const imagenFile = imagenInput.files[0];

        if (!idUsuarioDestino) {
            alert("Error: No se ha seleccionado un usuario.");
            return;
        }

        const textoFinal = estadoCifradoPorUsuario[idUsuarioDestino]
            ? encriptarMensaje(textoOriginal)
            : textoOriginal;

        const formData = new FormData();
        formData.append("texto_mensaje", textoFinal);
        formData.append("id_usuario1_mensaje", usuarioActualId);
        formData.append("id_usuario2_mensaje", idUsuarioDestino);
        formData.append("imagen_mensaje", imagenFile ? imagenFile : "null");

        fetch(`${SERVER_URL}/subir_imagen_mensaje`, {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    socket.emit("enviar_mensaje", {
                        texto_mensaje: textoFinal,
                        id_usuario1_mensaje: usuarioActualId,
                        id_usuario2_mensaje: idUsuarioDestino,
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

    socket.on("nuevo_mensaje", (mensaje) => {
        const idUsuarioActivo = userInfoHeader.getAttribute("data-id");

        if (mensaje.id_usuario1_mensaje == idUsuarioActivo || mensaje.id_usuario2_mensaje == idUsuarioActivo) {
            let texto = mensaje.texto_mensaje;
            if (estadoCifradoPorUsuario[idUsuarioActivo]) {
                try {
                    texto = desencriptarMensaje(texto);
                } catch {
                    console.warn("⚠ No se pudo desencriptar el mensaje recibido.");
                }
            }
            mostrarMensaje(
                texto,
                mensaje.imagen_mensaje,
                mensaje.fecha_creacion,
                mensaje.id_usuario1_mensaje
            );
        }
    });

    // Cifrado básico — reemplázalo por AES si lo deseas
    function encriptarMensaje(texto) {
        return btoa(unescape(encodeURIComponent(texto))); // Base64
    }

    function desencriptarMensaje(texto) {
        return decodeURIComponent(escape(atob(texto))); // Base64
    }
});
