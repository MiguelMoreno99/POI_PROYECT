document.addEventListener('DOMContentLoaded', function () {
    const socket = io('http://192.168.100.9:2800');
    const usuariosList = document.querySelector('.chat-list');
    const mensajesContainer = document.querySelector('.chat-messages');
    const userInfoHeader = document.querySelector('.user-info h3');
    const estadoUsuario = document.querySelector('.estadoUsuario');
    const sendBtn = document.getElementById('send-btn');
    const messageBox = document.getElementById('message-box');
    const usuarioActualId = localStorage.getItem('idUsuario');

    if (!usuarioActualId) {
        alert('Error: No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
        window.location.href = 'inicio_sesion';
        return;
    }
    console.log('ID del usuario actual cargado:', usuarioActualId);

    socket.emit('obtener_usuarios_directos', { usuarioActualId });

    socket.on('usuarios_directos_respuesta', (respuesta) => {
        console.log('Usuarios recibidos:', respuesta);
        if (respuesta.success) {
            usuariosList.innerHTML = '';
            respuesta.usuarios.forEach((usuario) => {
                const li = document.createElement('li');
                li.classList.add('chat-item');
                li.textContent = usuario.Nombre;
                li.addEventListener('click', () => {
                    cargarMensajes(usuario.id_usuario, usuario.Nombre);
                });
                usuariosList.appendChild(li);
            });
        } else {
            alert('Error al cargar la lista de usuarios: ' + respuesta.message);
        }
    });

    function cargarMensajes(idUsuario, nombreUsuario) {
        userInfoHeader.textContent = nombreUsuario;
        userInfoHeader.setAttribute('data-id', idUsuario);
        estadoUsuario.textContent = 'Activo';
        mensajesContainer.innerHTML = '<p>Cargando mensajes...</p>';

        console.log('Enviando al servidor:', { idUsuario1: usuarioActualId, idUsuario2: idUsuario });
        socket.emit('obtener_mensajes', { idUsuario1: usuarioActualId, idUsuario2: idUsuario });

        socket.on('mensajes_respuesta', (respuesta) => {
            console.log('Mensajes recibidos:', respuesta);
            if (respuesta.success) {
                mensajesContainer.innerHTML = '';
                respuesta.mensajes.forEach((mensaje) => {
                    mostrarMensaje(mensaje.texto_mensaje, mensaje.fecha_creacion, mensaje.id_usuario1_mensaje);
                });
            } else {
                mensajesContainer.innerHTML = `<p>Error al cargar mensajes: ${respuesta.message}</p>`;
            }
        });
    }

    function mostrarMensaje(texto, fecha, remitenteId) {
        const div = document.createElement('div');
        div.classList.add(remitenteId == usuarioActualId ? 'sent' : 'received');
        div.textContent = `${texto} (${new Date(fecha).toLocaleString()})`;
        mensajesContainer.appendChild(div);

        // Desplazar la vista al último mensaje
        mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
    }

    sendBtn.addEventListener('click', () => {
        const texto = messageBox.value.trim();
        const idUsuarioDestino = userInfoHeader.getAttribute('data-id');

        if (texto && idUsuarioDestino) {
            const mensajeData = {
                texto_mensaje: texto,
                id_usuario1_mensaje: usuarioActualId,
                id_usuario2_mensaje: idUsuarioDestino
            };

            // Emitir evento al servidor
            socket.emit('enviar_mensaje', mensajeData);

            // Mostrar el mensaje enviado sin esperar respuesta
            mostrarMensaje(texto, new Date(), usuarioActualId);

            // Limpiar el input
            messageBox.value = '';
        }
    });

    // Recibir mensajes en tiempo real
    socket.on('nuevo_mensaje', (mensaje) => {
        const idUsuarioActivo = userInfoHeader.getAttribute('data-id');

        if (mensaje.id_usuario1_mensaje == idUsuarioActivo || mensaje.id_usuario2_mensaje == idUsuarioActivo) {
            mostrarMensaje(mensaje.texto_mensaje, mensaje.fecha_creacion, mensaje.id_usuario1_mensaje);
        }
    });
});