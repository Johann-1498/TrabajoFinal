//Verificando la sesion
let esValidaLaSesion = false;
validarSesion().then(response => response.json()).then((data) => {
    if (data.name) {
        esValidaLaSesion = true;
    }
});
//Codigo de la agregacion de items al carrito
let buttonsAddItem = document.querySelectorAll(".item button");
let items = document.querySelectorAll(".item h4");
let carritoNum = document.querySelector("#carritoNum");
carritoNum.textContent = 0;
let carrito = {};
if (localStorage.getItem("Carrito")) {
    carrito = JSON.parse(localStorage.getItem("Carrito"));
}
for (let i = 0; i < items.length; i++) {
    buttonsAddItem[i].addEventListener("click", () => {
        if (esValidaLaSesion) {
            carritoNum.textContent++;
            if (carrito[items[i].textContent]) {
                carrito[items[i].textContent]++;
            } else {
                carrito[items[i].textContent] = 1;
            }
            localStorage.setItem("Carrito", JSON.stringify(carrito));
            console.log(localStorage.getItem("Carrito"));
        } else {
            alert("Inicia Sesion antes de Continuar");
        }
    });
}
