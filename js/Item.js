export default class Item {
    constructor(id, price, amount, desc, imgSrc) {
        this.id = id;
        this.price = price;
        this.desc = desc;
        this.imgSrc = imgSrc;
        this.amount = amount;
    }
    getItemHtmlObject(llevaBoton) {
        let htmlObject = document.createElement("div");
        htmlObject.className = "item";
        htmlObject.id = this.id;
        if (llevaBoton) {
            let boton = document.createElement("button");
            boton.className = "agregarItemAlCarrito";
            boton.innerHTML = "<i class='bx bx-plus'></i>";
            htmlObject.append(boton);
        }
        let img = new Image();
        img.src = this.imgSrc;
        let price = document.createElement("p");
        price.innerHTML = `S/&nbsp;${this.price} /kg`;
        let desc = document.createElement("p");
        desc.innerHTML = this.desc;
        htmlObject.append(img, price, desc);
        return htmlObject;
    }
    getPrecioTotal() {
        return this.amount * this.price
    }
}