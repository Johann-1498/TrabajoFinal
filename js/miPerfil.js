//ifPageIsNecesaryValidate();
var userEmail = document.getElementById("userEmail");
var userName = document.getElementById("userName");
var userPhone = document.getElementById("userPhone");
var userCui = document.getElementById("userCui");
let datos;
validarSesion().then(response => {
    datos = response;
    userEmail.innerHTML = datos.email;
    userName.innerHTML = datos.name;
    userPhone.innerHTML = datos.telefono;
    userCui.innerHTML = datos.cui;
    //buttonsEventListener();
});
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
    billingSettings.style.transform = "translateX(50px)";
    setTimeout(function () {
        accountSettings.classList.remove("hidden");
        console.log(accountSettings.style.transform);
        if (accountSettings.style.transform) {
            accountSettings.style.transform = "translateX(50px)";
        }


    }, 500);
})
changeSettingBilling.addEventListener("click", () => {
    billingSettings.style.zIndex = "1";
    accountSettings.style.zIndex = "0";
    changeSettingBilling.classList.add("selected");
    changeSettingAccount.classList.remove("selected");
    accountSettings.classList.add("hidden");
    accountSettings.style.transform = "translateX(-50px)";
    setTimeout(function () {
        billingSettings.classList.remove("hidden");
        if (billingSettings.style.transform) {
            billingSettings.style.transform = "translateX(-50px)";
        }
    }, 500);
})