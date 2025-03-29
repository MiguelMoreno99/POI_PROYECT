// Seleccionar todos los campos
const nombreInput = document.getElementById("nombreGrupo");
const crear_grupoBtn = document.getElementById("crear_grupoBtn");

// Función para mostrar errores
function showError(input, message) {
  const errorMessage = input.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    input.classList.add("invalid");
  }
}
// Función para limpiar errores
function clearError(input) {
  const errorMessage = input.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
    input.classList.remove("invalid");
  }
}

// Escuchar cambios en los campos
nombreInput.addEventListener("input", function () {
  validarNombre();
});

//Funciones para validar los campos
function validarNombre() {
  let isValid = true;
  if (nombreInput.value.trim() === "") {
    showError(nombreInput, "El nombre del grupo es obligatorio.");
    isValid = false;
  } else {
    clearError(nombreInput);
  }
  return isValid;
}
function validarFormulario() {
  let isValid = true; // Se asume que todo está correcto

  if (!validarNombre()) isValid = false;

  return isValid; // Retorna false si hay al menos un error
}

// Manejar el envío del formulario
crear_grupoBtn.addEventListener("click", function (event) {
  event.preventDefault();
  if (validarFormulario()) {
    const name = document.getElementById("nombreGrupo").value;
    alert(name + " se ha Creado!");
    closeModal();
    window.location.href = "grupos";
  } else {
    alert("Por favor, corrige los errores antes de enviar.");
    return false; // Evita el envío si hay errores
  }
});

function openModal() {
  document.getElementById("myModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  //   const socket = io("http://192.168.100.9:2800"); // Conectar al servidor con Socket.IO
  const socket = io("http://192.168.100.17:2800"); // Conectar al servidor con Socket.IO

  // Obtener el token de sesión del almacenamiento local
  const token = localStorage.getItem("token");
  if (token) {
    // Validar la sesión con el servidor
    socket.emit("validar_sesion", token);
  } else {
    // Redirigir al inicio de sesión si no hay un token
    alert("Sesión expirada. Por favor, inicia sesión.");
    window.location.href = "inicio_sesion";
  }

  // Escuchar la respuesta del servidor sobre la validación de la sesión
  socket.on("validar_respuesta", (respuesta) => {
    if (!respuesta.success) {
      // Si la sesión no es válida, redirigir al inicio de sesión
      alert("Tu sesión ya no es válida. Por favor, inicia sesión nuevamente.");
      localStorage.removeItem("token"); // Eliminar el token inválido
      window.location.href = "inicio_sesion";
    } else {
      console.log("Sesión válida para el usuario:", respuesta.usuario.Nombre);
    }
  });

  // Escuchar desconexión del servidor (opcional)
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
