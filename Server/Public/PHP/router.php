<?php
$request_uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

$routes = [
    '' => 'CONTROLLERS/usuario.php',
    'inicio_sesion' => 'CONTROLLERS/inicio_sesion.php',
    'mensajes' => 'CONTROLLERS/mensajes.php',
    'correo' => 'CONTROLLERS/correo.php',
    'grupos' => 'CONTROLLERS/grupos.php',
    'grupo' => 'CONTROLLERS/grupo.php',
    'detalle_tarea' => 'CONTROLLERS/detalle_tarea.php',
    'videollamada' => 'CONTROLLERS/videollamada.php',
    'videollamada2' => 'CONTROLLERS/videollamada2.php',
    'tareas' => 'CONTROLLERS/tareas.php',
    'recompensas' => 'CONTROLLERS/recompensas.php',
    'registro_usuario' => 'CONTROLLERS/registro_usuario.php',
];

$found = false;

foreach ($routes as $route => $controller) {
    if ($request_uri === $route || preg_match("/^" . preg_quote($route, '/') . "(\?|\/|$)/", $request_uri)) { // ✅ Coincidencia más precisa
        require $controller;
        $found = true;
        break;
    }
}

if (!$found) {
    http_response_code(404);
    require 'CONTROLLERS/404.php';
}

?>
