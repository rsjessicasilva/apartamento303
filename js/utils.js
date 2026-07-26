/**
 * ==========================================================
 * Apartamento 303
 * Controle Financeiro
 * Versão: 3.0.0
 * Arquivo: utils.js
 * ==========================================================
 */

/**
 * Formata número para moeda brasileira
 */
export function formatarMoeda(valor) {

    const numero = Number(valor || 0);

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}

/**
 * Converte texto em número
 *
 * Aceita:
 * 100
 * 100,50
 * 100.50
 * 1.250,80
 */
export function converterValor(texto) {

    if (!texto) return 0;

    texto = texto.toString().trim();

    texto = texto.replace(/\s/g, "");

    if (texto.includes(",") && texto.includes(".")) {

        texto = texto.replace(/\./g, "");

        texto = texto.replace(",", ".");

    } else {

        texto = texto.replace(",", ".");

    }

    const numero = Number(texto);

    return isNaN(numero) ? 0 : numero;

}

/**
 * Data atual
 */
export function hojeISO() {

    const hoje = new Date();

    return hoje.toISOString().split("T")[0];

}

/**
 * Formata data ISO para pt-BR
 */
export function formatarData(dataISO) {

    if (!dataISO) return "";

    return new Date(dataISO)
        .toLocaleDateString("pt-BR");

}

/**
 * Retorna mês
 */
export function obterMes(dataISO) {

    return new Date(dataISO).getMonth() + 1;

}

/**
 * Retorna ano
 */
export function obterAno(dataISO) {

    return new Date(dataISO).getFullYear();

}

/**
 * Gera ID amigável
 */
export function gerarNumeroDespesa() {

    return "DESP-" + Date.now();

}

/**
 * Remove espaços extras
 */
export function limparTexto(texto) {

    return texto
        ?.trim()
        .replace(/\s+/g, " ") || "";

}

/**
 * Verifica se existe valor
 */
export function possuiValor(valor) {

    return valor !== null &&
           valor !== undefined &&
           valor !== "";

}

/**
 * Formata nome
 */
export function capitalizar(texto) {

    if (!texto) return "";

    return texto
        .toLowerCase()
        .replace(/\b\w/g, letra => letra.toUpperCase());

}

/**
 * Delay
 */
export function aguardar(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

/**
 * Toast simples
 */
export function mostrarMensagem(texto) {

    alert(texto);

}

/**
 * Confirmação
 */
export function confirmar(texto) {

    return confirm(texto);

}
