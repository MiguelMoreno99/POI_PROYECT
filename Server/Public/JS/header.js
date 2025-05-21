document.addEventListener("DOMContentLoaded", function () {
  const socket = io(SERVER_URL); // Conectar con el servidor
  const token = localStorage.getItem("token"); // Recuperar el token
  const userInfo = document.getElementById("user-info");
  const cerrarSesionLink = document.getElementById("cerrar-sesion");
  const linkInicioSesion = document.getElementById("link-inicio-sesion");
  const linkRegistro = document.getElementById("link-registro");

  if (token) {
    socket.emit("validar_sesion", token);
  } else {
    // 🔹 El usuario no ha iniciado sesión, ocultar "Cerrar Sesión"
    cerrarSesionLink.style.display = "none";
  }

  socket.on("validar_respuesta", (respuesta) => {
    if (respuesta.success) {
      const usuario = respuesta.usuario;
      userInfo.textContent = `Bienvenido, ${usuario.Nombre}`;

      // 🔹 Ocultar los botones de "Inicio de Sesión" y "Registrarse"
      linkInicioSesion.style.display = "none";
      linkRegistro.style.display = "none";

      // 🔹 Mostrar "Cerrar Sesión"
      cerrarSesionLink.style.display = "block";
    } else {
      localStorage.removeItem("token"); // Limpiar el token inválido

      // 🔹 Si la sesión no es válida, mostrar "Inicio de Sesión" y "Registrarse"
      linkInicioSesion.style.display = "block";
      linkRegistro.style.display = "block";

      // 🔹 Ocultar "Cerrar Sesión"
      cerrarSesionLink.style.display = "none";
    }
  });

  cerrarSesionLink.addEventListener("click", (event) => {
    event.preventDefault();
    socket.emit("cerrar_sesion", token);
  });
});