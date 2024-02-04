import Item from "./Item.js";
//Verificando la sesion
let esValidaLaSesion = false;
let loginOrRegister = document.querySelector("#loginOrRegister");
let closeSession = document.querySelector("#closeSession");
let cartButton = document.querySelector("#cartButton");
let perfilButton = document.querySelector("#perfilButton");
let carrito = {};
function validandoLaSesion() {
  if (localStorage.getItem("User") !== null) {
    if (obtenerTokenDeSesion()) {
      validarSesion().then((response) => {
        if (response.name === JSON.parse(localStorage.getItem("User")).name) {
          console.log(response.name);
          esValidaLaSesion = true;
          loginOrRegister.style.display = "none";
          closeSession.style.display = "block";
          cartButton.style.display = "block";
          perfilButton.style.display = "block";
          fetch("cgi-bin/obtenerDatosdeCarrito.pl?token=" + obtenerTokenDeSesion()).then(response => response.json()).then(data => carrito = data);
        } else {
          console.log("No hay sesion" + response.error);
          localStorage.clear();
          eliminarCookie();
          //alert("Su sesion a terminado");
          //setTimeout(() => window.location.reload(), 500);
        }
      });
    } else {
      console.log("No hay token");
      loginOrRegister.style.display = "block";
      closeSession.style.display = "none";
      cartButton.style.display = "none";
      perfilButton.style.display = "none";
    }
  }
}

validandoLaSesion();

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
      let limpiezaCarousel = $(".limpieza-carousel");
      let bebidasCarousel = $(".bebidas-carousel");
      let panaderiaCarousel = $(".panaderia-carousel");
      let carritoNum = document.querySelector("#carritoNum");
      carritoNum.textContent = 0;
      //Funcion para agregarle evento a los botones
      function buttonEvent(array) {
        for (let i = 0; i < array.length; i++) {
          (function () {
            let name = array[i].querySelector("h4").textContent;
            let imgSrc = array[i].querySelector("img").src;
            let priceStr = array[i].querySelector("p.price").textContent.trim();
            let resultado = priceStr.match(/[0-9]+(?:\.[0-9]+)?/);
            let price = +resultado[0];
            array[i].querySelector("button").addEventListener("click", () => {
              if (esValidaLaSesion) {
                carritoNum.textContent++;
                if (carrito[name]) {
                  carrito[name].amount++;
                } else {
                  carrito[name] = {
                    amount: 1,
                    imgSrc: imgSrc,
                    price: price,
                  };
                }
                let carritoJsonString = JSON.stringify(carrito);
                fetch(
                  "cgi-bin/guardarCarrito.pl?token_sesion=" +
                  obtenerTokenDeSesion() +
                  "&carrito=" +
                  carritoJsonString
                )
                  .then((resolve) => resolve.json())
                  .then((data) => console.log(data.success));
              } else {
                alert("Inicia Sesión antes de Continuar");
              }
            });
          })();
        }
      }
      //Funcion para meter dentro de un div los elemnetos del carrusel
      function appendIn(carousel, array) {
        array.forEach((value) => carousel.append(value));
      }
      let verduras = [];
      let frutas = [];
      let carnes = [];
      let abarrotes = [];
      let limpieza = [];
      let bebidas = [];
      let panaderia = [];
      data.forEach((element, index) => {
        let category;
        switch (element.categoryID) {
          case 1:
            category = "Verduras";
            verduras.push(
              new Item(
                element.nombre,
                element.precio,
                undefined,
                element.descripcion,
                element.img,
                category
              ).getItemHtmlObject()
            );
            break;
          case 2:
            category = "Frutas";
            frutas.push(
              new Item(
                element.nombre,
                element.precio,
                undefined,
                element.descripcion,
                element.img,
                category
              ).getItemHtmlObject()
            );
            break;
          case 3:
            category = "Carnes";
            carnes.push(
              new Item(
                element.nombre,
                element.precio,
                undefined,
                element.descripcion,
                element.img,
                category
              ).getItemHtmlObject()
            );
            break;
          case 4:
            category = "Abarrotes";
            abarrotes.push(
              new Item(
                element.nombre,
                element.precio,
                undefined,
                element.descripcion,
                element.img,
                category
              ).getItemHtmlObject()
            );
            break;
          case 5:
            category = "Limpieza";
            limpieza.push(
              new Item(
                element.nombre,
                element.precio,
                undefined,
                element.descripcion,
                element.img,
                category
              ).getItemHtmlObject()
            );
            break;
          case 6:
            category = "Bebidas";
            bebidas.push(
              new Item(
                element.nombre,
                element.precio,
                undefined,
                element.descripcion,
                element.img,
                category
              ).getItemHtmlObject()
            );
            break;
          case 7:
            category = "Panaderia";
            panaderia.push(
              new Item(
                element.nombre,
                element.precio,
                undefined,
                element.descripcion,
                element.img,
                category
              ).getItemHtmlObject()
            );
            break;

          default:
            category = "uncategorized";
            break;
        }
      });
      buttonEvent(verduras);
      buttonEvent(carnes);
      buttonEvent(abarrotes);
      buttonEvent(frutas);
      buttonEvent(limpieza);
      buttonEvent(bebidas);
      buttonEvent(panaderia);
      appendIn(vegetalCarousel, verduras);
      appendIn(fruitsCarousel, frutas);
      appendIn(meatCarousel, carnes);
      appendIn(abarrotesCarousel, abarrotes);
      appendIn(limpiezaCarousel, limpieza);
      appendIn(bebidasCarousel, bebidas);
      appendIn(panaderiaCarousel, panaderia);
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
      limpiezaCarousel.owlCarousel(carouselOptions);
      bebidasCarousel.owlCarousel(carouselOptions);
      panaderiaCarousel.owlCarousel(carouselOptions);
    }
  });
