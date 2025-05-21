// Conectar con el servidor mediante WebSockets
const socket = io(SERVER_URL);

// Obtener elementos de la página
const tituloTarea = document.getElementById("titulo-tarea");
const fechaVencimiento = document.getElementById("fecha-vencimiento");
const descripcionTarea = document.getElementById("descripcion-tarea");
const marcarTareaBtn = document.getElementById("marcarTareaBtn");

// Recuperar los IDs de `localStorage`
const idTareaSeleccionada = localStorage.getItem("tareaSeleccionada");
const usuarioActualId = localStorage.getItem("idUsuario");

if (!idTareaSeleccionada || !usuarioActualId) {
    alert("Error: No se encontró la tarea o el usuario. Redirigiendo...");
    window.location.href = "tareas.php";
} else {
    console.log("📌 ID de tarea cargado:", idTareaSeleccionada);
    console.log("👤 ID de usuario cargado:", usuarioActualId);

    // Solicitar detalles de la tarea al servidor
    socket.emit("obtener_detalle_tarea", { id_tarea: idTareaSeleccionada, id_usuario: usuarioActualId });

socket.on("detalle_tarea_respuesta", (data) => {
    if (data.success) {
        tituloTarea.textContent = data.tarea.titulo;

        // 🔄 Convertir la fecha a un formato legible
        const fechaOriginal = new Date(data.tarea.fecha_vencimiento);
        const fechaFormateada = fechaOriginal.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        fechaVencimiento.textContent = `Vence el ${fechaFormateada}`;
        descripcionTarea.textContent = data.tarea.descripcion;

        console.log("✅ Detalles de la tarea cargados correctamente.");
    } else {
        alert("❌ Error al cargar la tarea.");
        window.location.href = "tareas.php";
    }
});
}

// Manejar el botón "Marcar como realizada"
marcarTareaBtn.addEventListener("click", function () {
    console.log("📡 Marcando tarea como realizada...");

    socket.emit("marcar_tarea_completada", { id_tarea: idTareaSeleccionada, id_usuario: usuarioActualId });

    socket.on("tarea_marcada_respuesta", (data) => {
        if (data.success) {
            alert("✅ ¡Tarea marcada como completada con éxito!");
            window.location.href = "tareas";
        } else {
            alert(`❌ Hubo un error: ${data.message}`);
        }
    });
});