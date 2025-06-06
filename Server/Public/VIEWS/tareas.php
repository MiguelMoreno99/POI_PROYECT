<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tareas</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/tareas.css" />
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>
    <div class="container">
        <div class="task-header">
            <h1>Tareas</h1>
            <button class="btn crear" onclick="openModal()">Crear Tarea</button>

            <!--VENTANA MODAL PARA CREAR TAREA-->
            <div id="myModal" class="modal">
                <div class="modal-content">
                    <div class="form-grupo">
                        <h2>Titulo tarea</h2>
                        <input type="text" id="tituloTareaInput" placeholder="Ingresa el nombre de la tarea" />
                        <div class="error-message"></div>
                    </div>

                    <div class="form-grupo">
    <h3>Seleccionar Grupo</h3>
    <select id="grupoSeleccionado">
        <option value="">Selecciona un grupo...</option>
        <!-- Los grupos se insertarán dinámicamente aquí -->
    </select>
    <div class="error-message"></div>
</div>

                    <div class="form-grupo">
                        <h3>Instrucciones</h3>
                        <textarea id="instruccionesTareaInput" name="instruccionesTarea" rows="6"></textarea>
                        <div class="error-message"></div>
                    </div>

                    <div class="form-grupo">
                        <h3>Fecha de entrega</h3>
                        <input type="date" id="FechaTareaInput" />
                        <div class="error-message"></div>
                    </div>

                    <button type="submit" id="crear_tareaBtn" class="btn">
                        Crear Tarea
                    </button>
                    <button class="btn close" onclick="closeModal()">Cancelar</button>
                </div>
            </div>
            <!--VENTANA MODAL PARA CREAR TAREA-->
        </div>
        <br />
        <a href="detalle_tarea" class="task">
            <div class="date">Fecha de entrega</div>
            <div class="details">
                <h2>Titulo de la tarea</h2>
                <p>Fecha de entregado</p>
            </div>
            <div class="status">Estatus</div>
        </a>

        <a href="detalle_tarea" class="task">
            <div class="date">Fecha de entrega</div>
            <div class="details">
                <h2>Titulo de la tarea</h2>
                <p>Fecha de entregado</p>
            </div>
            <div class="status">Estatus</div>
        </a>

        <a href="detalle_tarea" class="task">
            <div class="date">Fecha de entrega</div>
            <div class="details">
                <h2>Titulo de la tarea</h2>
                <p>Fecha de entregado</p>
            </div>
            <div class="status">Estatus</div>
        </a>

        <a href="detalle_tarea" class="task">
            <div class="date">Fecha de entrega</div>
            <div class="details">
                <h2>Titulo de la tarea</h2>
                <p>Fecha de entregado</p>
            </div>
            <div class="status">Estatus</div>
        </a>

        <a href="detalle_tarea" class="task">
            <div class="date">Fecha de entrega</div>
            <div class="details">
                <h2>Titulo de la tarea</h2>
                <p>Fecha de entregado</p>
            </div>
            <div class="status">Estatus</div>
        </a>

        <a href="detalle_tarea" class="task">
            <div class="date">Fecha de entrega</div>
            <div class="details">
                <h2>Titulo de la tarea</h2>
                <p>Fecha de entregado</p>
            </div>
            <div class="status">Estatus</div>
        </a>
    </div>
    <?php require 'TEMPLATES/footer.php'; ?>
    <?php require 'PHP/socket.php'; ?>
    <script src="CONF/server_url.js"></script>
    <script src="JS/tareas.js"></script>
    <script src="JS/header.js"></script>
</body>

</html>