ifPageIsNecesaryValidate();
class trDetail {
    constructor(name, img, price, quantity) {
        this.name = name;
        this.img = img;
        this.price = price;
        this.quantity = quantity;
        this.total = (price * quantity).toFixed(2);
    };
    getHmtlObject() {
        let htmlObject = document.createElement("tr");
        htmlObject.innerHTML = `<th scope="row">
                                    <div class="d-flex align-items-center mt-2">
                                        <img src="${this.img}" class="img-fluid rounded-circle"
                                            style="width: 90px; height: 90px;" alt="">
                                    </div>
                                </th>
                                <td class="py-5">${this.name}</td>
                                <td class="py-5">S/. ${this.price}</td>
                                <td class="py-5">${this.quantity}</td>
                                <td class="total py-5">S/. ${this.total}</td>`;
        return htmlObject;
    }
}
let tBody = document.querySelector("tbody");
let tBodyFirstChild = tBody.firstChild;
let carritoInfo = {};
let carritoJsonString = JSON.stringify(carritoInfo);
let userID = JSON.parse(localStorage.getItem("User")).id;
fetch("cgi-bin/obtenerDatosDeTarjeta.pl?userID=" + userID).then(response => response.json()).then((cardData) => {
    localStorage.setItem("Payment", JSON.stringify(cardData));
    fetch("cgi-bin/obtenerDatosdeCarrito.pl?token=" + obtenerTokenDeSesion()).then(response => response.json()).then((data) => {
        carritoInfo = JSON.parse(data.content);
        carritoJsonString = JSON.stringify(carritoInfo);
        console.log(carritoInfo);
        let productosKey = Object.keys(carritoInfo);
        for (let i = 0; i < productosKey.length; i++) {
            let element = carritoInfo[productosKey[i]];
            let trElement = new trDetail(productosKey[i], element.imgSrc, element.price, element.amount).getHmtlObject();
            tBody.insertBefore(trElement, tBodyFirstChild)
        }
        let totalPriceint = 0;
        let totalPrice = document.querySelectorAll(".total");
        totalPrice.forEach(value => totalPriceint += +value.textContent.substring(4))
        console.log(totalPriceint);
        let subTotal = document.querySelector(".subTotal");
        let finalPrice = document.querySelector(".finalPrice");
        subTotal.textContent = "S/. " + totalPriceint.toFixed(2);
        finalPrice.textContent = "S/. " + (totalPriceint + 3).toFixed(2);
        document.querySelector(".btnRealizarPedido").addEventListener("click", () => {
            let form = new FormData(document.querySelector("#infoForm"));
            form.append("detalles", notasPedidoElement.value);
            form.append("productos", carritoJsonString);
            form.append("clientID", datosUser.id);
            form.append("paymentID", JSON.parse(localStorage.getItem("Payment")).cardnumber);
            fetch("cgi-bin/ventas.pl", {
                method: 'POST',
                body: form
            }).then(response => response.json()).then(data => console.log(data));
        });
        let datosUser = JSON.parse(localStorage.getItem("User"));
        var contNameElement = document.getElementById('contName');
        var contPhoneElement = document.getElementById('contPhone');
        var contEmailElement = document.getElementById('contEmail');
        var contAddressElement = document.getElementById('contAddress');
        var notasPedidoElement = document.getElementById('notasPedido');
        contNameElement.value = datosUser.name;
        contPhoneElement.value = datosUser.phone;
        contEmailElement.value = datosUser.email;
        contAddressElement.value = datosUser.direccion;
    });
})





