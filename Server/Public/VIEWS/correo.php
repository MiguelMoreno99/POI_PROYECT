<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Envio de Correo</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/correo.css" />
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>
    <div class="main-container">
        <div class="form-container">
            <form id="envio_correoForm">
                <div class="form-grupo">
                    <h2>Enviar Correo Electrónico</h2>
                    <label for="to">Para:</label>
                    <input type="email" id="email" name="to" />
                    <div class="error-message"></div>
                </div>

                <div class="form-grupo">
                    <label for="subject">Asunto:</label>
                    <input type="text" id="subject" name="subject" />
                    <div class="error-message"></div>
                </div>

                <div class="form-grupo">
                    <label for="message">Mensaje:</label>
                    <textarea id="message" name="message" rows="4"></textarea>
                    <div class="error-message"></div>
                </div>
                <br /><br />
                <button type="submit" id="sendBtn" class="btn">Enviar Correo</button>
            </form>
        </div>
    </div>
    <?php require 'TEMPLATES/footer.php'; ?>
    <?php require 'PHP/socket.php'; ?>
    <script src="JS/correo.js"></script>
    <script src="JS/header.js"></script>
</body>

</html>