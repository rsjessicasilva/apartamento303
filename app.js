const botao = document.getElementById("btnSalvar");


botao.addEventListener("click", function(){


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


    console.log(despesa);


    document.getElementById("mensagem").innerHTML =
    "Despesa cadastrada!";


});
