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
    formatarMoeda
} from "./utils.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

const elementos = {

    totalMes: document.getElementById("totalMes"),

    totalJessica: document.getElementById("totalJessica"),

    totalJuliana: document.getElementById("totalJuliana"),

    quantidadeDespesas: document.getElementById("quantidadeDespesas"),

    listaUltimasDespesas:
        document.getElementById("listaUltimasDespesas")

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

    const total = calcularTotalDespesas(despesas);

    const totalJessica = calcularTotalDespesas(

        despesas.filter(

            d => d.pagante === "Jessica"

        )

    );

    const totalJuliana = calcularTotalDespesas(

        despesas.filter(

            d => d.pagante === "Juliana"

        )

    );

    if (elementos.totalMes) {

        elementos.totalMes.textContent =
            formatarMoeda(total);

    }

    if (elementos.totalJessica) {

        elementos.totalJessica.textContent =
            formatarMoeda(totalJessica);

    }

    if (elementos.totalJuliana) {

        elementos.totalJuliana.textContent =
            formatarMoeda(totalJuliana);

    }

    if (elementos.quantidadeDespesas) {

        elementos.quantidadeDespesas.textContent =
            despesas.length;

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
        .sort(

        (a, b) =>

            new Date(b.data) - new Date(a.data)

    )
    .slice(0, 10)
        .forEach(despesa => {

            const item =
                document.createElement("div");

            item.className = "despesaItem";

            item.innerHTML = `
                <div class="descricao">
                    ${despesa.descricao}
                </div>

                <div class="valor">
                    ${formatarMoeda(despesa.valor)}
                </div>
            `;

            elementos.listaUltimasDespesas
                .appendChild(item);

        });

}