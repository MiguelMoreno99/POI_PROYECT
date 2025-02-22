function openModal() {
    document.getElementById('myModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

function submitName() {
    const name = document.getElementById('nombreTarea').value;
    const date = document.getElementById('FechaTarea').value;
    alert("¡TAREA CREADA CON EXITO! \n Nombre: " + name + " \n Fecha de entrega: " + date);

    closeModal();
}