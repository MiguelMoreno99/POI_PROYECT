document.addEventListener("DOMContentLoaded", function () {
    const socket = io(SERVER_URL); // Conectar al servidor con WebSockets
    const logrosContainer = document.querySelector(".rewards"); // Mantener la estructura original
    const usuarioActualId = localStorage.getItem("idUsuario");
    const token = localStorage.getItem("token");

    if (!usuarioActualId || !token) {
        alert("Sesión expirada. Por favor, inicia sesión.");
        window.location.href = "inicio_sesion";
        return;
    }

    // Validar sesión
    socket.emit("validar_sesion", token);

    socket.on("validar_respuesta", (respuesta) => {
        if (respuesta.success) {
            console.log("✅ Sesión válida para el usuario:", respuesta.usuario.Nombre);
            socket.emit("obtener_logros_usuario", { id_usuario: usuarioActualId });
        } else {
            alert("⚠️ Tu sesión ya no es válida. Por favor, inicia sesión nuevamente.");
            localStorage.removeItem("token");
            window.location.href = "inicio_sesion";
        }
    });

    // Obtener logros del usuario y mostrarlos dentro de la estructura `.rewards`
    socket.on("lista_logros_usuario", (data) => {
        if (data.success) {
            logrosContainer.innerHTML = "";

            data.logros.forEach(logro => {
                const logroElement = document.createElement("div");
                logroElement.classList.add("reward");
                logroElement.innerHTML = `
                    <h1>${logro.estatus === 0 ? "❌" : "✅"}</h1>
                    <p>${logro.Nombre}</p>
                `;

                logrosContainer.appendChild(logroElement);
            });

            console.log("✅ Logros cargados correctamente.");
        } else {
            logrosContainer.innerHTML = "<p>❌ Error al cargar logros</p>";
            console.log("⚠️ No se pudieron obtener los logros.");
        }
    });
});