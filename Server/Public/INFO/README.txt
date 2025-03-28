#ESTO SE PONE DENTRO DEL ARCHIVO C:\xampp\apache\conf\httpd.conf
#PARA LO DE LAS RUTAS SIN LAS EXTENCIONES Y SIN EL NOMBRE DE LA CARPETA A UTILIZAR

DocumentRoot "C:/xampp/htdocs"
<Directory "C:/xampp/htdocs">
    AllowOverride None
    Require all granted
    Options FollowSymLinks
</Directory>

<VirtualHost *:80>
    DocumentRoot "C:\XAMPP\htdocs\POI_PROYECT\Server\Public"
    DirectoryIndex index.php
    <Directory "C:\XAMPP\htdocs\POI_PROYECT\Server\Public">
        AllowOverride None
        Require all granted
        Options FollowSymLinks
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ index.php [QSA,L]
    </Directory>
</VirtualHost>