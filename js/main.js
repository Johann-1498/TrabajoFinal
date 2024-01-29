import Item from "./Item.js";
(function ($) {
  "use strict";
  //Verificando la sesion
  let esValidaLaSesion = false;
  validarSesion()
    .then((response) => response.json())
    .then((data) => {
      if (data.name) {
        esValidaLaSesion = true;
      }
    });
  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();
  // Fixed Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 55) {
      $(".fixed-top").addClass("shadow");
    } else {
      $(".fixed-top").removeClass("shadow");
    }
  });
  //back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });
  // vegetable carousel
  fetch("cgi-bin/productos.pl")
    .then((data) => data.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        let vegatlCarrusel = $(".vegetable-carousel");
        let carritoNum = document.querySelector("#carritoNum");
        carritoNum.textContent = 0;
        let carrito = {};
        if (localStorage.getItem("Carrito")) {
          carrito = JSON.parse(localStorage.getItem("Carrito"));
        }
        let items = [];
        data.forEach((element, index) => {
          items.push(
            new Item(
              element.nombre,
              element.precio,
              undefined,
              element.descripcion,
              element.img,
              element.categoryID
            ).getItemHtmlObject()
          );
          items[index].querySelector("button").click(() => {
            if (esValidaLaSesion) {
              carritoNum.textContent++;
              if (carrito[element.nombre]) {
                carrito[element.nombre]++;
              } else {
                carrito[element.nombre] = 1;
              }
              localStorage.setItem("Carrito", JSON.stringify(carrito));
              console.log(localStorage.getItem("Carrito"));
            } else {
              alert("Inicia Sesion antes de Continuar");
            }
          });
          vegatlCarrusel.append(items[index]);

          console.log(items[index]);
        });
        $(".vegetable-carousel").owlCarousel({
          autoplay: true,
          smartSpeed: 1500,
          center: false,
          loop: true,
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
        });
      }
    });
  // Product Quantity
  $(".quantity button").on("click", function () {
    var button = $(this);
    var oldValue = button.parent().parent().find("input").val();
    if (button.hasClass("btn-plus")) {
      var newVal = parseFloat(oldValue) + 1;
    } else {
      if (oldValue > 0) {
        var newVal = parseFloat(oldValue) - 1;
      } else {
        newVal = 0;
      }
    }
    button.parent().parent().find("input").val(newVal);
  });
})(jQuery);
