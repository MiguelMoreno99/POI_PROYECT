const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'POI'
});

db.connect((err) => {
    if (err) throw err;
    console.log('✅ Conectado a la base de datos');
});

function generarTokenSimple(correo) {
    return Buffer.from(`${correo}-${Date.now()}`).toString('base64');
}

const sesionesActivas = {};

// 🟢 Conexión con WebSockets
io.on('connection', (socket) => {
    console.log('✅ Cliente conectado');

    // 🟠 Registrar usuario
    socket.on('registrar_usuario', (data) => {
        const { nombre, apellido_paterno, apellido_materno, correo, contrasenia } = data;
        const sql = 'INSERT INTO usuario (Nombre, Apellido_paterno, Apellido_materno, correo_electronico, contrasenia) VALUES (?, ?, ?, ?, ?)';

        db.query(sql, [nombre, apellido_paterno, apellido_materno, correo, contrasenia], (err, result) => {
            if (err) {
                console.error('❌ Error en el registro:', err);
                socket.emit('registro_respuesta', { success: false, message: 'Error en el registro' });
                return;
            }
            console.log('🟢 Usuario registrado:', result.insertId);
            socket.emit('registro_respuesta', { success: true, message: 'Usuario registrado exitosamente' });
        });
    });

    // 🟠 Iniciar sesión
    socket.on('iniciar_sesion', (data) => {
        const { correo, contrasenia } = data;
        const sql = 'SELECT * FROM usuario WHERE correo_electronico = ? AND contrasenia = ?';

        db.query(sql, [correo, contrasenia], (err, results) => {
            if (err) {
                console.error('❌ Error en inicio de sesión:', err);
                socket.emit('sesion_respuesta', { success: false, message: 'Error en la solicitud' });
                return;
            }
            if (results.length > 0) {
                const usuario = results[0];
                const token = generarTokenSimple(correo);
                sesionesActivas[token] = usuario;

                console.log('🟢 Sesión iniciada:', usuario.Nombre);

                socket.emit('sesion_respuesta', {
                    success: true,
                    message: 'Inicio de sesión exitoso',
                    token,
                    usuario: { id_usuario: usuario.id_usuario, Nombre: usuario.Nombre }
                });
            } else {
                socket.emit('sesion_respuesta', { success: false, message: 'Credenciales incorrectas' });
            }
        });
    });

    socket.on('obtener_usuarios_directos', (data) => {
        const { usuarioActualId } = data;
        const sql = `SELECT usuario.id_usuario, usuario.Nombre FROM usuario`;

        db.query(sql, [usuarioActualId], (err, results) => {
            if (err) {
                console.error('Error al obtener usuarios:', err);
                socket.emit('usuarios_directos_respuesta', { success: false, message: 'Error al obtener usuarios' });
                return;
            }
            socket.emit('usuarios_directos_respuesta', { success: true, usuarios: results });
        });
    });

    socket.on('obtener_mensajes', (data) => {
        const { idUsuario1, idUsuario2 } = data;

        const sql = `
            SELECT texto_mensaje, fecha_creacion, id_usuario1_mensaje
            FROM tabla_mensajes
            WHERE (id_usuario1_mensaje = ? AND id_usuario2_mensaje = ?)
            OR (id_usuario1_mensaje = ? AND id_usuario2_mensaje = ?)
            ORDER BY fecha_creacion ASC`;

        db.query(sql, [idUsuario1, idUsuario2, idUsuario2, idUsuario1], (err, results) => {
            if (err) {
                console.error('Error al obtener mensajes:', err);
                socket.emit('mensajes_respuesta', { success: false, message: 'Error al obtener mensajes' });
                return;
            }
            console.log('Mensajes encontrados:', results);
            socket.emit('mensajes_respuesta', { success: true, mensajes: results });
        });
    });

    socket.on('enviar_mensaje', (data) => {
        const { texto_mensaje, id_usuario1_mensaje, id_usuario2_mensaje } = data;

        const sql = `
        INSERT INTO tabla_mensajes (texto_mensaje, id_usuario1_mensaje, id_usuario2_mensaje)
        VALUES (?, ?, ?)`;

        db.query(sql, [texto_mensaje, id_usuario1_mensaje, id_usuario2_mensaje], (err, result) => {
            if (err) {
                console.error('Error al enviar mensaje:', err);
                socket.emit('mensaje_enviado', { success: false, message: 'Error al enviar el mensaje' });
                return;
            }

            console.log('Mensaje enviado con éxito:', result.insertId);

            const nuevoMensaje = {
                id_mensaje: result.insertId,
                texto_mensaje,
                id_usuario1_mensaje,
                id_usuario2_mensaje,
                fecha_creacion: new Date()
            };

            // Enviar el mensaje al remitente y al destinatario en tiempo real
            io.emit('nuevo_mensaje', nuevoMensaje);

            // Confirmación de mensaje enviado (para depuración)
            socket.emit('mensaje_enviado', { success: true, id_mensaje: result.insertId });
        });
    });

    socket.on('validar_sesion', (token) => {
        if (sesionesActivas[token]) {
            socket.emit('validar_respuesta', { success: true, usuario: sesionesActivas[token] });
        } else {
            socket.emit('validar_respuesta', { success: false, message: 'Sesión inválida o expirada' });
        }
    });

    // 🟠 Cerrar sesión
    socket.on('cerrar_sesion', (token) => {
        delete sesionesActivas[token];
        socket.emit('sesion_cerrada', { success: true, message: 'Sesión cerrada exitosamente' });
    });

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado');
    });
});

// 🟢 Servidor escuchando en el puerto 2800
server.listen(2800, () => {
    console.log('🚀 Servidor WebSocket corriendo en http://localhost:2800');
});
