let slider = document.querySelector(".slider-contenedor");
let sliderIndividual = document.querySelectorAll(".contenido-slide");
let contador =1;
let width = sliderIndividual[0].clientWidth;
let intervalo = 3000;

setInterval(function() {
    translate();
},intervalo);
function translate() {
    slider.style.transform = "translate(" +(-width*contador) + "px)";
    slider.style.transition = "transform .7s";
    contador ++;
    if (contador == sliderIndividual.length) {
        setTimeout(function() {
            slider.style.transform = "translate(0px)";
        contador = 1;

        },1500);
    }
}