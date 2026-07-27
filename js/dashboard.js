/**
 * ==========================================================
 * Apartamento 303
 * Dashboard
 * Versão 3.0.0
 * Arquivo: js/dashboard.js
 * ==========================================================
 */

import {
    listarDespesasMes,
    calcularTotalDespesas
} from "./services/despesas.js";

import {
    formatarMoeda, 
} from "./utils.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

const elementos = {

    totalMes: document.getElementById("totalMes"),

    totalJessica: document.getElementById("totalJessica"),

    totalJuliana: document.getElementById("totalJuliana"),

    valorJessicaDeve: document.getElementById("valorJessicaDeve"),

    valorJulianaDeve: document.getElementById("valorJulianaDeve"),

    quantidadeDespesas: document.getElementById("quantidadeDespesas"),

    resultadoAcerto: document.getElementById("resultadoAcerto"),

    listaUltimasDespesas: document.getElementById("listaUltimasDespesas")

};
 


/* ==========================================================
   API PÚBLICA
========================================================== */

export async function inicializarDashboard() {

    const hoje = new Date();

    await atualizarDashboard(

        hoje.getMonth() + 1,

        hoje.getFullYear()

    );

}

export async function atualizarDashboard(

    mes,

    ano

) {

    const despesas = await listarDespesasMes(

        mes,

        ano

    );

    atualizarCards(despesas);

    atualizarHistorico(despesas);
 

// Futuro:
// atualizarGraficos(despesas);
// atualizarCategorias(despesas);
// atualizarIndicadores(despesas);

}

/* ==========================================================
   CARDS
========================================================== */

function atualizarCards(despesas) {

    let totalJessicaDividida = 0;
    let totalJulianaDividida = 0;

    let outraPagaJessica = 0;
    let outraPagaJuliana = 0;

    despesas.forEach((despesa) => {

        const valor = Number(despesa.valor) || 0;

        if (despesa.tipoDespesa === "OUTRA_PAGA") {

            if (despesa.pagante === "Jessica") {

                // Jessica pagou uma despesa da Juliana
                outraPagaJuliana += valor;

            } else {

                // Juliana pagou uma despesa da Jessica
                outraPagaJessica += valor;

            }

        } else {

            if (despesa.pagante === "Jessica") {

                totalJessicaDividida += valor;

            } else {

                totalJulianaDividida += valor;

            }

        }

    });

    const totalDividido =
        totalJessicaDividida +
        totalJulianaDividida;

    const totalMes =
        totalDividido +
        outraPagaJessica +
        outraPagaJuliana;

    const metade = totalDividido / 2;

    const totalJessicaPago =
        totalJessicaDividida +
        outraPagaJuliana;

    const totalJulianaPago =
        totalJulianaDividida +
        outraPagaJessica;

    const jessicaDeve =
        metade +
        outraPagaJessica;

    const julianaDeve =
        metade +
        outraPagaJuliana;

    /* ===========================
       TOTAL DO MÊS
    ============================ */

    if (elementos.totalMes) {

        elementos.totalMes.textContent =
            formatarMoeda(totalMes);

    }

    /* ===========================
       JESSICA DEVE
    ============================ */

    if (elementos.valorJessicaDeve) {

        elementos.valorJessicaDeve.textContent =
            formatarMoeda(jessicaDeve);

    }

    /* ===========================
       JULIANA DEVE
    ============================ */

    if (elementos.valorJulianaDeve) {

        elementos.valorJulianaDeve.textContent =
            formatarMoeda(julianaDeve);

    }

    /* ===========================
       TOTAL PAGO
    ============================ */

    if (elementos.totalJessica) {

        elementos.totalJessica.textContent =
            formatarMoeda(totalJessicaPago);

    }

    if (elementos.totalJuliana) {

        elementos.totalJuliana.textContent =
            formatarMoeda(totalJulianaPago);

    }

    /* ===========================
       QUANTIDADE
    ============================ */

    if (elementos.quantidadeDespesas) {

        elementos.quantidadeDespesas.textContent =
            despesas.length;

    }

    /* ===========================
       ACERTO DO MÊS
    ============================ */

    if (elementos.resultadoAcerto) {

        const diferenca =
            Math.abs(jessicaDeve - julianaDeve);

        if (diferenca < 0.01) {

            elementos.resultadoAcerto.innerHTML = `
                <span class="textoRoxo">
                    ✔ Contas equilibradas
                </span>
            `;

        }

        else if (jessicaDeve > julianaDeve) {

            elementos.resultadoAcerto.innerHTML = `
                <span class="nomeDevedor">
                    Jessica
                </span>
                deve pagar
                <strong>${formatarMoeda(diferenca)}</strong>
                para Juliana
            `;

        }

        else {

            elementos.resultadoAcerto.innerHTML = `
                <span class="nomeDevedor">
                    Juliana
                </span>
                deve pagar
                <strong>${formatarMoeda(diferenca)}</strong>
                para Jessica
            `;

        }

    }

}

/* ==========================================================
   HISTÓRICO
========================================================== */

function atualizarHistorico(despesas) {

    if (!elementos.listaUltimasDespesas) {

        return;

    }

    elementos.listaUltimasDespesas.innerHTML = "";

    if (!despesas.length) {

        elementos.listaUltimasDespesas.innerHTML = `
            <div class="semDados">
                Nenhuma despesa cadastrada.
            </div>
        `;

        return;

    }

    despesas
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 10)
        .forEach((despesa) => {

            const item = document.createElement("div");

            item.className = "despesaItem";

            const tipoDespesa =
                despesa.tipoDespesa === "OUTRA_PAGA"
                    ? "OUTRA PAGA"
                    : "DIVIDIDA";

            const legenda =
                despesa.tipoDespesa === "OUTRA_PAGA"
                    ? "A outra paga"
                    : "Divide pelas duas";

            item.innerHTML = `

                <div class="descricao">

                    <strong>${despesa.categoria}</strong><br>

                    <span class="paganteHistorico">

                        ${despesa.pagante} pagou

                    </span>

                    <br>

                    <span class="tipoDespesaHistorico">

                        <strong>Situação da conta:</strong>
                        ${legenda}

                    </span>

                </div>

                <div class="valor">

                    ${formatarMoeda(despesa.valor)}

                </div>

            `;

            elementos.listaUltimasDespesas.appendChild(item);

        });

}

/* ==========================================================
   EXPORTAÇÃO
========================================================== */

const btnExportarPDF =
    document.getElementById("btnExportarPDF");

const btnExportarExcel =
    document.getElementById("btnExportarExcel");

const btnExportarCsv =
    document.getElementById("btnExportarCsv");

/* ==========================================================
   NOME DO ARQUIVO
========================================================== */

function obterNomeArquivo() {

    const hoje = new Date();

    return `Apartamento303_${hoje.getFullYear()}-${String(
        hoje.getMonth() + 1
    ).padStart(2, "0")}`;

}

/* ==========================================================
   DADOS DO MÊS
========================================================== */

async function obterDadosExportacao() {

    const hoje = new Date();

    const despesas = await listarDespesasMes(

        hoje.getMonth() + 1,

        hoje.getFullYear()

    );

    return despesas;

}

/* ==========================================================
   EVENTOS
========================================================== */

if (btnExportarPDF) {

    btnExportarPDF.addEventListener(

        "click",

        exportarPDF

    );

}

if (btnExportarExcel) {

    btnExportarExcel.addEventListener(

        "click",

        exportarExcel

    );

}

if (btnExportarCsv) {

    btnExportarCsv.addEventListener(

        "click",

        exportarCSV

    );

}



/* ==========================================================
   EXPORTAR PDF
========================================================== */

async function exportarPDF() {

    try {

        const despesas = await obterDadosExportacao();

        if (!despesas.length) {

            alert("Não existem despesas para exportar.");

            return;

        }

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: "a4"

        });

        const nomeArquivo = obterNomeArquivo();

        const hoje = new Date();

        let y = 18;

        doc.setFontSize(18);
        doc.text("Apartamento 303", 15, y);

        y += 8;

        doc.setFontSize(12);
        doc.text("Relatório Financeiro", 15, y);

        y += 7;

        doc.text(

            `Período: ${String(
                hoje.getMonth() + 1
            ).padStart(2, "0")}/${hoje.getFullYear()}`,

            15,

            y

        );

        y += 12;

        doc.setFontSize(10);

        doc.text("Data", 15, y);
        doc.text("Categoria", 40, y);
        doc.text("Pagante", 90, y);
        doc.text("Situação", 125, y);
        doc.text("Valor", 180, y, {

            align: "right"

        });

        y += 4;

        doc.line(15, y, 195, y);

        y += 6;

        let total = 0;

        despesas.forEach((despesa) => {

            const valor = Number(despesa.valor) || 0;

            total += valor;

            const situacao =

                despesa.tipoDespesa === "OUTRA_PAGA"

                    ? "Outra paga"

                    : "Divide pelas duas";

            doc.text(

                String(despesa.data),

                15,

                y

            );

            doc.text(

                String(despesa.categoria),

                40,

                y

            );

            doc.text(

                String(despesa.pagante),

                90,

                y

            );

            doc.text(

                situacao,

                125,

                y

            );

            doc.text(

                formatarMoeda(valor),

                195,

                y,

                {

                    align: "right"

                }

            );

            y += 7;

            if (y > 275) {

                doc.addPage();

                y = 20;

            }

        });

        doc.line(15, y, 195, y);

        y += 8;

        doc.setFontSize(12);

        doc.text(

            `Total do mês: ${formatarMoeda(total)}`,

            15,

            y

        );

        doc.save(`${nomeArquivo}.pdf`);

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao exportar PDF.");

    }

}
/* ==========================================================
   EXPORTAR EXCEL
========================================================== */

async function exportarExcel() {

    try {

        const despesas = await obterDadosExportacao();

        if (!despesas.length) {

            alert("Não existem despesas para exportar.");

            return;

        }

        const nomeArquivo = obterNomeArquivo();

        let total = 0;

        const dados = despesas.map((despesa) => {

            const valor = Number(despesa.valor) || 0;

            total += valor;

            return {

                "Data": despesa.data,

                "Categoria": despesa.categoria,

                "Pagante": despesa.pagante,

                "Situação da Conta":

                    despesa.tipoDespesa === "OUTRA_PAGA"

                        ? "Outra paga"

                        : "Divide pelas duas",

                "Valor": valor,

                "Observação":

                    despesa.observacao || ""

            };

        });

        dados.push({

            "Data": "",

            "Categoria": "",

            "Pagante": "",

            "Situação da Conta": "TOTAL",

            "Valor": total,

            "Observação": ""

        });

        const worksheet = XLSX.utils.json_to_sheet(dados);

        worksheet["!cols"] = [

            { wch: 12 },

            { wch: 25 },

            { wch: 15 },

            { wch: 22 },

            { wch: 15 },

            { wch: 35 }

        ];

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(

            workbook,

            worksheet,

            "Despesas"

        );

        XLSX.writeFile(

            workbook,

            `${nomeArquivo}.xlsx`

        );

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao exportar Excel.");

    }
}

/* ==========================================================
   EXPORTAR CSV
========================================================== */

async function exportarCSV() {

    try {

        const despesas = await obterDadosExportacao();

        if (!despesas.length) {

            alert("Não existem despesas para exportar.");

            return;

        }

        const nomeArquivo = obterNomeArquivo();

        let csv =
            "Data;Categoria;Pagante;Situação da Conta;Valor;Observação\n";

        let total = 0;

        despesas.forEach((despesa) => {

            const valor = Number(despesa.valor) || 0;

            total += valor;

            csv +=

                `${despesa.data};` +

                `${despesa.categoria};` +

                `${despesa.pagante};` +

                `${despesa.tipoDespesa === "OUTRA_PAGA"

                    ? "Outra paga"

                    : "Divide pelas duas"};` +

                `${valor.toFixed(2)};` +

                `"${despesa.observacao || ""}"\n`;

        });

        csv +=

            `;;;;${total.toFixed(2)};\n`;

        const blob = new Blob(

            [csv],

            {

                type: "text/csv;charset=utf-8;"

            }

        );

        const link = document.createElement("a");

        link.href =

            URL.createObjectURL(blob);

        link.download =

            `${nomeArquivo}.csv`;

        link.click();

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao exportar CSV.");

    }

}
