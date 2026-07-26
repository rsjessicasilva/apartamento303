const URL_API = 
"https://script.google.com/macros/s/AKfycbypx6CBRx1Lm2r4AvWQpbM-lh9MprFbRLcjo32PIt3pMlLTqCHcs6c3qeW6NBJpMm7H/exec";



const botao = document.getElementById("btnSalvar");



botao.addEventListener("click", async function(){


    const despesa = {


        data:
        document.getElementById("data").value,


        descricao:
        document.getElementById("descricao").value,


        categoria:
        document.getElementById("categoria").value,


        valor:
        document.getElementById("valor").value,


        pagante:
        document.getElementById("pagante").value

    };



    try {


const response = await fetch(URL_API, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(despesa)
});

if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
}

const resultado = await response.text();
console.log(resultado);



    }

    catch(error){


        console.log(error);


        document.getElementById("mensagem").innerHTML =
        "Erro ao salvar";


    }


});
