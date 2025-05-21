// Conectar con el servidor mediante WebSockets
const socket = io(SERVER_URL);

// Obtener elementos del formulario
const tituloTareaInput = document.getElementById("tituloTareaInput");
const instruccionesTareaInput = document.getElementById("instruccionesTareaInput");
const FechaTareaInput = document.getElementById("FechaTareaInput");
const grupoSeleccionado = document.getElementById("grupoSeleccionado");
const crear_tareaBtn = document.getElementById("crear_tareaBtn");

// Obtener ID del usuario desde `localStorage`
const usuarioActualId = localStorage.getItem("idUsuario");

// Verificar si el usuario está autenticado
if (!usuarioActualId) {
    alert("Sesión expirada. Por favor, inicia sesión.");
    window.location.href = "inicio_sesion";
}

// 🔹 Solicitar los grupos creados por el usuario
document.addEventListener("DOMContentLoaded", function () {
    socket.emit("obtener_grupos_creados", { id_usuario: usuarioActualId });

    socket.on("lista_grupos_creados", (data) => {
        if (data.success) {
            grupoSeleccionado.innerHTML = '<option value="">Selecciona un grupo...</option>';

            data.grupos.forEach(grupo => {
                const option = document.createElement("option");
                option.value = grupo.id_grupo;
                option.textContent = grupo.Nombre;
                grupoSeleccionado.appendChild(option);
            });

            console.log("✅ Grupos cargados correctamente.");
        } else {
            console.error("❌ No se pudieron obtener los grupos:", data.message);
        }
    });
});

// 🔹 Manejar la creación de tareas
crear_tareaBtn.addEventListener("click", function (event) {
    event.preventDefault();

    if (tituloTareaInput.value.trim() && instruccionesTareaInput.value.trim() && FechaTareaInput.value) {
        const titulo = tituloTareaInput.value.trim();
        const descripcion = instruccionesTareaInput.value.trim();
        const fechaVencimiento = FechaTareaInput.value;
        const idGrupo = grupoSeleccionado.value;

        if (!idGrupo) {
            alert("Por favor, selecciona un grupo para la tarea.");
            return;
        }

        console.log("📡 Enviando nueva tarea al servidor:", { usuarioActualId, titulo, descripcion, fechaVencimiento, idGrupo });
        socket.emit("crear_tarea", { idUsuario: usuarioActualId, titulo, descripcion, fechaVencimiento, idGrupo });
    } else {
        alert("Por favor, completa todos los campos antes de enviar.");
    }
});

// 🔹 Obtener y mostrar las tareas del usuario
socket.emit("obtener_tareas_usuario", { id_usuario: usuarioActualId });

socket.on("lista_tareas_usuario", (data) => {
    if (data.success) {
        const tareasContainer = document.createElement("div");
        tareasContainer.classList.add("task-list");

        data.tareas.forEach(tarea => {
            const tareaElement = document.createElement("a");
            tareaElement.href = "detalle_tarea";
            tareaElement.classList.add("task");
            tareaElement.innerHTML = `
                <div class="date">${tarea.fecha_vencimiento}</div>
                <div class="details">
                    <h2>${tarea.titulo}</h2>
                    <p>Grupo: ${tarea.grupo}</p>
                    <p>${tarea.descripcion}</p>
                </div>
                <div class="status">${tarea.estatus === 0 ? "Pendiente" : "Completada"}</div>
            `;

            // Guardar ID de tarea y usuario en `localStorage`
            tareaElement.onclick = (event) => {
                event.preventDefault();
                localStorage.setItem("tareaSeleccionada", tarea.id_tarea);
                localStorage.setItem("usuarioSeleccionado", usuarioActualId);
                console.log("📌 ID de tarea guardado:", tarea.id_tarea);
                console.log("👤 ID de usuario guardado:", usuarioActualId);
                window.location.href = "detalle_tarea";
            };

            tareasContainer.appendChild(tareaElement);
        });

        const container = document.querySelector(".container");
        const header = document.querySelector(".task-header");
        const modal = document.getElementById("myModal");

        container.innerHTML = "";
        container.appendChild(header);
        container.appendChild(modal);
        container.appendChild(tareasContainer);

        console.log("✅ Tareas cargadas correctamente.");
    } else {
        console.error("❌ No se pudieron obtener las tareas.");
    }
});

// 🔹 Escuchar respuesta del servidor sobre la creación de la tarea
socket.on("tarea_creada", (data) => {
    if (data.success) {
        alert(`✅ La tarea "${data.titulo}" ha sido creada exitosamente.`);
        closeModal();
        socket.emit("obtener_tareas_usuario", { id_usuario: usuarioActualId });
    } else {
        alert("❌ Hubo un error al crear la tarea.");
    }
});

// 🔹 Funciones para abrir y cerrar el modal de creación de tareas
function openModal() {
    document.getElementById("myModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}