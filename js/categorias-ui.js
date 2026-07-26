/**
 * ==========================================================
 * Apartamento 303
 * Controle Financeiro
 * Versão: 3.0.0
 * Arquivo: js/categorias-ui.js
 * ==========================================================
 */

import {
    listarCategorias
} from "./services/categorias.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

const selectCategoria = document.getElementById("categoria");

/* ==========================================================
   CARREGAR CATEGORIAS
========================================================== */

export async function carregarCategoriasFormulario() {

    if (!selectCategoria) {

        return;

    }

    try {

        const categorias = await listarCategorias();

        selectCategoria.innerHTML = "";

        const opcaoPadrao = document.createElement("option");

        opcaoPadrao.value = "";

        opcaoPadrao.textContent = "Selecione";

        selectCategoria.appendChild(opcaoPadrao);

        categorias.forEach(categoria => {

            if (categoria.ativo === false) {

                return;

            }

            const option = document.createElement("option");

            option.value = categoria.nome;

            option.textContent = categoria.nome;

            selectCategoria.appendChild(option);

        });

    } catch (erro) {

        console.error(

            "Erro ao carregar categorias:",

            erro

        );

    }

}

/* ==========================================================
   RECARREGAR
========================================================== */

export async function atualizarCategoriasFormulario() {

    await carregarCategoriasFormulario();

}