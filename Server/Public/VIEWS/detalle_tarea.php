<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Detalle Tarea</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/detalle_tarea.css" />
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>

    <div class="registro-contenedor">
        <div class="container">
            <header class="header">
                <h1 id="titulo-tarea">Cargando tarea...</h1>
                <p id="fecha-vencimiento">Cargando fecha de vencimiento...</p>
            </header>
            <section class="content">
                <h2>Instrucciones</h2>
                <p id="descripcion-tarea">Cargando instrucciones...</p>
            </section>
            <div class="button-container">
                <button type="submit" id="marcarTareaBtn" class="btn">
                    Marcar como realizada
                </button>
            </div>
        </div>
    </div>

    <?php require 'TEMPLATES/footer.php'; ?>
    <?php require 'PHP/socket.php'; ?>
    <script src="CONF/server_url.js"></script>
    <script src="JS/detalle_tarea.js"></script>
    <script src="JS/header.js"></script>
</body>

</html>