const URL_API = 
"https://script.google.com/macros/s/COLE_SUA_URL_AQUI/exec";



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


        await fetch(URL_API, {


            method:"POST",


            body: JSON.stringify(despesa)


        });



        document.getElementById("mensagem").innerHTML =
        "Despesa salva com sucesso!";



    }

    catch(error){


        console.log(error);


        document.getElementById("mensagem").innerHTML =
        "Erro ao salvar";


    }


});
