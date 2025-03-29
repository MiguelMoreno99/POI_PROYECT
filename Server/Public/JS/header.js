document.addEventListener("DOMContentLoaded", function () {
  const socket = io("http://192.168.100.9:2800"); // Conectar al servidor con Socket.IO
  // const socket = io("http://192.168.100.17:2800"); // Conectar al servidor con Socket.IO
  const token = localStorage.getItem("token"); // Recuperar el token
  const navList = document.getElementById("nav-list");
  const userInfo = document.getElementById("user-info");
  const linkInicioSesion = document.getElementById("link-inicio-sesion");
  const linkRegistro = document.getElementById("link-registro");
  const cerrarSesionLink = document.getElementById("cerrar-sesion");

  if (token) {
    // Validar la sesión con el servidor
    socket.emit("validar_sesion", token);
  } else {
    // Mostrar los enlaces de "Inicio de Sesión" y "Registrarse"
    linkInicioSesion.style.display = "block";
    linkRegistro.style.display = "block";
    cerrarSesionLink.style.display = "none"; // Ocultar el botón de "Cerrar Sesión"
  }

  // Manejar la respuesta del servidor sobre la validación de la sesión
  socket.on("validar_respuesta", (respuesta) => {
    if (respuesta.success) {
      const usuario = respuesta.usuario;
      userInfo.textContent = `Bienvenido, ${usuario.Nombre}`;
      linkInicioSesion.style.display = "none"; // Ocultar "Iniciar Sesión"
      linkRegistro.style.display = "none"; // Ocultar "Registrarse"
      cerrarSesionLink.style.display = "block"; // Mostrar "Cerrar Sesión"
    } else {
      // Si la sesión no es válida, mostrar los enlaces de inicio y registro
      linkInicioSesion.style.display = "block";
      linkRegistro.style.display = "block";
      cerrarSesionLink.style.display = "none"; // Ocultar el botón de "Cerrar Sesión"
      localStorage.removeItem("token"); // Limpiar el token inválido
    }
  });

  // Manejar el cierre de sesión
  cerrarSesionLink.addEventListener("click", (event) => {
    event.preventDefault();
    socket.emit("cerrar_sesion", token);
  });

  socket.on("sesion_cerrada", (respuesta) => {
    if (respuesta.success) {
      localStorage.removeItem("token"); // Eliminar el token almacenado
      alert(respuesta.message); // Mostrar mensaje
      window.location.href = "inicio_sesion"; // Redirigir al inicio de sesión
    }
  });
});
