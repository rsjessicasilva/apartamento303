const botao = document.getElementById("btnSalvar");

botao.addEventListener("click", () => {

    alert("Funcionou!");

});

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker

            .register("sw.js")

            .then(() => {

                console.log("Service Worker registrado");

            })

            .catch(err => {

                console.log(err);

            });

    });

}