let closeSessionJS = document.querySelector("#closeSession");
let loginOrRegisterJS = document.querySelector("#loginOrRegister");

function eliminarCookie() {
  var fechaExpiracion = new Date();
  fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() - 1);
  document.cookie = "token_sesion" + "=; expires=" + fechaExpiracion.toUTCString() + "; path=/";
}
closeSessionJS.addEventListener("click", () => {
  eliminarCookie();
  window.location.reload();
});
if (loginOrRegisterJS) {
  loginOrRegisterJS.addEventListener("click", () => {
    window.location.href = "login_Register.html";
  });
}
function validandoLaSesion() {
  if (localStorage.getItem("User") !== null) {
    if (obtenerTokenDeSesion()) {
      validarSesion().then((response) => {
        if (response.name === JSON.parse(localStorage.getItem("User")).name) {
          console.log(response.name);
        } else {
          console.log("No hay sesion" + response.error);
          localStorage.clear();
          eliminarCookie();
          alert("Su sesion a terminado");
          setTimeout(() => window.location.reload(), 500);
        }
      });
    } else {
      console.log("No hay token");
    }

  }
}
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