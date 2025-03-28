<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inicio de Sesión</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/inicio_sesion.css" />
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>
    <main class="registro-contenedor">
        <div class="registro-caja">
            <h2>Iniciar Sesión</h2>

            <form id="inicio_sesionForm">
                <div class="form-grupo">
                    <label for="correo_usuario">Correo Electrónico</label>
                    <input id="email" type="email" name="correo_usuario" autocomplete="username" />
                    <div class="error-message"></div>
                </div>

                <div class="form-grupo">
                    <label for="contrasenia_usuario">Contraseña</label>
                    <input id="password" type="password" name="contrasenia_usuario" autocomplete="current-password" />
                    <div class="error-message"></div>
                </div>

                <button type="submit" id="loginBtn" class="btn">
                    Iniciar Sesión
                </button>
                <br /><br />
                <div class="form-grupo">
                    <label>¿No tienes una cuenta?</label>
                    <a href="registro_usuario">Registrarse</a>
                </div>
            </form>
        </div>
    </main>

    <?php require 'TEMPLATES/footer.php'; ?>
    <script src="http://localhost:2800/socket.io/socket.io.js"></script>
    <script src="JS/header.js"></script>
    <script src="JS/inicio_sesion.js"></script>
</body>

</html>