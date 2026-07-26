/**
 * ==========================================================
 * Apartamento 303
 * Controle Financeiro
 * Versão: 3.0.0
 * Arquivo: app.js
 * ==========================================================
 */

import { APP_CONFIG } from "./js/config.js";

import {
    hojeISO,
    limparTexto,
    converterValor,
    mostrarMensagem
} from "./js/utils.js";

import {
    observarAutenticacao,
    getUsuarioAtual
} from "./js/auth.js";

import {
    salvarDespesa
} from "./js/services/despesas.js";

/* ==========================================================
   ELEMENTOS DA TELA
========================================================== */

const form = document.getElementById("formDespesa");

const btnSalvar = document.getElementById("btnSalvar");

const mensagem = document.getElementById("mensagem");

const loading = document.getElementById("loading");

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

window.addEventListener("load", iniciarAplicacao);

async function iniciarAplicacao() {

    document.title =
        APP_CONFIG.APP_NAME;

    document.getElementById("data").value =
        hojeISO();

    observarAutenticacao((usuario) => {

        if (!usuario) {

            btnSalvar.disabled = true;

            mensagem.className = "mensagem erro";

            mensagem.style.display = "block";

            mensagem.innerHTML =
                "Faça login para utilizar o sistema.";

            return;

        }

        btnSalvar.disabled = false;

        mensagem.style.display = "none";

    });

}

/* ==========================================================
   LOADING
========================================================== */

function mostrarLoading() {

    loading.classList.remove("oculto");

    btnSalvar.disabled = true;

}

function esconderLoading() {

    loading.classList.add("oculto");

    btnSalvar.disabled = false;

}

/* ==========================================================
   LIMPAR FORMULÁRIO
========================================================== */

function limparFormulario() {

    form.reset();

    document.getElementById("data").value =
        hojeISO();

}

/* ==========================================================
   SALVAR DESPESA
========================================================== */

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    mensagem.style.display = "none";

    const usuario = getUsuarioAtual();

    if (!usuario) {

        mensagem.className = "mensagem erro";

        mensagem.style.display = "block";

        mensagem.innerHTML =
            "Faça login para continuar.";

        return;

    }

    const despesa = {

        data:
            document.getElementById("data").value,

        descricao:
            limparTexto(
                document.getElementById("descricao").value
            ),

        categoria:
            document.getElementById("categoria").value,

        valor:
            converterValor(
                document.getElementById("valor").value
            ),

        pagante:
            document.getElementById("pagante").value,

        usuarioId:
            usuario.uid,

        usuarioNome:
            usuario.nome,

        criadoPor:
            usuario.email

    };

    /* ==========================
       VALIDAÇÕES
    ========================== */

    if (!despesa.data) {

        mensagem.className = "mensagem erro";
        mensagem.style.display = "block";
        mensagem.innerHTML = "Informe a data.";

        return;

    }

    if (!despesa.descricao) {

        mensagem.className = "mensagem erro";
        mensagem.style.display = "block";
        mensagem.innerHTML = "Informe a descrição.";

        return;

    }

    if (!despesa.categoria) {

        mensagem.className = "mensagem erro";
        mensagem.style.display = "block";
        mensagem.innerHTML = "Selecione a categoria.";

        return;

    }

    if (despesa.valor <= 0) {

        mensagem.className = "mensagem erro";
        mensagem.style.display = "block";
        mensagem.innerHTML = "Informe um valor válido.";

        return;

    }

    if (!despesa.pagante) {

        mensagem.className = "mensagem erro";
        mensagem.style.display = "block";
        mensagem.innerHTML = "Selecione quem pagou.";

        return;

    }

    mostrarLoading();

    try {

        await salvarDespesa(despesa);

               mensagem.className = "mensagem sucesso";

        mensagem.style.display = "block";

        mensagem.innerHTML =
            "✅ Despesa salva com sucesso!";

        limparFormulario();

        mostrarMensagem(
            "Despesa salva com sucesso."
        );

    } catch (erro) {

        console.error(erro);

        mensagem.className = "mensagem erro";

        mensagem.style.display = "block";

        mensagem.innerHTML =
            erro.message ||
            "Erro ao salvar a despesa.";

    } finally {

        esconderLoading();

    }

});

/* ==========================================================
   EXPORTAÇÃO
========================================================== */

export {
    iniciarAplicacao
};
