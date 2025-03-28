document.addEventListener('DOMContentLoaded', function () {
    const socket = io('http://localhost:2800');
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
                    const div = document.createElement('div');
                    div.classList.add(mensaje.id_usuario1_mensaje === parseInt(usuarioActualId) ? 'sent' : 'received');
                    div.textContent = `${mensaje.texto_mensaje} (${new Date(mensaje.fecha_creacion).toLocaleString()})`;
                    mensajesContainer.appendChild(div);
                });
            } else {
                mensajesContainer.innerHTML = `<p>Error al cargar mensajes: ${respuesta.message}</p>`;
            }
        });
    }

    sendBtn.addEventListener('click', () => {
        const texto = messageBox.value.trim();
        const idUsuarioDestino = userInfoHeader.getAttribute('data-id');

        if (texto && idUsuarioDestino) {
            socket.emit('enviar_mensaje', {
                texto_mensaje: texto,
                id_usuario1_mensaje: usuarioActualId,
                id_usuario2_mensaje: idUsuarioDestino
            });

            messageBox.value = '';
        }
    });

    socket.on('mensaje_enviado', (respuesta) => {
        if (respuesta.success) {
            console.log('Mensaje enviado con éxito. ID del mensaje:', respuesta.id_mensaje);
            cargarMensajes(userInfoHeader.getAttribute('data-id'), userInfoHeader.textContent);
        } else {
            alert('Error al enviar el mensaje: ' + respuesta.message);
        }
    });
});