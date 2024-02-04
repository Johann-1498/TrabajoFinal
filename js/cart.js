
class trDetail {
    constructor(name, img, price, quantity) {
        this.name = name;
        this.img = img;
        this.price = price;
        this.quantity = quantity;
        this.total = (price * quantity).toFixed(2);
    };
    getHtmlObject() {
        let htmlObejct = document.createElement("tr");
        htmlObejct.innerHTML = `
                    <th scope="row">
                        <div class="d-flex align-items-center">
                            <img src="${this.img}" class="img-fluid me-5 rounded-circle"
                                style="width: 80px; height: 80px;" alt="">
                        </div>
                    </th>
                    <td>
                        <p class="mb-0 mt-4">${this.name}</p>
                    </td>
                    <td>
                        <p class="mb-0 mt-4">S/. ${this.price} </p>
                    </td>
                    <td>
                        <div class="input-group quantity mt-4" style="width: 100px;">
                            <div class="input-group-btn">
                                <button class="btn btn-sm btn-minus rounded-circle bg-light border">
                                    <i class="fa fa-minus"></i>
                                </button>
                            </div>
                            <input type="text" class="quantity form-control form-control-sm text-center border-0"
                                value="${this.quantity}">
                            <div class="input-group-btn">
                                <button class="btn btn-sm btn-plus rounded-circle bg-light border">
                                    <i class="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="total mb-0 mt-4">S/. ${this.total}</p>
                    </td>
                    <td>
                        <button class="deleteItem btn btn-md rounded-circle bg-light border mt-4">
                            <i class="fa fa-times text-danger"></i>
                        </button>
                    </td>`
        return htmlObejct;
    }
}
//main
let cartTotalPrice = document.querySelector(".cartTotalPrice");
let finalTotalPrice = document.querySelector(".finalTotalPrice");
let preciosTotales = [];
let costoDeEnvio = 3;
let finalPrice = 0;
let tBody = document.querySelector("tbody");
let carritoInfo = {};
fetch("cgi-bin/obtenerDatosdeCarrito.pl?token=" + obtenerTokenDeSesion()).then(response => response.json()).then((data) => {
    carritoInfo = JSON.parse(data.content);
    console.log(carritoInfo);
});

let productosEnElCarrito = Object.keys(carritoInfo);

productosEnElCarrito.forEach((key, index) => {
    let value = carritoInfo[key];
    let name = key;
    let imgSrc = value.imgSrc;
    let price = value.price.toFixed(2);
    let amount = value.amount;

    let producto = new trDetail(name, imgSrc, price, amount).getHtmlObject();
    let totalpriceHtml = producto.querySelector("p.total");
    preciosTotales.push(totalpriceHtml);
    let quantityHtml = producto.querySelector("input.quantity");
    let quantityButtons = producto.querySelectorAll(".quantity button");
    let deleteButton = producto.querySelector("button.deleteItem");


    quantityButtons.forEach(button => button.addEventListener("click", () => {
        var oldValue = value.amount;
        if (button.classList.contains("btn-plus")) {
            var newVal = +oldValue + 1;
        } else {
            if (oldValue > 0) {
                var newVal = +oldValue - 1;
            } else {
                newVal = 0;
            }
        }
        quantityHtml.value = newVal;
        value.amount = newVal;
        carritoInfo[name].amount = value.amount;
        localStorage.setItem("Carrito", JSON.stringify(carritoInfo));

        totalpriceHtml.textContent = "S/. " + (price * value.amount).toFixed(2);
        finalPrice = 0;
        preciosTotales.forEach(value => finalPrice += +value.textContent.substr(4));
        cartTotalPrice.textContent = "S/. " + finalPrice.toFixed(2);
        finalTotalPrice.textContent = "S/. " + (finalPrice + 3).toFixed(2);
    }));
    quantityHtml.addEventListener("input", () => {
        value.amount = quantityHtml.value;
        totalpriceHtml.textContent = "S/. " + (price * value.amount).toFixed(2);
        finalPrice = 0;

        preciosTotales.forEach(value => finalPrice += +value.textContent.substr(4));
        cartTotalPrice.textContent = "S/. " + finalPrice.toFixed(2);
        finalTotalPrice.textContent = "S/. " + (finalPrice + 3).toFixed(2);
        carritoInfo[name].amount = value.amount;
        localStorage.setItem("Carrito", JSON.stringify(carritoInfo));

    });
    deleteButton.addEventListener("click", function () {
        producto.classList.add("fade-out");
        preciosTotales.splice(preciosTotales.indexOf(producto.querySelector("p.total")), 1);
        setTimeout(function () {
            delete carritoInfo[name];
            localStorage.setItem("Carrito", JSON.stringify(carritoInfo));
            producto.remove();
        }, 500);
        console.log(preciosTotales);
        finalPrice = 0;
        preciosTotales.forEach(value => finalPrice += +value.textContent.substr(4));
        cartTotalPrice.textContent = "S/. " + finalPrice.toFixed(2);
        finalTotalPrice.textContent = "S/. " + (finalPrice + 3).toFixed(2);

    });
    tBody.append(producto);
    finalPrice = 0;
    preciosTotales.forEach(value => finalPrice += +value.textContent.substr(4));
    cartTotalPrice.textContent = "S/. " + finalPrice.toFixed(2);
    finalTotalPrice.textContent = "S/. " + (finalPrice + 3).toFixed(2);
});
finalPrice = 0;

preciosTotales.forEach(value => finalPrice += +value.textContent.substr(4));
cartTotalPrice.textContent = "S/. " + finalPrice.toFixed(2);
finalTotalPrice.textContent = "S/. " + (finalPrice + 3).toFixed(2);