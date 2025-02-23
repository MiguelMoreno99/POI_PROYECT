document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todos los campos
    const marcarTareaBtn = document.getElementById('marcarTareaBtn');

    // Manejar el envío del formulario
    marcarTareaBtn.addEventListener('click', function (event) {
        event.preventDefault();
        alert("¡TAREA TERMINADA CON EXITO");
        window.location.href = "tareas.html";
    });
});