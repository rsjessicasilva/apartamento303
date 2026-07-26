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

import {
    inicializarDashboard,
    atualizarDashboard
} from "./js/dashboard.js";

import {
    inicializarCategorias
} from "./js/services/categorias.js";

import {
    carregarCategoriasFormulario
} from "./js/categorias-ui.js";

/* ==========================================================
   ELEMENTOS DA TELA
========================================================== */

const elementos = {

    form: $("formDespesa"),

    btnSalvar: $("btnSalvar"),

    mensagem: $("mensagem"),

    loading: $("loading"),

    data: $("data"),

    descricao: $("descricao"),

    categoria: $("categoria"),

    valor: $("valor"),

    pagante: $("pagante")

};

const {
    form,
    btnSalvar,
    mensagem,
    loading
} = elementos;

/**
 * Retorna um elemento do DOM.
 */
function $(id) {

    return document.getElementById(id);

}

/**
 * Verifica se um elemento existe.
 */
function existeElemento(elemento) {

    return elemento !== null &&
           elemento !== undefined;

}

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

window.addEventListener("load", iniciarAplicacao);

async function iniciarAplicacao() {

    document.title = APP_CONFIG.APP_NAME;

    const campoData = $("data");

    if (existeElemento(campoData)) {

        campoData.value = hojeISO();

    }

    observarAutenticacao(async (usuario) => {

        if (!usuario) {

            if (existeElemento(btnSalvar)) {

                btnSalvar.disabled = true;

            }

            if (existeElemento(mensagem)) {

                mensagem.className = "mensagem erro";
                mensagem.style.display = "block";
                mensagem.innerHTML =
                    "Faça login para utilizar o sistema.";

            }

            return;

        }

        if (existeElemento(btnSalvar)) {

            btnSalvar.disabled = false;

        }

       if (existeElemento(mensagem)) {

            ocultarMensagem();

}

        /* Inicializa as categorias padrão (somente na primeira execução) */
        await inicializarCategorias();

        /* Carrega as categorias no <select> do formulário */
        await carregarCategoriasFormulario();

        /* Inicializa o dashboard */
        await inicializarDashboard();

    });

}

/* ==========================================================
   LOADING
========================================================== */

function mostrarLoading() {

    if (existeElemento(loading)) {

        loading.classList.remove("hidden");
        loading.classList.remove("oculto");

    }

    if (existeElemento(btnSalvar)) {

        btnSalvar.disabled = true;

    }

}

function esconderLoading() {

    if (existeElemento(loading)) {

        loading.classList.add("hidden");

    }

    if (existeElemento(btnSalvar)) {

        btnSalvar.disabled = false;

    }

}

/* ==========================================================
   MENSAGENS
========================================================== */

function mostrarErro(texto) {
    if (!existeElemento(mensagem)) {
        return;
    }
    mensagem.classList.remove("sucesso", "erro", "hidden");
    mensagem.classList.add("erro");
    mensagem.textContent = texto;
    mensagem.classList.remove("hidden");
}

function mostrarSucesso(texto) {
    if (!existeElemento(mensagem)) {
        return;
    }
    mensagem.classList.remove("sucesso", "erro", "hidden");
    mensagem.classList.add("sucesso");
    mensagem.textContent = texto;
    mensagem.classList.remove("hidden");
}

function ocultarMensagem() {
    if (!existeElemento(mensagem)) {
        return;
    }
    mensagem.classList.add("hidden");
    mensagem.textContent = "";
    mensagem.classList.remove("sucesso", "erro");
}


/* ==========================================================
   LIMPAR FORMULÁRIO
========================================================== */

function limparFormulario() {

    form.reset();

    if (elementos.data) {

        elementos.data.value = hojeISO();

    }

}
/* ==========================================================
   DESPESA
========================================================== */

function criarObjetoDespesa(usuario) {

    return {

        data: elementos.data?.value || "",

        descricao: limparTexto(
            elementos.descricao?.value || ""
        ),

        categoria: elementos.categoria?.value || "",

        valor: converterValor(
            elementos.valor?.value || ""
        ),

        pagante: elementos.pagante?.value || "",

        usuarioId: usuario.uid,

        usuarioNome: usuario.nome,

        criadoPor: usuario.email

    };

}

function validarDespesa(despesa) {

    if (!despesa.data)
        return "Informe a data.";

    if (!despesa.descricao)
        return "Informe a descrição.";

    if (!despesa.categoria)
        return "Selecione a categoria.";

    if (despesa.valor <= 0)
        return "Informe um valor válido.";

    if (!despesa.pagante)
        return "Selecione quem pagou.";

    return null;

}

/* ==========================================================
   SALVAR DESPESA
========================================================== */

if (existeElemento(form)) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (existeElemento(mensagem)) {

            ocultarMensagem();

        }

        const usuario = getUsuarioAtual();

        if (!usuario) {

            if (existeElemento(mensagem)) {

                mensagem.className = "mensagem erro";
                mensagem.style.display = "block";
                mensagem.innerHTML =
                    "Faça login para continuar.";

            }

            return;

        }

        const despesa = criarObjetoDespesa(usuario);

        /* ==========================
           VALIDAÇÕES
        ========================== */

const erroValidacao = validarDespesa(despesa);

if (erroValidacao) {

    mostrarErro(erroValidacao);

    return;

}
 
        mostrarLoading();

        try {

            await salvarDespesa(despesa);

            limparFormulario();

            const hoje = new Date();

            await atualizarDashboard(

                hoje.getMonth() + 1,

                hoje.getFullYear()

            );


            mostrarMensagem(
                "Despesa salva com sucesso."
            );

        } catch (erro) {

            console.error(erro);

            if (existeElemento(mensagem)) {

                mostrarErro("Erro ao salvar despesa.");

            }

        } finally {

            esconderLoading();

        }

    });

}


/* ==========================================================
   EXPORTAÇÃO
========================================================== */

export {
    iniciarAplicacao
};
