/**
 * ==========================================================
 * Apartamento 303
 * Controle Financeiro
 * Versão 3.0
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
    getUsuarioAtual,
    fazerLogin
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

console.log("APP.JS CARREGOU");

/* ==========================================================
   ELEMENTOS
========================================================== */

function $(id) {
    return document.getElementById(id);
}

function existeElemento(el) {
    return el !== null && el !== undefined;
}

const splash = $("splashScreen");
const login = $("loginScreen");
const appScreen = $("appScreen");
const dashboardScreen = $("dashboardScreen");
const btnDashboard = $("btnDashboard");
const btnVoltarCadastro = $("btnVoltarCadastro");
const elementos = {

    form: $("formDespesa"),

    btnSalvar: $("btnSalvar"),

    mensagem: $("mensagem"),

    loading: $("loading"),

    data: $("data"),

    descricao: $("descricao"),

    categoria: $("categoria"),

    valor: $("valor"),

    pagante: $("pagante"),

    btnLogin: $("btnLogin")

};

const {

    form,

    btnSalvar,

    mensagem,

    loading,

    btnLogin

} = elementos;

/* ==========================================================
   CONTROLE DAS TELAS
========================================================== */

function mostrarSplash() {

    if (splash)
        splash.style.display = "flex";

    if (login)
        login.classList.add("hidden");

    if (appScreen)
        appScreen.classList.add("hidden");

}

function mostrarTelaLogin() {

    if (splash)
        splash.style.display = "none";

    if (login)
        login.classList.remove("hidden");

    if (appScreen)
        appScreen.classList.add("hidden");

}

function mostrarAplicacao() {

    if (splash)
        splash.style.display = "none";

    if (login)
        login.classList.add("hidden");

    if (dashboardScreen)
        dashboardScreen.classList.add("hidden");

    if (appScreen)
        appScreen.classList.remove("hidden");

}
function mostrarDashboard() {

    if (appScreen)
        appScreen.classList.add("hidden");

    if (dashboardScreen)
        dashboardScreen.classList.remove("hidden");

}

function voltarCadastro() {

    if (dashboardScreen)
        dashboardScreen.classList.add("hidden");

    if (appScreen)
        appScreen.classList.remove("hidden");

}


/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

window.addEventListener("load", iniciarAplicacao);

async function iniciarAplicacao() {

    console.log("INICIANDO A APLICAÇÃO");

    document.title = APP_CONFIG.APP_NAME;

    mostrarSplash();

    if (existeElemento(elementos.data)) {

        elementos.data.value = hojeISO();

    }

    /* -------------------------
       LOGIN GOOGLE
    ------------------------- */

    if (existeElemento(btnLogin)) {

        btnLogin.addEventListener("click", async () => {

            btnLogin.disabled = true;

            try {

                await fazerLogin();

            } catch (erro) {

                console.error("Erro no login:", erro);

                mostrarErro("Não foi possível fazer login.");

            } finally {

                btnLogin.disabled = false;

            }

        });

    }
/* -------------------------
   BOTÃO DASHBOARD
------------------------- */

if (btnDashboard) {

    btnDashboard.addEventListener("click", async () => {

        const hoje = new Date();

        await atualizarDashboard(

            hoje.getMonth() + 1,

            hoje.getFullYear()

        );

        mostrarDashboard();

    });

}

/* -------------------------
   VOLTAR
------------------------- */

if (btnVoltarCadastro) {

    btnVoltarCadastro.addEventListener("click", () => {

        voltarCadastro();

    });

}
    /* -------------------------
       AUTENTICAÇÃO
    ------------------------- */

    observarAutenticacao(async (usuario) => {

        if (!usuario) {

            mostrarTelaLogin();

            return;

        }

        console.log("Usuário autenticado:", usuario);

        try {

            /* FOTO */

            const foto = $("fotoUsuario");

            if (foto && usuario.foto) {

                foto.src = usuario.foto;

            }

            /* NOME */

            const nome = $("nomeUsuario");

            if (nome) {

                nome.textContent = usuario.nome;

            }

            /* EMAIL */

            const email = $("emailUsuario");

            if (email) {

                email.textContent = usuario.email;

            }

            console.log("Inicializando categorias...");

            await inicializarCategorias();

            console.log("Categorias inicializadas.");

            await carregarCategoriasFormulario();

            console.log("Categorias carregadas.");

            console.log("Inicializando dashboard...");

            await inicializarDashboard();

            console.log("Dashboard inicializado.");

            mostrarAplicacao();

        } catch (erro) {

            console.error("Erro na inicialização:", erro);

            mostrarErro("Erro ao carregar a aplicação.");

        }

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

    if (!form) return;

    form.reset();

    if (elementos.data) {
        elementos.data.value = hojeISO();
    }

    const tipoDividida = document.querySelector(
        'input[name="tipoDespesa"][value="DIVIDIDA"]'
    );

    if (tipoDividida) {
        tipoDividida.checked = true;
    }

    ocultarMensagem();

}

/* ==========================================================
   DESPESA
========================================================== */

function criarObjetoDespesa(usuario) {

    const tipoSelecionado = document.querySelector(
        'input[name="tipoDespesa"]:checked'
    );

    return {

        data: elementos.data?.value || "",

        categoria: elementos.categoria?.value || "",

        valor: converterValor(
            elementos.valor?.value || ""
        ),

        pagante: elementos.pagante?.value || "",

        tipoDespesa: tipoSelecionado
            ? tipoSelecionado.value
            : "DIVIDIDA",

        observacao: limparTexto(
            document.getElementById("observacao")?.value || ""
        ),

        usuarioId: usuario.uid,

        usuarioNome: usuario.nome,

        criadoPor: usuario.email

    };

}

function validarDespesa(despesa) {

    if (!despesa.data) {
        return "Informe a data.";
    }

    if (!despesa.categoria) {
        return "Selecione uma categoria.";
    }

    if (despesa.valor <= 0) {
        return "Informe um valor válido.";
    }

    if (!despesa.pagante) {
        return "Selecione quem pagou.";
    }

    return null;

}

/* ==========================================================
   SALVAR DESPESA
========================================================== */

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        ocultarMensagem();

        const usuario = getUsuarioAtual();

        if (!usuario) {

            mostrarErro("Faça login para continuar.");

            return;

        }

        const despesa = criarObjetoDespesa(usuario);

        const erro = validarDespesa(despesa);

        if (erro) {

            mostrarErro(erro);

            return;

        }

        mostrarLoading();

        try {

            console.log("Salvando despesa...", despesa);

            await salvarDespesa(despesa);

            console.log("Despesa salva com sucesso.");

            limparFormulario();

            const hoje = new Date();

            await atualizarDashboard(

                hoje.getMonth() + 1,

                hoje.getFullYear()

            );

            mostrarSucesso(
                "Despesa cadastrada com sucesso."
            );

        } catch (erro) {

            console.error(
                "Erro ao salvar despesa:",
                erro
            );

            mostrarErro(
                "Não foi possível salvar a despesa."
            );

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
