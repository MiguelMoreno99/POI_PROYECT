<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registro de Usuario</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/registro.css" />
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>
    <main class="registro-contenedor">
        <div class="registro-caja">
            <h2>Registro de Usuario</h2>

            <!-- Formulario con enctype para permitir el envío de imágenes -->
            <form id="inicio_sesionForm" enctype="multipart/form-data">
                <div class="form-grupo">
                    <label for="Nombre">Nombre(s):</label>
                    <input type="text" id="nombre" name="nombre_usuario" required />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <label for="Usuario">Apellido paterno:</label>
                    <input type="text" id="apellido_paterno" name="apellido_paterno" required />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <label for="Usuario">Apellido materno:</label>
                    <input type="text" id="apellido_materno" name="apellido_materno" required />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <label for="email">Correo electrónico:</label>
                    <input type="email" id="email" name="correo_usuario" autocomplete="username" required />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="contrasenia_usuario" autocomplete="new-password" required />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <label for="confirm_password">Confirmar contraseña:</label>
                    <input type="password" id="confirm_password" name="confirm_contrasenia" autocomplete="new-password" required />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <label for="foto">Foto de Perfil:</label><br /><br />
                    <img class="profilePreview" id="profilePreview" src="imagenes/default.png" alt="Foto de perfil" /><br /><br />
                    <input type="file" id="foto" name="imagen_usuario" accept="image/*" onchange="previewImage(event)" />
                    <div class="error-message"></div>
                </div>
                <button type="submit" id="registerBtn" class="btn">
                    Registrarse
                </button>
            </form>
        </div>
    </main>

    <?php require 'TEMPLATES/footer.php'; ?>
    <?php require 'PHP/socket.php'; ?>
    <script src="CONF/server_url.js"></script>
    <script src="JS/registro_usuario.js"></script>
    <script src="JS/header.js"></script>
    
    <script>
        // Previsualizar imagen antes de enviarla
        function previewImage(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById("profilePreview").src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    </script>
</body>

</html>