<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recompensas</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/recompensas.css" />
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>

    <div class="registro-contenedor">
        <main class="registro-contenedor">
            <div class="container">
                <div class="rewards-header">
                    <h1>Recompensas</h1>
                </div>
                <br />
                <div class="rewards-container">
                    <br />
                    <br />
                    <div class="rewards">
                        <div class="reward">
                            <h1>☑️</h1>
                            <p>Completa una tarea</p>
                            <p>1/1</p>
                        </div>
                        <div class="reward">
                            <h1>✏️</h1>
                            <p>Agrega una tarea</p>
                            <p>0/1</p>
                        </div>
                        <div class="reward">
                            <h1>🔥</h1>
                            <p>Completa 3 tareas</p>
                            <p>2/3</p>
                        </div>
                        <div class="reward">
                            <h1>📝</h1>
                            <p>Agrega 3 tareas</p>
                            <p>0/3</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <?php require 'TEMPLATES/footer.php'; ?>
    <?php require 'PHP/socket.php'; ?>
    <script src="CONF/server_url.js"></script>
    <script src="JS/header.js"></script>
</body>

</html>