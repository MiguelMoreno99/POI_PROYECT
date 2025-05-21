const servidor = require('./Public/CONF/config.js');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

require("events").EventEmitter.defaultMaxListeners = 100;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// Configuración de almacenamiento para imágenes
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/imagenes'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nombre único
    }
});
const upload = multer({ storage });

// Configuración de la base de datos
const db = mysql.createConnection({
    host: servidor.HOST,
    user: servidor.USER,
    password: servidor.PASSWORD,
    database: servidor.DATABASE_NAME
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

    console.log("Usuario conectado");

    // Enviar correo.
    socket.on("enviar_correo", async (datosCorreo) => {
        console.log("📨 Evento 'enviar_correo' recibido en el servidor:", datosCorreo);
    
        try {
            const { remitenteId, destinatarioCorreo, asunto, texto } = datosCorreo;
    
            db.query("SELECT id_usuario FROM usuario WHERE correo_electronico = ?", [destinatarioCorreo], (err, destinatario) => {
                if (err || destinatario.length === 0) {
                    console.error("❌ Error al buscar destinatario:", err);
                    socket.emit("correo_error", { message: "Destinatario no encontrado" });
                    return;
                }
    
                const destinatarioId = destinatario[0].id_usuario;
                console.log("✅ Destinatario encontrado con ID:", destinatarioId);
    
                db.query("INSERT INTO tabla_mensajes_correo (id_usuario1_mensaje, id_usuario2_mensaje, asunto_correo, texto_correo) VALUES (?, ?, ?, ?)", 
                [remitenteId, destinatarioId, asunto, texto], (err, result) => {
                    if (err) {
                        console.error("❌ Error al guardar el correo en la BD:", err);
                        socket.emit("correo_error", { message: "Error al guardar el correo" });
                        return;
                    }
    
                    console.log("✅ Correo guardado en BD con ID:", result.insertId);
                    socket.emit("correo_enviado", { success: true });
                });
            });
    
        } catch (error) {
            console.error("❌ Error inesperado al enviar correo:", error);
            socket.emit("correo_error", { message: "Error inesperado al procesar el correo" });
        }
    });

    //Obtener usuario
socket.on("obtener_usuario", (data) => {
    const { id_usuario } = data;

    if (!id_usuario) {
        socket.emit("usuario_respuesta", { success: false, message: "ID de usuario no proporcionado" });
        return;
    }

    // ✅ Obtener datos del usuario
    const sqlUsuario = `
        SELECT Nombre, Apellido_paterno, Apellido_materno, correo_electronico, imagen 
        FROM usuario 
        WHERE id_usuario = ?
    `;

    db.query(sqlUsuario, [id_usuario], (err, usuarioResults) => {
        if (err || usuarioResults.length === 0) {
            console.error("❌ Error al obtener usuario:", err);
            socket.emit("usuario_respuesta", { success: false, message: "Usuario no encontrado" });
            return;
        }

        const usuario = usuarioResults[0];

        // ✅ Obtener logros del usuario con estatus = 1
        const sqlLogros = `
            SELECT l.id_logro, l.Nombre 
            FROM Usuario_Logro ul
            JOIN Logros l ON ul.id_logro = l.id_logro
            WHERE ul.id_usuario = ? AND ul.estatus = 1
        `;

        db.query(sqlLogros, [id_usuario], (err, logrosResults) => {
            if (err) {
                console.error("❌ Error al obtener logros:", err);
                socket.emit("usuario_respuesta", { success: false, message: "Error al obtener logros" });
                return;
            }

            const sqlLogrosCount = `
                SELECT COUNT(*) AS total_logros 
                FROM Usuario_Logro 
                WHERE id_usuario = ? AND estatus = 1
            `;

            db.query(sqlLogrosCount, [id_usuario], (err, logrosCountResult) => {
                if (err) {
                    console.error("❌ Error al contar logros:", err);
                    socket.emit("usuario_respuesta", { success: false, message: "Error al contar logros" });
                    return;
                }

                const totalLogros = logrosCountResult[0].total_logros;
                console.log("✅ Usuario obtenido:", usuario);
                console.log("🏆 Logros obtenidos:", logrosResults);
                console.log(`🌟 Total de logros obtenidos: ${totalLogros}`);

                socket.emit("usuario_respuesta", { success: true, usuario, logros: logrosResults, totalLogros });
            });
        });
    });
});

    // 🟠 Registrar usuario con imagen
socket.on('registrar_usuario', (data) => {
    const { nombre, apellido_paterno, apellido_materno, correo, contrasenia } = data;
    
    const sql = 'INSERT INTO usuario (Nombre, Apellido_paterno, Apellido_materno, correo_electronico, contrasenia, imagen) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [nombre, apellido_paterno, apellido_materno, correo, contrasenia, "imagenes/default.png"], (err, result) => {
        if (err) {
            console.error('❌ Error en el registro:', err);
            socket.emit('registro_respuesta', { success: false, message: 'Error en el registro' });
            return;
        }
        console.log('🟢 Usuario registrado:', result.insertId);
        socket.emit('registro_respuesta', { success: true, insertId: result.insertId, message: 'Usuario registrado exitosamente' });
    });
});

    // 🟠 Subir imagen de perfil
    app.post('/subir_imagen', upload.single('imagen_usuario'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No se recibió ninguna imagen" });
        }

        const rutaImagen = `imagenes/${req.file.filename}`; // Ruta dentro de public/
        const id_usuario = req.body.id_usuario;

        const sql = "UPDATE usuario SET imagen = ? WHERE id_usuario = ?";
        db.query(sql, [rutaImagen, id_usuario], (err) => {
            if (err) {
                console.error("❌ Error al guardar la imagen:", err);
                return res.status(500).json({ success: false, message: "Error al guardar la imagen" });
            }
            res.json({ success: true, message: "Imagen guardada correctamente", ruta: rutaImagen });
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

            const updateSql = 'UPDATE usuario SET estatus = 1 WHERE id_usuario = ?';
            db.query(updateSql, [usuario.id_usuario], (updateErr) => {
                if (updateErr) {
                    console.error('❌ Error al actualizar estatus:', updateErr);
                } else {
                    console.log('🟢 Estatus actualizado para:', usuario.Nombre);
                }
            });

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

    // Esta consulta obtiene el nombre del usuario y el número de logros con estatus = 1
const sql = `
    SELECT 
        u.id_usuario, 
        u.Nombre,
        u.estatus,
        COUNT(ul.id_logro) AS total_logros
    FROM usuario u
    LEFT JOIN Usuario_Logro ul ON u.id_usuario = ul.id_usuario AND ul.estatus = 1
    GROUP BY u.id_usuario
`;


    db.query(sql, [usuarioActualId], (err, results) => {
        if (err) {
            console.error('❌ Error al obtener usuarios directos:', err);
            socket.emit('usuarios_directos_respuesta', { success: false, message: 'Error al obtener usuarios' });
            return;
        }

        console.log('✅ Usuarios directos obtenidos con total de logros:', results);
        socket.emit('usuarios_directos_respuesta', { success: true, usuarios: results });
    });
});

//Obtener mensajes
socket.on('obtener_mensajes', (data) => {
    const { idUsuario1, idUsuario2 } = data;

    const sql = `
        SELECT texto_mensaje, imagen_mensaje, fecha_creacion, id_usuario1_mensaje
        FROM tabla_mensajes
        WHERE (id_usuario1_mensaje = ? AND id_usuario2_mensaje = ?)
        OR (id_usuario1_mensaje = ? AND id_usuario2_mensaje = ?)
        ORDER BY fecha_creacion ASC`;

    db.query(sql, [idUsuario1, idUsuario2, idUsuario2, idUsuario1], (err, results) => {
        if (err) {
            console.error('❌ Error al obtener mensajes:', err);
            socket.emit('mensajes_respuesta', { success: false, message: 'Error al obtener mensajes' });
            return;
        }
        console.log('✅ Mensajes encontrados:', results);
        socket.emit('mensajes_respuesta', { success: true, mensajes: results });
    });
});

    //Enviar mensaje
socket.on("enviar_mensaje", (data) => {
    const { texto_mensaje, id_usuario1_mensaje, id_usuario2_mensaje, imagen_mensaje } = data;

    // Si imagen_mensaje es "null", almacenar NULL en la base de datos
    const rutaImagen = imagen_mensaje && imagen_mensaje !== "null" ? imagen_mensaje : null;

    const sql = `
    INSERT INTO tabla_mensajes (texto_mensaje, imagen_mensaje, id_usuario1_mensaje, id_usuario2_mensaje)
    VALUES (?, ?, ?, ?)`;

    db.query(sql, [texto_mensaje, rutaImagen, id_usuario1_mensaje, id_usuario2_mensaje], (err, result) => {
        if (err) {
            console.error("❌ Error al enviar mensaje:", err);
            socket.emit("mensaje_enviado", { success: false, message: "Error al enviar el mensaje" });
            return;
        }

        console.log("🟢 Mensaje enviado con éxito:", result.insertId);

        const nuevoMensaje = {
            id_mensaje: result.insertId,
            texto_mensaje,
            imagen_mensaje: rutaImagen, // Enviar NULL si no hay imagen
            id_usuario1_mensaje,
            id_usuario2_mensaje,
            fecha_creacion: new Date()
        };

        // Enviar el mensaje con imagen en tiempo real
        io.emit("nuevo_mensaje", nuevoMensaje);

        // Confirmación de mensaje enviado
        socket.emit("mensaje_enviado", { success: true, id_mensaje: result.insertId });
    });
});

    // 🟠 Subir imagen de mensaje
app.post('/subir_imagen_mensaje', upload.single('imagen_mensaje'), (req, res) => {
    if (!req.file) {
        return res.json({ success: true, message: "Mensaje enviado sin imagen", ruta: null });
    }

    const rutaImagen = `imagenes/${req.file.filename}`; // Ruta dentro de public/
    res.json({ success: true, message: "Imagen guardada correctamente", ruta: rutaImagen });
});

    socket.on('validar_sesion', (token) => {
        if (sesionesActivas[token]) {
            socket.emit('validar_respuesta', { success: true, usuario: sesionesActivas[token] });
        } else {
            socket.emit('validar_respuesta', { success: false, message: 'Sesión inválida o expirada' });
        }
    });

    //Obtener grupo
    socket.on("obtener_grupos", (data) => {
        const { id_usuario } = data;
    
        if (!id_usuario) {
            socket.emit("lista_grupos", { success: false, message: "No se proporcionó ID de usuario" });
            return;
        }
    
        const sql = `
            SELECT g.id_grupo, g.Nombre 
            FROM Grupo g 
            JOIN Usuario_Grupo ug ON g.id_grupo = ug.id_grupo 
            WHERE ug.id_usuario = ?`;
    
        db.query(sql, [id_usuario], (err, results) => {
            if (err) {
                console.error("❌ Error al obtener los grupos:", err);
                socket.emit("lista_grupos", { success: false, message: "Error al obtener grupos" });
                return;
            }
            socket.emit("lista_grupos", { success: true, grupos: results });
        });
    });

    socket.on("obtener_nombre_grupo", (data) => {
        const { id_grupo } = data;
        console.log("🔎 Buscando grupo con ID:", id_grupo);
    
        const sql = "SELECT Nombre FROM Grupo WHERE id_grupo = ?";
        db.query(sql, [id_grupo], (err, results) => {
            if (err || results.length === 0) {
                console.error("❌ Error al buscar grupo:", err);
                socket.emit("nombre_grupo_respuesta", { success: false, nombre: "Grupo no encontrado" });
            } else {
                console.log("✅ Grupo encontrado:", results[0].Nombre);
                socket.emit("nombre_grupo_respuesta", { success: true, nombre: results[0].Nombre });
            }
        });
    });

    socket.on("actualizar_usuario", (data) => {
        const { id_usuario, Nombre, Apellido_paterno, Apellido_materno, contrasenia } = data;
    
        if (!id_usuario) {
            socket.emit("usuario_actualizado", { success: false, message: "ID de usuario no proporcionado." });
            return;
        }
    
        let camposActualizar = [];
        let valoresActualizar = [];
    
        if (Nombre) {
            camposActualizar.push("Nombre = ?");
            valoresActualizar.push(Nombre);
        }
        if (Apellido_paterno) {
            camposActualizar.push("Apellido_paterno = ?");
            valoresActualizar.push(Apellido_paterno);
        }
        if (Apellido_materno) {
            camposActualizar.push("Apellido_materno = ?");
            valoresActualizar.push(Apellido_materno);
        }
        if (contrasenia) {
            camposActualizar.push("contrasenia = ?");
            valoresActualizar.push(contrasenia);
        }
    
        if (camposActualizar.length === 0) {
            socket.emit("usuario_actualizado", { success: false, message: "No se enviaron datos para actualizar." });
            return;
        }
    
        valoresActualizar.push(id_usuario);
        const sql = `UPDATE usuario SET ${camposActualizar.join(", ")} WHERE id_usuario = ?`;
    
        db.query(sql, valoresActualizar, (err, result) => {
            if (err) {
                console.error("❌ Error al actualizar usuario:", err);
                socket.emit("usuario_actualizado", { success: false, message: "Error en la actualización." });
                return;
            }
    
            console.log("✅ Usuario actualizado con éxito.");
            socket.emit("usuario_actualizado", { success: true });
        });
    });

    //Crear Grupo
socket.on("crear_grupo", (data) => {
    const { nombre, id_creador } = data;

    if (!nombre || !id_creador) {
        socket.emit("grupo_creado", { success: false, message: "Faltan datos para crear el grupo." });
        return;
    }

    const sqlInsertGrupo = "INSERT INTO Grupo (Nombre, id_creador) VALUES (?, ?)";
    
    db.query(sqlInsertGrupo, [nombre, id_creador], (err, result) => {
        if (err) {
            console.error("❌ Error al crear grupo:", err);
            socket.emit("grupo_creado", { success: false, message: "Error en la inserción de datos." });
            return;
        }

        console.log("✅ Grupo creado con ID:", result.insertId);
        socket.emit("grupo_creado", { success: true, nombre });

        const sqlUpdateLogro = "UPDATE Usuario_Logro SET estatus = 1 WHERE id_usuario = ? AND id_logro = 5";
        db.query(sqlUpdateLogro, [id_creador], (err, result) => {
            if (err) {
                console.error("❌ Error al actualizar logro:", err);
            } else {
                console.log("✅ Logro actualizado correctamente");
            }
        });
    });
});

    socket.on("obtener_grupos_creados", (data) => {
        const { id_usuario } = data;
    
        if (!id_usuario) {
            socket.emit("lista_grupos_creados", { success: false, message: "ID de usuario no proporcionado" });
            return;
        }
    
        const sql = "SELECT id_grupo, Nombre FROM Grupo WHERE id_creador = ?";
    
        db.query(sql, [id_usuario], (err, results) => {
            if (err) {
                console.error("❌ Error al obtener grupos creados por el usuario:", err);
                socket.emit("lista_grupos_creados", { success: false, message: "Error al obtener grupos" });
                return;
            }
    
            console.log("✅ Grupos creados por el usuario obtenidos:", results);
            socket.emit("lista_grupos_creados", { success: true, grupos: results });
        });
    });

    // Traer usuarios para grupos

socket.on("Grupo_usuarios", (data) => {
    if (!data || !data.id_grupo) {
        console.error("❌ Error: No se recibió ID del grupo.");
        socket.emit("lista_usuarios", { success: false, message: "Error: No se envió ID del grupo." });
        return;
    }

    const { id_grupo } = data; // Recibir ID del grupo correctamente

    const sql = `
        SELECT u.id_usuario, u.Nombre, u.Apellido_paterno, u.Apellido_materno, u.correo_electronico
        FROM usuario u
        WHERE u.id_usuario NOT IN (
            SELECT ug.id_usuario FROM Usuario_Grupo ug WHERE ug.id_grupo = ?
        )
    `;

    db.query(sql, [id_grupo], (err, results) => {
        if (err) {
            console.error("❌ Error al obtener usuarios disponibles:", err);
            socket.emit("lista_usuarios", { success: false, message: "Error al obtener usuarios disponibles" });
            return;
        }
        console.log("✅ Usuarios disponibles obtenidos:", results);
        socket.emit("lista_usuarios", { success: true, usuarios: results });
    });
});

socket.on("Agregar_usuarios_grupo", (data) => {
    const { id_grupo, usuariosSeleccionados } = data;

    console.log("📡 Datos recibidos en el servidor:", data);

    if (!id_grupo || !usuariosSeleccionados || usuariosSeleccionados.length === 0) {
        console.error("❌ Datos inválidos recibidos.");
        socket.emit("agregar_usuario_respuesta", { success: false, message: "Datos inválidos" });
        return;
    }

    let sql = "INSERT INTO Usuario_Grupo (id_grupo, id_usuario) VALUES ?";
    let valores = usuariosSeleccionados.map(id_usuario => [id_grupo, id_usuario]);

    db.query(sql, [valores], (err, result) => {
        if (err) {
            console.error("❌ Error al agregar usuarios al grupo:", err);
            socket.emit("agregar_usuario_respuesta", { success: false, message: "Error al agregar usuarios" });
            return;
        }

        console.log("✅ Usuarios agregados al grupo:", result.affectedRows);
        socket.emit("agregar_usuario_respuesta", { success: true, message: "Usuarios agregados exitosamente" });
    });
});

//Eliminar usuario en el grupo

socket.on("Grupo_usuario_eliminar", (data) => {
    if (!data || !data.id_grupo) {
        console.error("❌ Error: No se recibió ID del grupo.");
        socket.emit("lista_integrantes", { success: false, message: "Error: No se envió ID del grupo." });
        return;
    }

    const { id_grupo } = data;

    const sql = `
        SELECT u.id_usuario, u.Nombre, u.Apellido_paterno, u.Apellido_materno, u.correo_electronico
        FROM usuario u
        INNER JOIN Usuario_Grupo ug ON u.id_usuario = ug.id_usuario
        WHERE ug.id_grupo = ?
    `;

    db.query(sql, [id_grupo], (err, results) => {
        if (err) {
            console.error("❌ Error al obtener integrantes del grupo:", err);
            socket.emit("lista_integrantes", { success: false, message: "Error al obtener integrantes." });
            return;
        }
        console.log("✅ Integrantes obtenidos:", results);
        socket.emit("lista_integrantes", { success: true, integrantes: results });
    });
});

socket.on("Eliminar_integrantes_grupo", (data) => {
    const { id_grupo, usuariosSeleccionados } = data;

    console.log("📡 Datos recibidos para eliminar:", data);

    if (!id_grupo || !usuariosSeleccionados || usuariosSeleccionados.length === 0) {
        console.error("❌ Datos inválidos recibidos.");
        socket.emit("eliminar_usuario_respuesta", { success: false, message: "Datos inválidos" });
        return;
    }

    let sql = "DELETE FROM Usuario_Grupo WHERE id_grupo = ? AND id_usuario IN (?)";
    
    db.query(sql, [id_grupo, usuariosSeleccionados], (err, result) => {
        if (err) {
            console.error("❌ Error al eliminar usuarios del grupo:", err);
            socket.emit("eliminar_usuario_respuesta", { success: false, message: "Error al eliminar usuarios" });
            return;
        }

        console.log("✅ Usuarios eliminados del grupo:", result.affectedRows);
        socket.emit("eliminar_usuario_respuesta", { success: true, message: "Usuarios eliminados exitosamente" });
    });
});

    socket.on("Abandonar_grupo", (data) => {
    const { id_grupo, id_usuario } = data;

    console.log("📡 Usuario abandonando el grupo:", data);

    if (!id_grupo || !id_usuario) {
        console.error("❌ Datos inválidos recibidos.");
        socket.emit("abandonar_respuesta", { success: false, message: "Error: Datos inválidos." });
        return;
    }

    let sql = "DELETE FROM Usuario_Grupo WHERE id_grupo = ? AND id_usuario = ?";
    
    db.query(sql, [id_grupo, id_usuario], (err, result) => {
        if (err) {
            console.error("❌ Error al abandonar el grupo:", err);
            socket.emit("abandonar_respuesta", { success: false, message: "Error al abandonar el grupo." });
            return;
        }

        console.log("✅ Usuario eliminado del grupo:", result.affectedRows);
        socket.emit("abandonar_respuesta", { success: true, message: "Has abandonado el grupo exitosamente." });
    });
});

//Mensajes grupos
socket.on("obtener_mensajes_grupo", (data) => {
    const { id_grupo } = data;

    if (!id_grupo) {
        console.error("❌ Error: No se recibió ID del grupo.");
        socket.emit("mensajes_grupo_respuesta", { success: false, message: "Error: No se envió ID del grupo." });
        return;
    }

    const sql = `
        SELECT mg.texto, mg.imagen_mensaje, mg.fecha_creacion, u.Nombre, u.Apellido_paterno
        FROM mensaje_grupo mg
        INNER JOIN usuario u ON mg.id_usuario = u.id_usuario
        WHERE mg.id_grupo = ?
        ORDER BY mg.fecha_creacion ASC
    `;

    db.query(sql, [id_grupo], (err, results) => {
        if (err) {
            console.error("❌ Error al obtener mensajes del grupo:", err);
            socket.emit("mensajes_grupo_respuesta", { success: false, message: "Error al obtener mensajes." });
            return;
        }

        console.log("✅ Mensajes obtenidos:", results);
        socket.emit("mensajes_grupo_respuesta", { success: true, mensajes: results });
    });
});

socket.on("enviar_mensaje_grupo", (data) => {
    const { texto, id_usuario, id_grupo, imagen_mensaje } = data;

    // Si no hay imagen, almacenar NULL en la base de datos
    const rutaImagen = imagen_mensaje && imagen_mensaje !== "null" ? imagen_mensaje : null;

    const sql = `
    INSERT INTO mensaje_grupo (texto, imagen_mensaje, id_usuario, id_grupo)
    VALUES (?, ?, ?, ?)`;

    db.query(sql, [texto, rutaImagen, id_usuario, id_grupo], (err, result) => {
        if (err) {
            console.error("❌ Error al enviar mensaje en el grupo:", err);
            socket.emit("mensaje_grupo_respuesta", { success: false, message: "Error al enviar el mensaje" });
            return;
        }

        console.log("🟢 Mensaje enviado con éxito:", result.insertId);

        const nuevoMensajeGrupo = {
            id_mensajegrupo: result.insertId,
            texto,
            imagen_mensaje: rutaImagen, // Enviar NULL si no hay imagen
            id_usuario,
            id_grupo,
            fecha_creacion: new Date()
        };

        // Emitir el mensaje en tiempo real para todos los usuarios en el grupo
        io.emit("nuevo_mensaje_grupo", nuevoMensajeGrupo);

        // Confirmación de mensaje enviado
        socket.emit("mensaje_grupo_respuesta", { success: true, id_mensajegrupo: result.insertId });
    });
});

//Tareas
socket.on("crear_tarea", (data) => {
    const { idUsuario, titulo, descripcion, fechaVencimiento, idGrupo } = data;

    if (!idUsuario || !titulo || !descripcion || !fechaVencimiento || !idGrupo) {
        socket.emit("tarea_creada", { success: false, message: "Faltan datos para crear la tarea." });
        return;
    }

    const sqlUsuariosGrupo = "SELECT id_usuario FROM Usuario_Grupo WHERE id_grupo = ?";

    db.query(sqlUsuariosGrupo, [idGrupo], (err, results) => {
        if (err || results.length === 0) {
            console.error("❌ Error al obtener usuarios del grupo:", err);
            socket.emit("tarea_creada", { success: false, message: "No hay usuarios en este grupo." });
            return;
        }

        const usuariosGrupo = results.map(row => row.id_usuario);

        const sqlInsertTarea = `
            INSERT INTO tarea (id_grupo, id_creador, id_usuario, titulo, descripcion, fecha_vencimiento, fecha_creacion, estatus)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), 0)
        `;

        usuariosGrupo.forEach((idUsuarioGrupo) => {
            db.query(sqlInsertTarea, [idGrupo, idUsuario, idUsuarioGrupo, titulo, descripcion, fechaVencimiento], (err, result) => {
                if (err) {
                    console.error("❌ Error al insertar tarea:", err);
                    socket.emit("tarea_creada", { success: false, message: "Error al guardar la tarea." });
                    return;
                }
            });
        });

        console.log("✅ Tarea creada correctamente para todos los usuarios del grupo con fecha de vencimiento:", fechaVencimiento);
        socket.emit("tarea_creada", { success: true, titulo });

        // ✅ Actualizar el logro con id_logro = 1 al crear una tarea
        const sqlActualizarLogro1 = `
            UPDATE Usuario_Logro 
            SET estatus = 1 
            WHERE id_usuario = ? AND id_logro = 2
        `;

        db.query(sqlActualizarLogro1, [idUsuario], (err, results) => {
            if (err) {
                console.error("❌ Error al actualizar logro (id_logro = 1):", err);
            } else {
                console.log("🏆 Logro actualizado correctamente (id_logro = 1) para el usuario:", idUsuario);
            }
        });

        // ✅ Contar cuántas tareas ha creado el usuario
        const sqlContarTareasCreadas = `
            SELECT COUNT(*) AS total_creadas 
            FROM tarea 
            WHERE id_creador = ?
        `;

        db.query(sqlContarTareasCreadas, [idUsuario], (err, results) => {
            if (err) {
                console.error("❌ Error al contar tareas creadas:", err);
                return;
            }

            const totalCreadas = results[0].total_creadas;
            console.log(`📊 El usuario ${idUsuario} ha creado ${totalCreadas} tareas.`);

            if (totalCreadas >= 3) {
                // ✅ Si ha creado 3 o más tareas, actualizar el logro con id_logro = 4
                const sqlActualizarLogro4 = `
                    UPDATE Usuario_Logro 
                    SET estatus = 1 
                    WHERE id_usuario = ? AND id_logro = 4
                `;

                db.query(sqlActualizarLogro4, [idUsuario], (err, results) => {
                    if (err) {
                        console.error("❌ Error al actualizar logro (id_logro = 4):", err);
                    } else {
                        console.log("🏆 Logro actualizado correctamente (id_logro = 4) para el usuario:", idUsuario);
                    }
                });
            }
        });
    });
});

//Obtener tareas
    socket.on("obtener_tareas_usuario", (data) => {
        const { id_usuario } = data;
    
        if (!id_usuario) {
            socket.emit("lista_tareas_usuario", { success: false, message: "ID de usuario no proporcionado" });
            return;
        }
    
        const sql = `
SELECT 
    t.id_tarea, 
    t.titulo, 
    t.descripcion, 
    t.fecha_vencimiento, 
    t.fecha_creacion, 
    t.estatus, 
    g.Nombre AS grupo
FROM tarea t
JOIN Grupo g ON t.id_grupo = g.id_grupo
WHERE t.id_usuario = ? 
ORDER BY t.fecha_vencimiento ASC;
        `;
    
        db.query(sql, [id_usuario], (err, results) => {
            if (err) {
                console.error("❌ Error al obtener tareas del usuario:", err);
                socket.emit("lista_tareas_usuario", { success: false, message: "Error al obtener tareas" });
                return;
            }
    
            console.log("✅ Tareas obtenidas:", results);
            socket.emit("lista_tareas_usuario", { success: true, tareas: results });
        });
    });

// 🔍 Obtener detalles de una tarea específica
socket.on("obtener_detalle_tarea", (data) => {
    const { id_tarea, id_usuario } = data;

    if (!id_tarea || !id_usuario) {
        socket.emit("detalle_tarea_respuesta", { success: false, message: "ID de tarea o usuario no proporcionado" });
        return;
    }

    const sql = `
        SELECT titulo, descripcion, fecha_vencimiento
        FROM tarea
        WHERE id_tarea = ? AND id_usuario = ?
    `;

    db.query(sql, [id_tarea, id_usuario], (err, results) => {
        if (err) {
            console.error("❌ Error al obtener detalles de la tarea:", err);
            socket.emit("detalle_tarea_respuesta", { success: false, message: "Error en la consulta" });
            return;
        }

        if (results.length > 0) {
            socket.emit("detalle_tarea_respuesta", { success: true, tarea: results[0] });
            console.log("✅ Detalles de la tarea enviados:", results[0]);
        } else {
            socket.emit("detalle_tarea_respuesta", { success: false, message: "Tarea no encontrada" });
        }
    });
}); 

// 🔄 Marcar una tarea como completada y actualizar logros
socket.on("marcar_tarea_completada", (data) => {
    const { id_tarea, id_usuario } = data;

    if (!id_tarea || !id_usuario) {
        socket.emit("tarea_marcada_respuesta", { success: false, message: "ID de tarea o usuario no proporcionado" });
        return;
    }

    // ✅ Actualizar la tarea como completada
    const sqlActualizarTarea = `
        UPDATE tarea 
        SET estatus = 1 
        WHERE id_tarea = ? AND id_usuario = ?
    `;

    db.query(sqlActualizarTarea, [id_tarea, id_usuario], (err, results) => {
        if (err) {
            console.error("❌ Error al marcar la tarea como completada:", err);
            socket.emit("tarea_marcada_respuesta", { success: false, message: "Error en la actualización" });
            return;
        }

        if (results.affectedRows > 0) {
            console.log("✅ Tarea marcada como completada:", id_tarea);
            socket.emit("tarea_marcada_respuesta", { success: true });

            // ✅ Actualizar el logro con id_logro = 1 al completar una tarea
            const sqlActualizarLogro1 = `
                UPDATE Usuario_Logro 
                SET estatus = 1 
                WHERE id_usuario = ? AND id_logro = 1
            `;

            db.query(sqlActualizarLogro1, [id_usuario], (err, results) => {
                if (err) {
                    console.error("❌ Error al actualizar logro (id_logro = 1):", err);
                } else {
                    console.log("🏆 Logro actualizado correctamente (id_logro = 1) para el usuario:", id_usuario);
                }
            });

            // ✅ Verificar cuántas tareas ha completado el usuario
            const sqlContarTareasCompletadas = `
                SELECT COUNT(*) AS total_completadas 
                FROM tarea 
                WHERE id_usuario = ? AND estatus = 1
            `;

            db.query(sqlContarTareasCompletadas, [id_usuario], (err, results) => {
                if (err) {
                    console.error("❌ Error al contar tareas completadas:", err);
                    return;
                }

                const totalCompletadas = results[0].total_completadas;
                console.log(`📊 El usuario ${id_usuario} ha completado ${totalCompletadas} tareas.`);

                if (totalCompletadas >= 3) {
                    // ✅ Si ha completado 3 o más tareas, actualizar el logro con id_logro = 3
                    const sqlActualizarLogro3 = `
                        UPDATE Usuario_Logro 
                        SET estatus = 1 
                        WHERE id_usuario = ? AND id_logro = 3
                    `;

                    db.query(sqlActualizarLogro3, [id_usuario], (err, results) => {
                        if (err) {
                            console.error("❌ Error al actualizar logro (id_logro = 3):", err);
                        } else {
                            console.log("🏆 Logro actualizado correctamente (id_logro = 3) para el usuario:", id_usuario);
                        }
                    });
                }
            });
        } else {
            socket.emit("tarea_marcada_respuesta", { success: false, message: "No se encontró la tarea para actualizar" });
        }
    });
});

// Logros
        // 🟠 Obtener logros del usuario
        socket.on("obtener_logros_usuario", (data) => {
            console.log("📡 Solicitando logros para el usuario:", data.id_usuario);
            const sql = `
                SELECT ul.id_logro, l.Nombre, ul.estatus
                FROM Usuario_Logro ul
                JOIN Logros l ON ul.id_logro = l.id_logro
                WHERE ul.id_usuario = ?
            `;
    
            db.query(sql, [data.id_usuario], (err, results) => {
                if (err) {
                    console.error("❌ Error al obtener los logros:", err);
                    socket.emit("lista_logros_usuario", { success: false });
                    return;
                }
    
                socket.emit("lista_logros_usuario", { success: true, logros: results });
                console.log("✅ Logros enviados al usuario:", results);
            });
        });
    
        // 🟠 Actualizar estado de un logro
        socket.on("actualizar_logro", (data) => {
            console.log(`📡 Actualizando logro: ID ${data.id_logro}, Usuario: ${data.id_usuario}, Nuevo estatus: ${data.estatus}`);
    
            const sqlUpdate = `
                UPDATE Usuario_Logro 
                SET estatus = ? 
                WHERE id_usuario = ? AND id_logro = ?
            `;
    
            db.query(sqlUpdate, [data.estatus, data.id_usuario, data.id_logro], (err, results) => {
                if (err) {
                    console.error("❌ Error al actualizar logro:", err);
                    socket.emit("logro_actualizado", { success: false });
                    return;
                }
    
                console.log(`✅ Logro actualizado: ID ${data.id_logro}, Nuevo estatus: ${data.estatus}`);
                socket.emit("logro_actualizado", { success: true });
    
                // Enviar lista de logros actualizada al usuario
                socket.emit("obtener_logros_usuario", { id_usuario: data.id_usuario });
            });
        });


    // 🟠 Cerrar sesión
socket.on('cerrar_sesion', (token) => {
    const usuario = sesionesActivas[token];

    if (usuario) {
        const updateSql = 'UPDATE usuario SET estatus = 0 WHERE id_usuario = ?';
        db.query(updateSql, [usuario.id_usuario], (updateErr) => {
            if (updateErr) {
                console.error('❌ Error al actualizar estatus:', updateErr);
            } else {
                console.log('🔴 Estatus actualizado a 0 para:', usuario.Nombre);
            }
        });
    }
    delete sesionesActivas[token];
    socket.emit('sesion_cerrada', { success: true, message: 'Sesión cerrada exitosamente' });
});

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado');
    });
    

// Código nuevo para las videollamadas
// Manejadores para el videochat
socket.on('joinRoom', (roomId) => {
  socket.join(roomId);
  console.log(`Socket ${socket.id} se unió a la sala de video: ${roomId}`);

  const room = io.sockets.adapter.rooms.get(roomId);
  if (room && room.size === 2) {
    console.log(`🎥 Sala ${roomId} tiene dos usuarios.`);
    
    // 👉 Emitir evento para que los dos usuarios inicien WebRTC
    io.to(roomId).emit('readyToCall');
  }
});

socket.on('offer', (data) => {
  console.log(`📡 Recibida oferta de ${socket.id} para la sala ${data.roomId}`);
  socket.to(data.roomId).emit('offer', data);
});

socket.on('answer', (data) => {
  console.log(`🔁 Recibida respuesta de ${socket.id} para la sala ${data.roomId}`);
  socket.to(data.roomId).emit('answer', data);
});

socket.on('iceCandidate', (data) => {
  console.log(`❄️ Recibido ICE Candidate de ${socket.id} para la sala ${data.roomId}`);
  socket.to(data.roomId).emit('iceCandidate', data);
});

});


// 🟢 Servidor escuchando en el puerto 2800
server.listen(2800, () => {
    console.log('🚀 Servidor WebSocket corriendo en: ', servidor.SERVER_URL);
});