// Seleccionar todos los campos
const nombreInput = document.getElementById("nombre");
const apellidoPaternoInput = document.getElementById("apellido_paterno");
const apellidoMaternoInput = document.getElementById("apellido_materno");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm_password");
const fotoInput = document.getElementById("foto");
const profilePreview = document.getElementById("profilePreview");
const registerBtn = document.getElementById("registerBtn");
const socket = io(SERVER_URL); // Conectar al servidor con Socket.IO

// Expresiones regulares para validación
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Correo válido
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/; // Contraseña válida
const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Solo letras y espacios

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

// Validación de cada campo
function validarNombre() {
  let isValid = true;
  if (nombreInput.value.trim() === "") {
    showError(nombreInput, "El nombre es obligatorio.");
    isValid = false;
  } else if (!nombreRegex.test(nombreInput.value)) {
    showError(nombreInput, "Solo se permiten letras y espacios.");
    isValid = false;
  } else {
    clearError(nombreInput);
  }
  return isValid;
}

function validarApellidoPaterno() {
  let isValid = true;
  if (apellidoPaternoInput.value.trim() === "") {
    showError(apellidoPaternoInput, "El apellido paterno es obligatorio.");
    isValid = false;
  } else if (!nombreRegex.test(apellidoPaternoInput.value)) {
    showError(apellidoPaternoInput, "Solo se permiten letras y espacios.");
    isValid = false;
  } else {
    clearError(apellidoPaternoInput);
  }
  return isValid;
}

function validarApellidoMaterno() {
  let isValid = true;
  if (apellidoMaternoInput.value.trim() === "") {
    showError(apellidoMaternoInput, "El apellido materno es obligatorio.");
    isValid = false;
  } else if (!nombreRegex.test(apellidoMaternoInput.value)) {
    showError(apellidoMaternoInput, "Solo se permiten letras y espacios.");
    isValid = false;
  } else {
    clearError(apellidoMaternoInput);
  }
  return isValid;
}

function validarCorreo() {
  let isValid = true;
  if (!emailRegex.test(emailInput.value)) {
    showError(emailInput, "Correo electrónico no válido.");
    isValid = false;
  } else {
    clearError(emailInput);
  }
  return isValid;
}

function validarContrasenia() {
  let isValid = true;
  if (!passwordRegex.test(passwordInput.value)) {
    showError(
      passwordInput,
      "La contraseña debe tener al menos 8 caracteres, 1 número, 1 mayúscula, 1 minúscula y 1 carácter especial."
    );
    isValid = false;
  } else {
    clearError(passwordInput);
  }
  return isValid;
}

function validarContraseniaIgual() {
  let isValid = true;
  if (passwordInput.value !== confirmPasswordInput.value) {
    showError(confirmPasswordInput, "Las contraseñas no coinciden.");
    isValid = false;
  } else {
    clearError(confirmPasswordInput);
  }
  return isValid;
}

// Validar imagen antes de enviarla
function validarImagen() {
  let isValid = true;
  if (!fotoInput.files || fotoInput.files.length === 0) {
    showError(fotoInput, "Debes seleccionar una imagen.");
    isValid = false;
  } else {
    clearError(fotoInput);
  }
  return isValid;
}

// Validar el formulario antes de enviarlo
function validarFormulario() {
  return (
    validarNombre() &&
    validarApellidoPaterno() &&
    validarApellidoMaterno() &&
    validarCorreo() &&
    validarContrasenia() &&
    validarContraseniaIgual() &&
    validarImagen()
  );
}

// Función para subir la imagen al servidor
function subirImagen(id_usuario, file) {
  const formData = new FormData();
  formData.append("imagen_usuario", file);
  formData.append("id_usuario", id_usuario);

  fetch(`${SERVER_URL}/subir_imagen`, {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log("✅ Imagen subida correctamente:", data.ruta);
      } else {
        console.error("❌ Error al subir imagen:", data.message);
      }
    })
    .catch(error => console.error("❌ Error de red:", error));
}

// Manejar el envío del formulario
registerBtn.addEventListener("click", function (event) {
  event.preventDefault();

  if (validarFormulario()) {
    const usuarioData = {
      nombre: nombreInput.value.trim(),
      apellido_paterno: apellidoPaternoInput.value.trim(),
      apellido_materno: apellidoMaternoInput.value.trim(),
      correo: emailInput.value.trim(),
      contrasenia: passwordInput.value.trim()
    };

    socket.emit("registrar_usuario", usuarioData);

    // Escuchar respuesta del servidor y subir imagen
    socket.on("registro_respuesta", (respuesta) => {
      if (respuesta.success) {
        const id_usuario = respuesta.insertId; // Obtener ID del usuario
        alert("✅ Registro exitoso. Serás redirigido a la página de inicio de sesión.");
        if (fotoInput.files.length > 0) {
          subirImagen(id_usuario, fotoInput.files[0]); // Subir imagen
        }
      } else {
        alert("❌ Error al registrar usuario: " + respuesta.message);
      }
    });
  } else {
    alert("Por favor, corrige los errores antes de enviar.");
  }
});

// Previsualizar imagen antes de enviarla
fotoInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profilePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});