<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Grupos</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/grupos.css" />
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>
    <main class="registro-contenedor">
        <div class="container">
            <div class="teams-header">
                <h1>Grupos</h1>
                <button id="crear-grupo-btn" class="btn crear-grupo" onclick="openModal()">
                    Crear grupo
                </button>
                <!--VENTANA MODAL PARA CREAR GRUPO-->
                <div id="myModal" class="modal">
                    <div class="modal-content">
                        <div class="form-grupo">
                            <h2>Nuevo Grupo</h2>
                            <input type="text" id="nombreGrupo" placeholder="Ingresa el nombre del grupo" />
                            <div class="error-message"></div>
                            <br />
                        </div>
                        <button type="submit" id="crear_grupoBtn" class="btn creargrupo">
                            Crear Grupo
                        </button>
                        <button class="btn close" onclick="closeModal()">Cancelar</button>
                    </div>
                </div>
                <!--VENTANA MODAL PARA CREAR GRUPO-->
            </div>
            <br />
            <div class="teams-container">
                <br />
                <div class="teams" id="teams-list">
                    <!-- Los grupos se generarán dinámicamente aquí -->
                </div>
            </div>
        </div>
    </main>

    <?php require 'TEMPLATES/footer.php'; ?>
    <?php require 'PHP/socket.php'; ?>
    <script src="CONF/server_url.js"></script>
    <script src="JS/grupos.js"></script>
    <script src="JS/header.js"></script>
</body>

</html>