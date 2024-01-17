let p = document.querySelector("p");
let closeSession = document.querySelector("#closeSession");
closeSession.addEventListener("click", () => {
    var fechaExpiracion = new Date();
    fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() - 1);
    document.cookie = "token_sesion" + "=; expires=" + fechaExpiracion.toUTCString() + "; path=/";
    window.location.href = "login_Register.html"
});
let tokenSesion = obtenerTokenDeSesion();
if (tokenSesion === null) {

}
console.log(tokenSesion);

let rutaArchivo = 'cgi-bin/sesion.pl?token=' + tokenSesion;
fetch(rutaArchivo)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al verificar la sesión');
        }
        return response.text();
    })
    .then(data => {
        p.innerHTML = data;
    })
    .catch(error => console.error('Error:', error));
function obtenerTokenDeSesion() {
    let cookies = document.cookie;
    let [nombre, valor] = cookies.split('=');
    if (nombre.trim() === 'token_sesion') {
        return valor.trim();
    }
    return null;
}
obtenerTokenDeSesion();