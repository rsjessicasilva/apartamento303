/**
 * ==========================================================
 * Apartamento 303
 * Controle Financeiro
 * Versão: 3.0.0
 * Arquivo: js/services/despesas.js
 * ==========================================================
 */

import { db } from "../../firebase.js";

import {
    COLLECTIONS
} from "../config.js";

import {
    gerarNumeroDespesa
} from "../utils.js";

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

/**
 * Retorna referência da coleção
 */
const despesasRef = collection(
    db,
    COLLECTIONS.EXPENSES
);

/**
 * Salvar despesa
 */
export async function salvarDespesa(despesa) {

    const documento = {

        numero: gerarNumeroDespesa(),

        data: Timestamp.fromDate(
            new Date(despesa.data)
        ),

        descricao: despesa.descricao,

        categoria: despesa.categoria,

        valor: Number(despesa.valor),

        pagante: despesa.pagante,

        criadoEm: Timestamp.now(),

        atualizadoEm: Timestamp.now()

    };

    const ref = await addDoc(
        despesasRef,
        documento
    );

    return ref.id;

}

/**
 * Atualizar despesa
 */
export async function atualizarDespesa(id, dados) {

    const ref = doc(
        db,
        COLLECTIONS.EXPENSES,
        id
    );

    dados.atualizadoEm = Timestamp.now();

    if (dados.data) {

        dados.data = Timestamp.fromDate(
            new Date(dados.data)
        );

    }

    await updateDoc(ref, dados);

}

/**
 * Excluir despesa
 */
export async function excluirDespesa(id) {

    await deleteDoc(
        doc(
            db,
            COLLECTIONS.EXPENSES,
            id
        )
    );

}

/**
 * Buscar uma despesa
 */
export async function obterDespesa(id) {

    const ref = doc(
        db,
        COLLECTIONS.EXPENSES,
        id
    );

    const snap = await getDoc(ref);

    if (!snap.exists()) {

        return null;

    }

    return {

        id: snap.id,

        ...snap.data()

    };

}

/**
 * Listar todas
 */
export async function listarDespesas() {

    const consulta = query(
        despesasRef,
        orderBy("data", "desc")
    );

    const resultado = await getDocs(
        consulta
    );

    return resultado.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}

/**
 * Listar por mês/ano
 */
export async function listarDespesasMes(
    mes,
    ano
) {

    const inicio = new Date(
        ano,
        mes - 1,
        1
    );

    const fim = new Date(
        ano,
        mes,
        1
    );

    const consulta = query(

        despesasRef,

        where(
            "data",
            ">=",
            Timestamp.fromDate(inicio)
        ),

        where(
            "data",
            "<",
            Timestamp.fromDate(fim)
        ),

        orderBy("data", "desc")

    );

    const resultado = await getDocs(
        consulta
    );

    return resultado.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}
