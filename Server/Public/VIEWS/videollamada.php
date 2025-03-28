<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pantalla de Videollamada</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/videollamada.css" />
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>
    <div class="main-container">
        <div class="videocall-container">
            <div class="video-feed">
                <img src="IMG/perfil.webp" alt="Video Placeholder" />
            </div>
            <div class="controls">
                <button id="Camera-On">Enceder Cámara</button>
                <button id="Camera-Off">Apagar Cámara</button>
                <button id="Colgar" onclick="location.href='mensajes'">Colgar</button>
            </div>
        </div>
    </div>
    <?php require 'TEMPLATES/footer.php'; ?>
    <script src="http://localhost:2800/socket.io/socket.io.js"></script>
    <script src="JS/header.js"></script>
</body>

</html>