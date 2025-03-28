<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Detalle Grupo</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/grupo.css" />
</head>

<body>
    <?php require 'TEMPLATES/header.php'; ?>
    <div class="dm-container">
        <div class="sidebar">
            <h2>"Nombre del grupo"</h2>
            <ul class="chat-list">
                <li class="chat-item" onclick="openModal('Agregar')">
                    Agregar integrante
                </li>
                <li class="chat-item" onclick="openModal('Eliminar')">
                    Eliminar integrante
                </li>
                <li class="chat-item" onclick="openModal('Salir')">
                    Abandonar Grupo
                </li>
            </ul>
        </div>

        <!--VENTANAS MODALES-->
        <div id="Agregar" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('Agregar')">&times;</span>
                <h2>Agregar integrante</h2>
                <br />
                <h3>Selecciona</h3>
                <ul>
                    <li><input type="checkbox" name="" id="" />usuario1@email.com</li>
                    <li><input type="checkbox" name="" id="" />usuario2@email.com</li>
                    <li><input type="checkbox" name="" id="" />usuario3@email.com</li>
                </ul>
                <br />
                <button type="submit">Agregar</button>
            </div>
        </div>

        <div id="Eliminar" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('Eliminar')">&times;</span>
                <h2>Eliminar integrante</h2>
                <br />
                <h3>Selecciona</h3>
                <ul>
                    <li><input type="checkbox" name="" id="" />usuario1@email.com</li>
                    <li><input type="checkbox" name="" id="" />usuario2@email.com</li>
                    <li><input type="checkbox" name="" id="" />usuario3@email.com</li>
                </ul>
                <br />
                <button type="submit">Eliminar</button>
            </div>
        </div>

        <div id="Salir" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('Salir')">&times;</span>
                <h2>¿Estas seguro de abandonar este grupo?</h2>
                <br />
                <button type="submit">Confirmar</button>
            </div>
        </div>

        <!--SCRIPT PROVISIONAL PARA VENTANAS-->
        <script>
        function openModal(Agregar) {
            document.getElementById(Agregar).style.display = "block";
        }

        function closeModal(Agregar) {
            document.getElementById(Agregar).style.display = "none";
        }

        function openModal(Eliminar) {
            document.getElementById(Eliminar).style.display = "block";
        }

        function closeModal(Eliminar) {
            document.getElementById(Eliminar).style.display = "none";
        }

        function openModal(Salir) {
            document.getElementById(Salir).style.display = "block";
        }

        function closeModal(Salir) {
            document.getElementById(Salir).style.display = "none";
        }
        </script>
        <!--VENTANAS MODALES-->

        <div class="chat-window">
            <div class="chat-header">
                <div class="user-info">
                    <h3>Chat Grupal</h3>
                    <label>Cifrado de mensajes: </label>
                    <button id="cifrado-btn" class="cifrado-btn" onclick="toggleCifrado()">
                        Desactivado
                    </button>

                    <!--Script temporal para el boton de cifrado-->
                    <script>
                    function toggleCifrado() {
                        var button = document.getElementById("cifrado-btn");
                        button.classList.toggle("active");
                        if (button.classList.contains("active")) {
                            button.textContent = "Activado";
                        } else {
                            button.textContent = "Desactivado";
                        }
                    }
                    </script>
                </div>
            </div>

            <div class="chat-messages">
                <label for="" class="user">Usuario 1 🟢</label>
                <div class="message received">Ejemplo 1</div>
                <label for="" class="user">Yo</label>
                <div class="message sent">Ejemplo 2</div>
                <label for="" class="user">Usuario 2 🔴</label>
                <div class="message received">Ejemplo 3</div>
            </div>

            <div class="message-input">
                <button id="imagenes-btn">
                    <img src="IMG/clip.png" alt="Icono" />
                </button>
                <button id="audio-btn">
                    <img src="IMG/logoaudio.png" alt="Icono" />
                </button>
                <button id="location-btn">
                    <img src="IMG/ubicacion.png" alt="Icono" />
                </button>
                <input type="text" placeholder="Escribe un mensaje..." id="message-box" />
                <button id="send-btn">Enviar</button>
            </div>
        </div>
    </div>

    <?php require 'TEMPLATES/footer.php'; ?>
    <?php require 'PHP/socket.php'; ?>
    <script src="CONF/server_url.js"></script>
    <script src="JS/header.js"></script>
</body>

</html>