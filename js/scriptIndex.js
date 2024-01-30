import Item from "./Item.js";
//Verificando la sesion
let esValidaLaSesion = false;
validarSesion()
    .then((response) => {
        if (response.name) {
            esValidaLaSesion = true;
        } else {
            console.log("no hay sesion");
        }
    });
fetch("cgi-bin/productos.pl")
    .then((data) => data.json())
    .then((data) => {
        if (data.error) {
            alert(data.error);
        } else {
            let vegetalCarousel = $(".vegetable-carousel");
            let fruitsCarousel = $(".fruit-carousel");
            let meatCarousel = $(".meat-carousel");
            let abarrotesCarousel = $(".abarrotes-carousel");
            let carritoNum = document.querySelector("#carritoNum");
            carritoNum.textContent = 0;
            let carrito = {};
            if (localStorage.getItem("Carrito")) {
                carrito = JSON.parse(localStorage.getItem("Carrito"));
            }
            //Funcion para agregarle evento a los botones
            function buttonEvent(array) {
                for (let i = 0; i < array.length; i++) {
                    (function () {
                        let name = array[i].querySelector("h4").textContent;
                        console.log(name);
                        array[i].querySelector("button").addEventListener("click", () => {
                            if (esValidaLaSesion) {
                                carritoNum.textContent++;
                                if (carrito[name]) {
                                    carrito[name]++;
                                } else {
                                    carrito[name] = 1;
                                }
                                localStorage.setItem("Carrito", JSON.stringify(carrito));
                                console.log(localStorage.getItem("Carrito"));
                            } else {
                                alert("Inicia Sesión antes de Continuar");
                            }
                        });
                    })();
                }
            }
            //Funcion para meter dentro de un div los elemnetos del carrusel
            function appendIn(carousel, array) {
                array.forEach(value => carousel.append(value));
            }
            let verduras = [];
            let frutas = [];
            let carnes = [];
            let abarrotes = [];
            data.forEach((element, index) => {
                let category;
                switch (element.categoryID) {
                    case 1:
                        category = "Verduras";
                        verduras.push(new Item(
                            element.nombre,
                            element.precio,
                            undefined,
                            element.descripcion,
                            element.img,
                            category
                        ).getItemHtmlObject());
                        break;
                    case 2:
                        category = "Frutas";
                        frutas.push(new Item(
                            element.nombre,
                            element.precio,
                            undefined,
                            element.descripcion,
                            element.img,
                            category
                        ).getItemHtmlObject());
                        break;
                    case 3:
                        category = "Carnes";
                        carnes.push(new Item(
                            element.nombre,
                            element.precio,
                            undefined,
                            element.descripcion,
                            element.img,
                            category
                        ).getItemHtmlObject());
                        break;
                    case 4:
                        category = "Abarrotes";
                        abarrotes.push(new Item(
                            element.nombre,
                            element.precio,
                            undefined,
                            element.descripcion,
                            element.img,
                            category
                        ).getItemHtmlObject());
                        break;
                    default:
                        category = "uncategorized"
                        break;
                }
            });
            buttonEvent(verduras);
            buttonEvent(carnes);
            buttonEvent(abarrotes);
            buttonEvent(frutas);
            appendIn(vegetalCarousel, verduras);
            appendIn(fruitsCarousel, frutas);
            appendIn(meatCarousel, carnes);
            appendIn(abarrotesCarousel, abarrotes);
            let carouselOptions = {
                autoplay: false,
                smartSpeed: 1500,
                center: false,
                loop: false,
                margin: 25,
                nav: true,
                navText: [
                    '<i class="bi bi-arrow-left"></i>',
                    '<i class="bi bi-arrow-right"></i>',
                ],
                responsive: {
                    0: {
                        items: 1,
                    },
                    576: {
                        items: 1,
                    },
                    768: {
                        items: 2,
                    },
                    992: {
                        items: 3,
                    },
                    1200: {
                        items: 4,
                    },
                },
            };
            vegetalCarousel.owlCarousel(carouselOptions);
            fruitsCarousel.owlCarousel(carouselOptions);
            meatCarousel.owlCarousel(carouselOptions);
            abarrotesCarousel.owlCarousel(carouselOptions);
        }
    });