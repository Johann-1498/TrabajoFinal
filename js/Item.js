export default class Item {
    constructor(name, price, amount, desc, imgSrc, category) {
        this.name = name;
        this.price = price;
        this.desc = desc;
        this.imgSrc = imgSrc;
        this.amount = amount;
        this.category = category;
    }
    getItemHtmlObject(llevaBoton) {
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
            <p class="text-dark fs-5 fw-bold mb-0">$${this.price} / kg</p>
            <button href="#" class="btn border border-secondary rounded-pill px-3 text-primary"><i
                class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</button>
        </div>
    </div>`
        return htmlObject;
    }
    getPrecioTotal() {
        return this.amount * this.price
    }
}