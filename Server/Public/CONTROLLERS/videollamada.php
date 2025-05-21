<?php

$title = 'Video llamada';

// Obtener el ID de la videollamada desde la URL
$chatId = isset($_GET['chatId']) ? $_GET['chatId'] : null;

if (!$chatId) {
    echo "<script>alert('❌ Error: No se encontró el chat ID');</script>";
} else {
    echo "<script>console.log('📡 Chat ID recibido:', $chatId);</script>";
}

// Pasar el ID a la vista si es necesario
require 'VIEWS/videollamada.php';

