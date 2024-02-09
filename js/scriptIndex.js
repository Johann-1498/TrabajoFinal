class Item {
  constructor(name, price, amount, desc, imgSrc, category) {
    this.name = name;
    this.price = price;
    this.desc = desc;
    this.imgSrc = imgSrc;
    this.amount = amount;
    this.category = category;
  }
  getItemHtmlObject() {
    let htmlObject = document.createElement("div");
    htmlObject.className = "item border border-primary rounded position-relative vesitable-item";
    htmlObject.innerHTML = `<div class="vesitable-img">
      <img src="${this.imgSrc}" class="img-fluid w-100 rounded-top" alt="">
  </div>
  <div class="text-white bg-primary px-3 py-1 rounded position-absolute"
      style="top: 10px; right: 10px;">${this.category}</div>
  <div class="p-4 rounded-bottom">
      <h4>${this.name}</h4>
      <p>${this.desc}</p>
      <div class="d-flex justify-content-between flex-lg-wrap">
          <p class="price text-dark fs-5 fw-bold mb-0">S/. ${this.price} / kg</p>
          <button class="btn border border-secondary rounded-pill px-3 text-primary"><i
              class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</button>
      </div>
  </div>`
    return htmlObject;
  }
}
class CarouselHtml {
  constructor(name, array) {
    this.contenedorPrincipal = document.createElement("div");
    this.contenedorPrincipal.classList.add("container-fluid", "vesitable");
    this.contenedorSecundario = document.createElement("div");
    this.contenedorSecundario.classList.add("container", "py-5");
    this.h1 = document.createElement("h1");
    this.h1.classList.add("mb-0");
    this.h1.textContent = name;
    this.contenedorCarousel = document.createElement("div");
    this.contenedorCarousel.classList.add("owl-carousel", name + "-carousel", "justify-content-center");
    array.forEach((value) => this.contenedorCarousel.append(value));
    this.contenedorSecundario.append(this.h1, this.contenedorCarousel);
    this.contenedorPrincipal.append(this.contenedorSecundario);
  }
  getItemHtmlObject() {
    return this.contenedorPrincipal;
  }
  getJQueryObject() {
    let jQueryObject = $(this.contenedorCarousel);
    return jQueryObject;
  }
}
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
          fetch("cgi-bin/obtenerDatosdeCarrito.pl?token=" + obtenerTokenDeSesion()).then(response => response.json()).then(data => carrito = JSON.parse(data.content));
          console.log(carrito);
        } else {
          console.log("No hay sesion" + response.error);
          localStorage.clear();
          eliminarCookie();
          closeSession.style.display = "none";
          cartButton.style.display = "none";
          perfilButton.style.display = "none";
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
  .then((response) => response.json())
  .then((dataPL) => {
    if (dataPL.error) {
      alert(dataPL.error);
    } else {
      fetch("cgi-bin/obtenerCategorias.pl").then(response => response.json()).then((dataCategorias) => {
        let carritoNum = document.querySelector("#carritoNum");
        carritoNum.textContent = 0;
        let categoriesNames = new Map();
        let categories = new Map();
        dataCategorias.forEach((value) => {
          categories.set(value.id, []);
          categoriesNames.set(value.id, value.name);
        });
        dataPL.forEach((element) => {
          if (categories.has(element.categoryID)) {
            categories.get(element.categoryID).push(new Item(
              element.nombre,
              element.precio,
              undefined,
              element.descripcion,
              element.img,
              categoriesNames.get(element.categoryID)
            ).getItemHtmlObject()
            );
          }
        });
        categories.forEach((valor) => {
          buttonEvent(valor);
        });
        let nodo = document.querySelector("HERO");
        let carousel = [];
        let i = 0;
        dataCategorias.forEach((value) => {
          carousel.push(new CarouselHtml(value.nombre, categories.get(value.id)))
          nodo.parentNode.insertBefore(carousel[i].getItemHtmlObject(), node.nextSibling);
          i++;
        });
        carousel.forEach((value) => {
          value.getJQueryObject().owlCarousel(carouselOptions);
        })
      });
    }
  });
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