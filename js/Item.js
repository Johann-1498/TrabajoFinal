export default class Item {
    constructor(id, precio, desc, imgSrc) {
        this.id = id;
        this.precio = precio;
        this.desc = desc;
        this.imgSrc = imgSrc;
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
        let precio = document.createElement("p");
        precio.innerHTML = `S/&nbsp;${this.precio} /kg`;
        let desc = document.createElement("p");
        desc.innerHTML = this.desc;
        htmlObject.append(img, precio, desc);
        return htmlObject;
    }
}