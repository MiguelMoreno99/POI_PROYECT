<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Perfil</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/usuario.css" />
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>

    <div class="registro-contenedor">
        <div class="Header-Container">
            <div class="divProfile">
                <h1>usuario@email.com</h1>
                <img src="IMG/perfil.webp" alt="imagen" />
                <h1>4⭐</h1>
            </div>
        </div>

        <div class="Info-Container">
            <div class="divInfo">
                <form id="info_usuarioForm">
                    <div class="form-grupo">
                        <label for="Nombre">Nombre(s):</label>
                        <input type="text" id="nombre" name="nombre_usuario" value="Juan Alberto"
                            autocomplete="username" />
                        <div class="error-message"></div>
                    </div>
                    <div class="form-grupo">
                        <label for="Usuario">Apellido paterno:</label>
                        <input type="text" id="apellido_paterno" name="apellido_paterno" value="Pérez"
                            autocomplete="username" />
                        <div class="error-message"></div>
                    </div>
                    <div class="form-grupo">
                        <label for="Usuario">Apellido materno:</label>
                        <input type="text" id="apellido_materno" name="apellido_materno" value="Rodriguez"
                            autocomplete="username" />
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
                        <label for="select_image">Foto de Perfil:</label><br /><br />
                        <img class="profilePreview" id="profilePreview" src="IMG/perfil.webp" alt="Foto de perfil" />
                        <br /><br />
                        <input type="file" id="foto" name="imagen_usuario" accept="image/*"
                            onchange="loadFile(event)" />
                        <div class="error-message"></div>
                    </div>
                    <button type="submit" id="guardar_cambiosBtn" class="btn">
                        Guardar Cambios
                    </button>
                </form>
            </div>
            <div class="divLogros-Container">
                <div class="divLogros">
                    <h1>Logros Obtenidos</h1>
                    <ul>
                        <li>Completa 3 tareas</li>
                        <li>Completa 2 tareas</li>
                        <li>Asigna 3 tareas</li>
                        <li>Asigna 2 tareas</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <?php require 'TEMPLATES/footer.php'; ?>
    <?php require 'PHP/socket.php'; ?>
    <script src="CONF/server_url.js"></script>
    <script src="JS/usuario.js"></script>
    <script src="JS/header.js"></script>
</body>

</html>