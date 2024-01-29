let loginForm = document.getElementById('loginForm');
let registerForm = document.getElementById('registerForm');
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let formData = new FormData(loginForm);
    fetch("cgi-bin/login.pl", {
        method: 'POST',
        body: formData
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        if (data.success) {
            window.location.href = 'index.html';
        } else {
            alert("Uusario o contraseña incorrectos")
        }
    });

});
registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let formDataReg = new FormData(registerForm);
    fetch("cgi-bin/register.pl", {
        method: 'POST',
        body: formDataReg
    }).then(response => {
        return response.json();
    }).then(data => {
        if (data.success) {
            window.location.href = 'index.html';
        } else {
            alert("Ocurrio un error al crear el Usuario")
        }
    });
});

