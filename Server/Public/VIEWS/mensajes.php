<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mensajes Directos</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/mensajes.css" />
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>
    <div class="dm-container">
        <div class="sidebar">
            <h2>Chats</h2>

            <div class="search-container">
                <input type="text" id="Usuario" placeholder="Buscar usuario..." />
                <button class="btn-search">Buscar</button>
            </div>

            <ul class="chat-list">
                <li class="chat-item">
                    Usuario 1 <label class="recompensasUsuario">4⭐</label>
                    <label class="messageNotification">+1 mensaje</label>
                </li>
                <li class="chat-item">
                    Usuario 2 <label class="recompensasUsuario">1⭐</label>
                    <label class="messageNotification">+2 mensajes</label>
                </li>
                <li class="chat-item">
                    Usuario 3 <label class="recompensasUsuario">0⭐</label><label class="messageNotification"></label>
                </li>
            </ul>
        </div>

        <div class="chat-window">
            <div class="chat-header">
                <div class="user-info">
                    <h3>Usuario 1</h3>
                    <label class="estadoUsuario">Activo 🟢</label>
                </div>
                <label>Cifrado de mensajes: </label>
                <button id="cifrado-btn" class="cifrado-btn" onclick="toggleCifrado()">
                    Desactivado
                </button>

                <!--Script temporal para el boton de cifrado-->
                <script>
                function toggleCifrado() {
                    var button = document.getElementById("cifrado-btn");
                    button.classList.toggle("active");
                    if (button.classList.contains("active")) {
                        button.textContent = "Activado";
                    } else {
                        button.textContent = "Desactivado";
                    }
                }
                </script>

                <button id="videollamada-btn" onclick="location.href='videollamada'">
                    <img src="IMG/logovideollamada.png" alt="Icono" />
                </button>
            </div>

            <div class="chat-messages">
                <div class="message received">Ejemplo 1</div>
                <div class="message sent">Ejemplo 2</div>
            </div>

            <div class="message-input">
                <button id="imagenes-btn">
                    <img src="IMG/clip.png" alt="Icono" />
                </button>
                <button id="audio-btn">
                    <img src="IMG/logoaudio.png" alt="Icono" />
                </button>
                <button id="location-btn">
                    <img src="IMG/ubicacion.png" alt="Icono" />
                </button>
                <input type="text" placeholder="Escribe un mensaje..." id="message-box" />
                <button id="send-btn">Enviar</button>
            </div>
        </div>
    </div>

    <?php require 'TEMPLATES/footer.php'; ?>
    <?php require 'PHP/socket.php'; ?>
    <script src="CONF/server_url.js"></script>
    <script src="JS/header.js"></script>
    <script src="JS/mensajes.js"></script>
</body>

</html>