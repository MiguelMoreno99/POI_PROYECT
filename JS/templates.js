// Función para cargar el header
fetch('../HTML/TEMPLATES/header.html')
    .then(response => response.text())
    .then(data => {
        const template = document.createElement('template');
        template.innerHTML = data.trim();

        // Asegúrate de que se cargue el contenido del template correctamente
        const headerTemplate = template.content.querySelector('template');

        // Verifica que el template no sea nulo antes de usarlo
        if (headerTemplate) {
            const header = headerTemplate.content.querySelector('header');
            document.getElementById('header-container').appendChild(header);
        } else {
            console.error('No se encontró el template en el archivo header.html');
        }
    })
    .catch(err => console.error('Error cargando el header:', err));

// Función para cargar el footer
fetch('../HTML/TEMPLATES/footer.html')
    .then(response => response.text())
    .then(data => {
        const template = document.createElement('template');
        template.innerHTML = data.trim();

        // Asegúrate de que se cargue el contenido del template correctamente
        const headerTemplate = template.content.querySelector('template');

        // Verifica que el template no sea nulo antes de usarlo
        if (headerTemplate) {
            const header = headerTemplate.content.querySelector('footer');
            document.getElementById('footer-container').appendChild(header);
        } else {
            console.error('No se encontró el template en el archivo footer.html');
        }
    })
    .catch(err => console.error('Error cargando el footer:', err));