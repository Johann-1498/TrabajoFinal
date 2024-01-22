//Codigo del movimiento del Slider
let slider = document.querySelector(".slider-contenedor");
let sliderIndividual = document.querySelectorAll(".contenido-slide");
let contador = 1;
let width = sliderIndividual[0].clientWidth;
let intervalo = 3000;
setInterval(function () {
    translate();
}, intervalo);
function translate() {
    slider.style.transform = "translate(" + (-width * contador) + "px)";
    slider.style.transition = "transform .7s";
    contador++;
    if (contador == sliderIndividual.length) {
        setTimeout(function () {
            slider.style.transform = "translate(0px)";
            contador = 1;
        }, 1500);
    }
}
//Codigo de la verificacion de el inicio de sesion 
let miPerfil = document.querySelector("#miPerfil");
let iniciarSesionP = document.querySelector("#iniciarSesion");
let value = "<a href='login_Register.html'>Registrate o Inicia Sesion</a>";
let bienvenida = document.querySelector("#bienvenidaH2");
let carritoDom = document.querySelector("#carrito");
let datos;
let esValidaLaSesion;
if (document.cookie.split("=")[0] == "token_sesion") {
    validarSesion().then(data => {
        datos = data.name;
        bienvenida.textContent = "Bienvenid@" + datos + " a Supermercado XYZ";
        miPerfil.innerHTML = "<a href='miPerfil.html'>Mi Perfil</a >";
        esValidaLaSesion = true;
    });
} else {
    carritoDom.style.display = "none";
    esValidaLaSesion = false;
    iniciarSesionP.innerHTML = value;
}
//Codigo del movimiento de la lista de catalogos
let listGroup = document.querySelector(".list");
let buttonNextGroup = document.querySelector(".nextGroup")
let buttonPrevGroup = document.querySelector(".prevGroup")
buttonPrevGroup.addEventListener("click", () => {
    listGroup.scrollLeft -= 100;
})
buttonNextGroup.addEventListener("click", () => {
    listGroup.scrollLeft += 100;
});
//Codigo de el movimiento de los productos
let listItem = document.querySelectorAll(".listItems"); // List Item es un array que contiene todas las listas de items
let buttonNextItem = document.querySelectorAll(".nextItem");
let buttonPrevItem = document.querySelectorAll(".prevItem");
for (let i = 0; i < listItem.length; i++) {
    buttonPrevItem[i].addEventListener("click", () => {
        listItem[i].scrollLeft -= 100;
    })
    buttonNextItem[i].addEventListener("click", () => {
        listItem[i].scrollLeft += 100;
    })
}
//Codigo de la agregacion de items al carrito
let buttonsAddItem = document.querySelectorAll(".listItems .item button");
let items = document.querySelectorAll(".listItems .item");
let carritoNum = document.querySelector("#carritoNum");
carritoNum.textContent = 0;
let carrito = {};
for (let i = 0; i < items.length; i++) {
    buttonsAddItem[i].addEventListener("click", () => {
        if (esValidaLaSesion) {
            carritoNum.textContent++;
            if (carrito[items[i].id]) {
                carrito[items[i].id]++;
            } else {
                carrito[items[i].id] = 0;
            }
            localStorage.setItem("Carrito", JSON.stringify(carrito));
            console.log(localStorage.getItem("Carrito"));
        } else {
            alert("Inicia Sesion antes de Continuar");
        }
    });
}