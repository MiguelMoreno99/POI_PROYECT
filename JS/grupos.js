document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todos los campos
    const nombreInput = document.getElementById('nombreGrupo');
    const crear_grupoBtn = document.getElementById('crear_grupoBtn');

    // Función para mostrar errores
    function showError(input, message) {
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            input.classList.add('invalid');
        }
    }

    // Función para limpiar errores
    function clearError(input) {
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
            input.classList.remove('invalid');
        }
    }

    // Escuchar cambios en los campos
    nombreInput.addEventListener('input', function () {
        validarNombre();
    });

    //Funciones para validar los campos
    function validarNombre() {
        let isValid = true;
        if (nombreInput.value.trim() === '') {
            showError(nombreInput, 'El nombre del grupo es obligatorio.');
            isValid = false;
        }
        else {
            clearError(nombreInput);
        }
        return isValid;
    }

    function validarFormulario() {
        if (validarNombre()) {
            return true;
        } else {
            return false;
        }
    }

    // Manejar el envío del formulario
    crear_grupoBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (validarFormulario()) {
            const name = document.getElementById('nombreGrupo').value;
            alert(name + " se ha Creado!");
            closeModal();
            window.location.href = "grupos.html";
        } else {
            alert("Por favor, corrige los errores antes de enviar.");
            return false; // Evita el envío si hay errores
        }
    });
});

function openModal() {
    document.getElementById('myModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}