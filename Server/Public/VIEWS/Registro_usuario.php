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

            <form id="inicio_sesionForm">
                <div class="form-grupo">
                    <label for="Nombre">Nombre(s):</label>
                    <input type="text" id="nombre" name="nombre_usuario" />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <label for="Usuario">Apellido paterno:</label>
                    <input type="text" id="apellido_paterno" name="apellido_paterno" />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <label for="Usuario">Apellido materno:</label>
                    <input type="text" id="apellido_materno" name="apellido_materno" />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <label for="email">Correo electrónico:</label>
                    <input type="text" id="email" name="correo_usuario" autocomplete="username" />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="contrasenia_usuario" autocomplete="new-password" />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <label for="confirm_password">Confirmar contraseña:</label>
                    <input type="password" id="confirm_password" name="confirm_contrasenia"
                        autocomplete="new-password" />
                    <div class="error-message"></div>
                </div>
                <div class="form-grupo">
                    <img class="profilePreview" id="profilePreview" src="IMG/perfil.webp" alt="Foto de perfil" />
                    <input type="file" id="foto" name="imagen_usuario" accept="image/*" onchange="loadFile(event)" />
                    <div class="error-message"></div>
                </div>
                <button type="submit" id="registerBtn" class="btn">
                    Registrarse
                </button>
            </form>
        </div>
    </main>

    <?php require 'TEMPLATES/footer.php'; ?>
    <script src="http://localhost:2800/socket.io/socket.io.js"></script>
    <script src="JS/registro_usuario.js"></script>
    <script src="JS/header.js"></script>
</body>

</html>