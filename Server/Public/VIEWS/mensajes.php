<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mensajes Directos</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/mensajes.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
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

            <ul class="chat-list"></ul> <!-- Esta lista se llena dinámicamente -->
        </div>

        <div class="chat-window">
            <div class="chat-header">
                <div class="user-info">
                    <h3>Usuario</h3>
                </div>
                
                <label>Cifrado de mensajes: </label>
                <button id="cifrado-btn" class="cifrado-btn" disabled>
                    Desactivado
                </button>

                <button id="videollamada-btn">
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
    <script src="JS/header.js"></script>
    <script src="JS/mensajes.js"></script>
</body>

</html>
