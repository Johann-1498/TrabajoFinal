import Item from '.Item.js';
class OptionsForPurchase {
    constructor(id, amount, price) {
        this.id = id;
        this.amount = amount;
        this.price = price
    }
    getOptionsHtmlObject() {
        let htmlObject = document.createElement("div");
        htmlObject.className = "optionsForPurchase";
        htmlObject.id = this.id;
        let finalPrice = document.createElement("p");
        finalPrice.textContent = "Precio final: S/. " + this.getPrecioTotal();
        let amount = document.createElement("p");
        amount.textContent = "Cantidad de " + this.id + " : " + this.amount;
        htmlObject.append(amount, finalPrice);
        return htmlObject;
    }
    getPrecioTotal() {
        return this.amount * this.price;
    }
}
let carritoInfo = JSON.parse(localStorage.getItem("Carrito"));
console.log(carritoInfo);
let miCarrito = document.querySelector("#miCarrito");
let item;
let itemContainer;
let precioTotal = 0;
let carritoInfoKeys = Object.keys(carritoInfo);
carritoInfoKeys.forEach(clave => {
    let valor = carritoInfo[clave];
    imprimirDatos(clave, valor);
});
function imprimirDatos(nombre, amount) {
    itemContainer = (document.createElement("div"))
    item = new Item(nombre, "9.00", amount, "fresarica", "https://media.freshmart.pe/__sized__/products/10613-Fresa_454g-thumbnail-255x255-70.jpg"
    );
    itemContainer.className = "itemContainer";
    itemContainer.append(item.getItemHtmlObject());
    itemContainer.append(new OptionsForPurchase(item.id, item.amount, item.price).getOptionsHtmlObject());
    miCarrito.append(itemContainer);
    precioTotal += item.getPrecioTotal();
}
let finalPriceDiv = document.querySelector("#finalPrice");
finalPriceDiv.innerHTML = "<p>PRECIO TOTAL: S/." + precioTotal + "</p>"