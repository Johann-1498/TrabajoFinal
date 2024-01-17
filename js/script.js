const p = document.querySelector("#respuesta");
fetch('cgi-bin/backend.pl', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        // Puedes incluir otros encabezados según sea necesario
    },
    // Puedes incluir el cuerpo de la solicitud en caso de ser necesario
})
    .then(response => response.text())
    .then(data => {
        // Maneja la respuesta del backend
        p.innerHTML = data;
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });