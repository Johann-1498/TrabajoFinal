(function ($) {
  "use strict";
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
