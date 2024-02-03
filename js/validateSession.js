let closeSession = document.querySelector("#closeSession");
function eliminarCookie() {
    var fechaExpiracion = new Date();
    fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() - 1);
    document.cookie = "token_sesion" + "=; expires=" + fechaExpiracion.toUTCString() + "; path=/";
}
closeSession.addEventListener("click", () => {
    eliminarCookie();
    window.location.reload();
});
function ifPageIsNecesaryValidate() {
    let tokenSesion = obtenerTokenDeSesion();
    if (tokenSesion == null) {
        window.location.href = "login_Register.html"
    }
    validarSesion();
}
function validarSesion() {
    return new Promise((resolve) => {
        let tokenSesion = obtenerTokenDeSesion();
        let rutaArchivo = 'cgi-bin/sesion.pl?token=' + tokenSesion;
        fetch(rutaArchivo)
            .then(response => {
                if (!response.ok) {
                    eliminarCookie();
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            });
    });
}

function obtenerTokenDeSesion() {
    let cookies = document.cookie;
    let [nombre, valor] = cookies.split('=');
    if (nombre.trim() === 'token_sesion') {
        return valor.trim();
    }
    return undefined;
}