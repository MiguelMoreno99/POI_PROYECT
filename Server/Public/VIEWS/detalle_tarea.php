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
                <h1>Análisis de Necesidades</h1>
                <p>Vence el 1 de febrero de 2025</p>
            </header>
            <section class="content">
                <h2>Instrucciones</h2>
                <p>
                    De modo individual, después de ver el video de la clase de esta
                    semana hacer un resumen. Incluir portada: 10 pts, Mínimo media
                    cuartilla de desarrollo: 30 pts, Identificación de necesidades: 20
                    pts, Justificación de necesidades identificadas con explicación
                    detallada: 30 pts, Conclusión: 10 pts
                </p>
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