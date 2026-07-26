/**
 * ==========================================================
 * Apartamento 303
 * Controle Financeiro
 * Versão: 3.0.0
 * Arquivo: config.js
 * ==========================================================
 */

export const APP_CONFIG = {

    APP_NAME: "Apartamento 303",

    APP_VERSION: "3.0.0",

    CURRENCY: "BRL",

    LOCALE: "pt-BR",

    DATE_FORMAT: "pt-BR",

    PASSWORD_MONTH_CLOSE: "2403",

    ENABLE_VOICE_INPUT: true,

    ENABLE_RECEIPT_UPLOAD: true,

    MAX_RECEIPT_SIZE_MB: 10,

    ALLOWED_RECEIPT_TYPES: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf"
    ]

};

export const USERS = {

    JESSICA: {
        id: "jessica",
        nome: "Jessica"
    },

    JULIANA: {
        id: "juliana",
        nome: "Juliana"
    }

};

export const EXPENSE_TYPE = {

    SHARED: "DIVIDIDA",

    OTHER_PAYS: "OUTRA_PAGA"

};

export const COLLECTIONS = {
    USERS: "usuarios",
    CATEGORIES: "categorias",
    EXPENSES: "despesas",
    SETTINGS: "configuracoes",
    CLOSINGS: "fechamentos"
};


export const SETTINGS_DOCUMENT = "geral";
