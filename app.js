/* ==========================================
   CONTROLE APARTAMENTO 303
   APP.JS - VERSÃO 2.0
========================================== */

const URL_API =
"https://script.google.com/macros/s/AKfycbxqnBkapRVOJFIaY_JmWr44LFTKpzFu9rMvPKV5rh9gTlaUzKtpLfo_Vuoi2qj0F6hd/exec";

const form = document.getElementById("formDespesa");
const btnSalvar = document.getElementById("btnSalvar");
const mensagem = document.getElementById("mensagem");
const loading = document.getElementById("loading");

/* ============================
      DATA DE HOJE
============================ */

window.addEventListener("load", () => {

    document.getElementById("data").value =
        new Date().toISOString().split("T")[0];

});

/* ============================
      MENSAGENS
============================ */

function mostrarMensagem(texto, tipo) {

    mensagem.innerHTML = texto;

    mensagem.className = "mensagem " + tipo;

}

/* ============================
      LOADING
============================ */

function mostrarLoading() {

    loading.classList.remove("oculto");

    btnSalvar.disabled = true;

}

function esconderLoading() {

    loading.classList.add("oculto");

    btnSalvar.disabled = false;

}

/* ============================
      LIMPAR FORMULÁRIO
============================ */

function limparFormulario() {

    form.reset();

    document.getElementById("data").value =
        new Date().toISOString().split("T")[0];

}

/* ============================
      SALVAR
============================ */

form.addEventListener("submit", async function(e){

    e.preventDefault();

    mensagem.style.display = "none";

    const despesa = {

        data:
        document.getElementById("data").value,

        descricao:
        document.getElementById("descricao").value.trim(),

        categoria:
        document.getElementById("categoria").value,

        valor:
        Number(document.getElementById("valor").value),

        pagante:
        document.getElementById("pagante").value

    };

    /* ==========================
        VALIDAÇÃO
    ========================== */

    if(!despesa.data){

        mostrarMensagem(
            "Informe a data.",
            "erro"
        );

        return;

    }

    if(!despesa.descricao){

        mostrarMensagem(
            "Informe a descrição.",
            "erro"
        );

        return;

    }

    if(!despesa.categoria){

        mostrarMensagem(
            "Selecione a categoria.",
            "erro"
        );

        return;

    }

    if(despesa.valor <= 0){

        mostrarMensagem(
            "Informe um valor válido.",
            "erro"
        );

        return;

    }

    if(!despesa.pagante){

        mostrarMensagem(
            "Selecione quem pagou.",
            "erro"
        );

        return;

    }

    mostrarLoading();

    try{

const response = await fetch(URL_API, {

    method: "POST",

    redirect: "follow",

    body: JSON.stringify(despesa)

});

const texto = await response.text();

console.log(texto);

const resultado = JSON.parse(texto);

        if(!response.ok){

            throw new Error(
                resultado.message ||
                "Erro ao gravar."
            );

        }

        if(resultado.status !== "ok"){

            throw new Error(
                resultado.message ||
                "Falha ao salvar."
            );

        }

        mostrarMensagem(

            "✅ Despesa salva com sucesso!",

            "sucesso"

        );

        limparFormulario();

    }

    catch(error){

        console.error(error);

        mostrarMensagem(

            "❌ " + error.message,

            "erro"

        );

    }

    finally{

        esconderLoading();

    }

});
