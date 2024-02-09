ifPageIsNecesaryValidate();
let userEmail = document.getElementById("userEmail");
let userName = document.getElementById("userName");
let userPhone = document.getElementById("userPhone");
let userDireccion = document.getElementById("userDireccion");
let cardNumber = document.getElementById("cardNumber");
let cardDate = document.getElementById("cardDate");
let cardCvc = document.getElementById("cardCvc");
let datos;
let userID;
validarSesion().then(response => {
    datos = response;
    userEmail.innerHTML = datos.email;
    userName.innerHTML = datos.name;
    userPhone.innerHTML = datos.phone;
    userDireccion.innerHTML = datos.direccion;
    userID = datos.id;
    buttonsEventListener();
});

let editButtons = document.querySelectorAll(".editInformationButton");
let informationContainer = document.querySelectorAll(".informationContainer");
let p = document.querySelectorAll(".informationContainer p");
let inputs = [];
let saveButtons = [];
function buttonsEventListener() {
    for (let i = 0; i < editButtons.length; i++) {
        inputs.push(document.createElement("input"));
        saveButtons.push(document.createElement("button"));
        saveButtons[i].classList.add("editInformationButton");
        saveButtons[i].innerHTML = "Guardar";
        inputs[i].name = editButtons[i].id.substring(4).toLowerCase();
        editButtons[i].addEventListener("click", () => {
            editButtons[i].style.display = "none";
            informationContainer[i].append(inputs[i], saveButtons[i]);
            inputs[i].value = datos[inputs[i].name];
            p[i].style.display = "none";
        });
        saveButtons[i].addEventListener("click", () => {
            const form = new FormData();
            form.append("columna", inputs[i].name);
            form.append("valor", inputs[i].value);
            form.append("token_sesion", obtenerTokenDeSesion());
            if (inputs[i].name.substring(0, 4) === "card") {
                form.append("tabla", "billing_Card");
                form.append("userID", userID);
            } else {
                form.append("tabla", "users");
            }
            fetch("cgi-bin/editInformation.pl", {
                method: 'POST',
                body: form
            }).then(response => response.json())
                .then(data => {
                    if (data.success != true) {
                        alert(data.success)
                    } else {
                        alert("Datos Actualizados Correctamente");
                    }
                    window.location.reload();
                });
        });
    }
}
//animacion de desvanecimiento 
let accountSettings = document.querySelector("#accountSettings");
accountSettings.style.zIndex = "1";
let billingSettings = document.querySelector("#billingSettings");
let changeSettingAccount = document.querySelector("#changeSettingAccount");
let changeSettingBilling = document.querySelector("#changeSettingBilling");
changeSettingAccount.addEventListener("click", () => {
    accountSettings.style.zIndex = "1";
    billingSettings.style.zIndex = "0";
    changeSettingAccount.classList.add("selected");
    changeSettingBilling.classList.remove("selected");
    billingSettings.classList.add("hidden");
    setTimeout(function () {
        accountSettings.classList.remove("hidden");
        console.log(accountSettings.style.transform);
    }, 500);
})
changeSettingBilling.addEventListener("click", () => {
    billingSettings.style.zIndex = "1";
    accountSettings.style.zIndex = "0";
    changeSettingBilling.classList.add("selected");
    changeSettingAccount.classList.remove("selected");
    accountSettings.classList.add("hidden");
    setTimeout(function () {
        billingSettings.classList.remove("hidden");
    }, 500);
})