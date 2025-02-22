function openModal() {
    document.getElementById('myModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

function submitName() {
    const name = document.getElementById('nombreGrupo').value;
    alert('Nombre enviado: ' + name);
    closeModal();
}