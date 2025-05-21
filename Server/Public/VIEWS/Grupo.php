<!DOCTYPE html> 
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Detalle Grupo</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/grupo.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script> <!-- 🔐 CryptoJS -->
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>

    <div class="dm-container">
        <div class="sidebar">
            <h2 id="grupo-nombre">Cargando...</h2>
            <ul class="chat-list">
                <li class="chat-item" onclick="openModal('Agregar')">Agregar integrante</li>
                <li class="chat-item" onclick="openModal('Eliminar')">Eliminar integrante</li>
                <li class="chat-item" onclick="openModal('Salir')">Abandonar Grupo</li>
            </ul>
        </div>

        <!-- VENTANAS MODALES -->
        <div id="Agregar" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('Agregar')">&times;</span>
                <h2>Agregar integrante</h2>
                <ul id="lista-usuarios"></ul>
                <br />
                <button type="submit" id="agregar-btn">Agregar</button>
            </div>
        </div>

        <div id="Eliminar" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('Eliminar')">&times;</span>
                <h2>Eliminar integrante</h2>
                <ul id="lista-eliminar"></ul>
                <br />
                <button type="submit" id="eliminar-btn">Eliminar</button>
            </div>
        </div>

        <div id="Salir" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('Salir')">&times;</span>
                <h2>¿Estás seguro de abandonar este grupo?</h2>
                <br />
                <button type="submit" id="salir-btn">Confirmar</button>
            </div>
        </div>

        <!-- VENTANAS MODALES: FUNCIONES -->
        <script>
            function openModal(modalId) {
                document.getElementById(modalId).style.display = "block";
                if (modalId === "Agregar") {
                    socket.emit("Grupo_usuarios", { id_grupo });
                }
                if (modalId === "Eliminar") {
                    socket.emit("Grupo_usuario_eliminar", { id_grupo });
                }
            }

            function closeModal(modalId) {
                document.getElementById(modalId).style.display = "none";
            }
        </script>

        <div class="chat-window">
            <div class="chat-header">
                <div class="user-info">
                    <h3>Chat Grupal</h3>
                    <label>Cifrado de mensajes: </label>
                    <button id="cifrado-btn" class="cifrado-btn">Desactivado</button>
                    <small id="cifrado-aviso" style="color: green; display: none;">Los mensajes se están enviando cifrados.</small>
                </div>
            </div>

            <div class="chat-messages">
                <!-- Aquí se insertarán los mensajes dinámicamente -->
            </div>

            <div class="message-input">
                <button id="imagenes-btn">
                    <img src="IMG/clip.png" alt="Imagen" />
                </button>
                <input type="file" id="imagen-input" accept="image/*" style="display: none;" />
                <img id="imagen-preview" src="" alt="Vista previa" style="display: none; max-width: 200px; margin-top: 10px;" />

                <input type="text" placeholder="Escribe un mensaje..." id="message-box" />
                <button id="send-btn">Enviar</button>
            </div>
        </div>
    </div>

    <?php require 'TEMPLATES/footer.php'; ?>
    <?php require 'PHP/socket.php'; ?>
    <script src="CONF/server_url.js"></script>    
    <script src="JS/grupo.js"></script>
    <script src="JS/header.js"></script>
</body>

</html>
