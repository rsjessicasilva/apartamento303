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

    collection,
    addDoc,
    updateDoc,
    doc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    serverTimestamp,
    writeBatch

} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

/* ==========================================================
   HELPERS
========================================================== */

const despesasRef = collection(
    db,
    COLLECTIONS.EXPENSES
);

function getDespesaRef(id = null) {

    if (id) {

        return doc(
            db,
            COLLECTIONS.EXPENSES,
            id
        );

    }

    return despesasRef;

}

function converterResultado(snapshot) {

    return snapshot.docs.map(item => {

        const dados = item.data();

        return {

            id: item.id,

            ...dados,

            data: dados.data?.toDate
                ? dados.data.toDate()
                : dados.data

        };

    });

}

/* ==========================================================
   SALVAR
========================================================== */

export async function salvarDespesa(despesa) {

    try {


const dataReferencia = new Date(despesa.data);

const documento = {

    data: Timestamp.fromDate(
        dataReferencia
    ),

    categoria: despesa.categoria,

    valor: despesa.valor,

    pagante: despesa.pagante,

    tipoDespesa: despesa.tipoDespesa,

    observacao: despesa.observacao ?? "",

    usuarioId: despesa.usuarioId,

    usuarioNome: despesa.usuarioNome,

    criadoPor: despesa.criadoPor,

    criadoEm: serverTimestamp(),

    /* ==========================================================
       CONTROLE DE FECHAMENTO
    ========================================================== */

    status: "ABERTO",

    mesReferencia:
        `${dataReferencia.getFullYear()}-${String(
            dataReferencia.getMonth() + 1
        ).padStart(2, "0")}`

};


        const ref = await addDoc(
            despesasRef,
            documento
        );

        return {

            sucesso: true,

            id: ref.id

        };

    } catch (erro) {

        console.error(
            "Erro ao salvar despesa:",
            erro
        );

        throw erro;

    }

}

/* ==========================================================
   ATUALIZAR
========================================================== */

export async function atualizarDespesa(
    id,
    dados
) {

    try {

        if (dados.data) {

            dados.data = Timestamp.fromDate(
                new Date(dados.data)
            );

        }

            dados.atualizadoEm =
                serverTimestamp();

        await updateDoc(
            getDespesaRef(id),
            dados
        );

        return {

            sucesso: true

        };

    } catch (erro) {

        console.error(
            "Erro ao atualizar despesa:",
            erro
        );

        throw erro;

    }

}

/* ==========================================================
   EXCLUIR
========================================================== */

export async function excluirDespesa(id) {

    try {

        await deleteDoc(
            getDespesaRef(id)
        );

        return {

            sucesso: true

        };

    } catch (erro) {

        console.error(
            "Erro ao excluir despesa:",
            erro
        );

        throw erro;

    }

}

/* ==========================================================
   OBTER
========================================================== */

export async function obterDespesa(id) {

    try {

        const snap = await getDoc(
            getDespesaRef(id)
        );

        if (!snap.exists()) {

            return null;

        }

        const dados = snap.data();

        return {

            id: snap.id,

            ...dados,

            data: dados.data?.toDate
                ? dados.data.toDate()
                : dados.data

};

    } catch (erro) {

        console.error(
            "Erro ao obter despesa:",
            erro
        );

        throw erro;

    }

}

/* ==========================================================
   LISTAR TODAS
========================================================== */

export async function listarDespesas() {

    try {

        const consulta = query(
            despesasRef,
            orderBy("data", "desc")
        );

        const resultado =
            await getDocs(consulta);

        return converterResultado(
            resultado
        );

    } catch (erro) {

        console.error(
            "Erro ao listar despesas:",
            erro
        );

        throw erro;

    }

}

/* ==========================================================
   LISTAR POR MÊS
========================================================== */

export async function listarDespesasMes(
    mes,
    ano
) {

    try {

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
                "status",
                "==",
                "ABERTO"
        ),

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

            orderBy(
                "data",
                "desc"
        )

); 
        

        const resultado =
            await getDocs(
                consulta
            );

        return converterResultado(
            resultado
        );

    } catch (erro) {

        console.error(
            "Erro ao listar despesas do mês:",
            erro
        );

        throw erro;

    }

}

/* ==========================================================
   CONSULTAS
========================================================== */

/**
 * Lista despesas de um pagante.
 */
export async function listarDespesasPorPagante(
    pagante
) {

    try {

        const consulta = query(

            despesasRef,

            where(
                "pagante",
                "==",
                pagante
            ),

            orderBy(
                "data",
                "desc"
            )

        );

        const resultado =
            await getDocs(
                consulta
            );

        return converterResultado(
            resultado
        );

    } catch (erro) {

        console.error(
            "Erro ao listar despesas por pagante:",
            erro
        );

        throw erro;

    }

}
/**
 * Lista despesas por categoria.
 */
export async function listarDespesasPorCategoria(
    categoria
) {

    try {

        const consulta = query(

            despesasRef,

            where(
                "categoria",
                "==",
                categoria
            ),

            orderBy(
                "data",
                "desc"
            )

        );

        const resultado =
            await getDocs(
                consulta
            );

        return converterResultado(
            resultado
        );

    } catch (erro) {

        console.error(
            "Erro ao listar despesas por categoria:",
            erro
        );

        throw erro;

    }

}
/**
 * Calcula o total de uma lista.
 */
export function calcularTotalDespesas(
    despesas
) {

    return despesas.reduce(

        (total, despesa) =>

            total +
            Number(
                despesa.valor || 0
            ),

        0

    );

}
/**
 * Quantidade de despesas.
 */
export function contarDespesas(despesas = []) {

    return despesas.length;

}
/* ==========================================================
   FECHAR MÊS
========================================================== */

export async function fecharMesDespesas(
    mes,
    ano
) {

    try {

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

            )

        );

        const resultado =
            await getDocs(
                consulta
            );

        const batch =
            writeBatch(db);

        resultado.forEach((item) => {

            batch.update(

                item.ref,

                {

                    status: "FECHADO",

                    fechadoEm:
                        serverTimestamp()

                }

            );

        });

        await batch.commit();

    }

    catch (erro) {

        console.error(

            "Erro ao fechar mês:",

            erro

        );

        throw erro;

    }

}