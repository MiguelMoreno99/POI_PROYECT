<?php
// Capturar la URL solicitada
$request_uri = trim($_SERVER['REQUEST_URI'], '/');

// Definir rutas disponibles
$routes = [
    '' => 'CONTROLLERS/usuario.php',
    'inicio_sesion' => 'CONTROLLERS/inicio_sesion.php',
    'mensajes' => 'CONTROLLERS/mensajes.php',
    'correo' => 'CONTROLLERS/correo.php',
    'grupos' => 'CONTROLLERS/grupos.php',
    'grupo' => 'CONTROLLERS/grupo.php',
    'detalle_tarea' => 'CONTROLLERS/detalle_tarea.php',
    'videollamada' => 'CONTROLLERS/videollamada.php',
    'tareas' => 'CONTROLLERS/tareas.php',
    'recompensas' => 'CONTROLLERS/recompensas.php',
    'registro_usuario' => 'CONTROLLERS/registro_usuario.php',
];

// Verificar si la ruta existe
if (array_key_exists($request_uri, $routes)) {
    require $routes[$request_uri];
} else {
    http_response_code(404);
    require 'CONTROLLERS/404.php';
}
