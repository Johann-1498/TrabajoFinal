class trUser {
    constructor(id, name, email, password, phone, cui, rol, tokenSesion) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.cui = cui;
        this.rol = rol;
        this.tokenSesion = tokenSesion;
    }
    getTrHtmlObject() {
        let htmlObject = document.createElement("tr");
        let td = [];
        let inputs = [];
        let p = [];
        let tdButtons = document.createElement("td");
        let buttonEdit = document.createElement("button");
        buttonEdit.className = "buttonEdit";
        buttonEdit.innerHTML = "<i class='bx bxs-edit-alt'></i>";
        let buttonDelete = document.createElement("button");
        buttonDelete.className = "buttonDelete";
        buttonDelete.innerHTML = "<i class='bx bx-trash' ></i>";
        let buttonSave = document.createElement("button");
        buttonSave.innerHTML = "<i class='bx bxs-save' ></i>";
        buttonEdit.className = "buttonEdit";
        tdButtons.append(buttonEdit, buttonSave, buttonDelete);
        let array = Object.keys(this);
        for (let i = 0; i < array.length; i++) {
            td.push(document.createElement("td"));
            if (i !== 0 && i !== array.length - 1) {
                p.push(document.createElement("p"));
                p[i - 1].textContent = this[array[i]];
                inputs.push(document.createElement("input"));
                inputs[i - 1].name = array[i];
                inputs[i - 1].value = this[array[i]];
                inputs[i - 1].style.display = "none";
                td[i].append(p[i - 1]);
                td[i].append(inputs[i - 1]);
            } else {
                let p = document.createElement("p");
                let input = document.createElement("input");
                p.textContent = this.id;
                input.style.display = "none";
                input.name = "id";
                input.value = this.id;
                td[i].append(input, p);
            }
        }
        buttonEdit.addEventListener("click", () => {
            inputs.forEach(value => value.style.display = "block");
            p.forEach(value => value.style.display = "none");
        });
        buttonDelete.addEventListener("click", () => {
            let form = new FormData();
            form.append("token_sesion", obtenerTokenDeSesion());
            form.append("email", this.email);
            form.append("operation", "delete");
            fetch("../cgi-bin/sistemaCrud.pl", {
                method: "POST",
                body: form
            })
                .then(response => response.json()).then((data) => {
                    alert(data.success);
                    window.location.reload();
                });
        });
        buttonSave.addEventListener("click", () => {
            let form = new FormData();
            form.append("token_sesion", obtenerTokenDeSesion());
            for (let i = 0; i < inputs.length; i++) {
                form.append(inputs[i].name, inputs[i].value);
            }
            form.append("id", this.id);
            form.append("operation", "save");
            fetch("../cgi-bin/sistemaCrud.pl", {
                method: "POST",
                body: form
            })
                .then(response => response.json())
                .then((data) => {
                    alert(data.succes);
                    window.location.reload();
                })
        });
        td.forEach(value => htmlObject.append(value));
        htmlObject.append(tdButtons);
        return htmlObject;
    }
}
fetch("../cgi-bin/adminTabla.pl?token=" + obtenerTokenDeSesion())
    .then(response => response.json())
    .then((data) => {
        let tabla = document.querySelector("#tabla-content");
        let users = [];
        let user;
        for (let index in data) {
            json = data[index];
            user = new trUser(json["id"], json["name"], json["email"], json["password"], json["phone"], json["cui"], json["rol"], json["token_sesion"]);
            users.push(user);
            tabla.append(user.getTrHtmlObject());
        }
    });
