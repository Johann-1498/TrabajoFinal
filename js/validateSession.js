let p = document.querySelector("p");
let closeSession = document.querySelector("#closeSession");
function eliminarCookie(){
    var fechaExpiracion = new Date();
    fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() - 1);
    document.cookie = "token_sesion" + "=; expires=" + fechaExpiracion.toUTCString() + "; path=/";
    window.location.href = "login_Register.html"
}
closeSession.addEventListener("click", () => {
eliminarCookie();
});
let tokenSesion = obtenerTokenDeSesion();
if (tokenSesion == null) {
    window.location.href = "login_Register.html"
}
console.log(tokenSesion);

let rutaArchivo = 'cgi-bin/sesion.pl?token=' + tokenSesion;
fetch(rutaArchivo)
    .then(response => {
        if (!response.ok) {
            eliminarCookie();
            window.location.href = "login_Register.html";
        }
        return response.text();
    })
    .then(data => {
        p.innerHTML = data;
    });
function obtenerTokenDeSesion() {
    let cookies = document.cookie;
    let [nombre, valor] = cookies.split('=');
    if (nombre.trim() === 'token_sesion') {
        return valor.trim();
    }
    return null;
}
obtenerTokenDeSesion();