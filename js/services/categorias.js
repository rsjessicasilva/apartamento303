/**
 * ==========================================================
 * Apartamento 303
 * Controle Financeiro
 * Versão: 3.0.0
 * Arquivo: js/services/categorias.js
 * ==========================================================
 */

import { db } from "../../firebase.js";

import {
    COLLECTIONS
} from "../config.js";

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

/* ==========================================================
   CONFIGURAÇÃO
========================================================== */

const categoriasRef = collection(
    db,
    COLLECTIONS.CATEGORIES
);

const CATEGORIAS_PADRAO = [

    "Água",
    "Alimentação",
    "Assinaturas",
    "Condomínio",
    "Energia",
    "Farmácia",
    "Internet",
    "Lazer",
    "Limpeza",
    "Manutenção",
    "Mercado",
    "Outros",
    "Pets",
    "Saúde",
    "Transporte"

];

/* ==========================================================
   HELPERS
========================================================== */

function getCategoriaRef(id = null) {

    if (id) {

        return doc(
            db,
            COLLECTIONS.CATEGORIES,
            id
        );

    }

    return categoriasRef;

}

function converterResultado(snapshot) {

    return snapshot.docs.map(item => ({

        id: item.id,

        ...item.data()

    }));

}

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

export async function inicializarCategorias() {

    const existentes = await listarCategorias();

    if (existentes.length > 0) {

        return;

    }

    for (const nome of CATEGORIAS_PADRAO) {

        await salvarCategoria(nome);

    }

}

/* ==========================================================
   LISTAR
========================================================== */

export async function listarCategorias() {

    try {

        const consulta = query(

            categoriasRef,

            orderBy("nome")

        );

        const resultado = await getDocs(
            consulta
        );

        return converterResultado(
            resultado
        );

    } catch (erro) {

        console.error(
            "Erro ao listar categorias:",
            erro
        );

        throw erro;

    }

}

/* ==========================================================
   OBTER
========================================================== */

export async function obterCategoria(id) {

    try {

        const snap = await getDoc(
            getCategoriaRef(id)
        );

        if (!snap.exists()) {

            return null;

        }

        return {

            id: snap.id,

            ...snap.data()

        };

    } catch (erro) {

        console.error(
            "Erro ao obter categoria:",
            erro
        );

        throw erro;

    }

}

/* ==========================================================
   EXISTE
========================================================== */

export async function categoriaExiste(nome) {

    const consulta = query(

        categoriasRef,

        where(
            "nome",
            "==",
            nome.trim()
        )

    );

    const resultado = await getDocs(
        consulta
    );

    return !resultado.empty;

}

/* ==========================================================
   SALVAR
========================================================== */

export async function salvarCategoria(nome) {

    try {

        nome = nome.trim();

        if (await categoriaExiste(nome)) {

            throw new Error(
                "Categoria já cadastrada."
            );

        }

        const ref = await addDoc(
            categoriasRef,
            {

                nome,

                ativo: true,

                criadoEm: Timestamp.now(),

                atualizadoEm: Timestamp.now()

            }
        );

        return {

            sucesso: true,

            id: ref.id

        };

    } catch (erro) {

        console.error(
            "Erro ao salvar categoria:",
            erro
        );

        throw erro;

    }

}

/* ==========================================================
   ATUALIZAR
========================================================== */

export async function atualizarCategoria(
    id,
    nome
) {

    try {

        await updateDoc(

            getCategoriaRef(id),

            {

                nome: nome.trim(),

                atualizadoEm: Timestamp.now()

            }

        );

        return {

            sucesso: true

        };

    } catch (erro) {

        console.error(
            "Erro ao atualizar categoria:",
            erro
        );

        throw erro;

    }

}

/* ==========================================================
   EXCLUIR
========================================================== */

export async function excluirCategoria(id) {

    try {

        await deleteDoc(
            getCategoriaRef(id)
        );

        return {

            sucesso: true

        };

    } catch (erro) {

        console.error(
            "Erro ao excluir categoria:",
            erro
        );

        throw erro;

    }

}