/**
 * ==========================================================
 * Apartamento 303
 * Controle Financeiro
 * Versão: 3.0.0
 * Arquivo: firebase.js
 * ==========================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

/**
 * Configuração do Firebase
 */
const firebaseConfig = {

    apiKey: "AIzaSyCYvj2ZwKepVG0-mWLWpSb9v_Y5LQyJs4o",

    authDomain: "apartamento303-3f259.firebaseapp.com",

    projectId: "apartamento303-3f259",

    storageBucket: "apartamento303-3f259.firebasestorage.app",

    messagingSenderId: "836613207893",

    appId: "1:836613207893:web:e3534d320430ca8fec61dc"

};

/**
 * Inicializa Firebase
 */
const app = initializeApp(firebaseConfig);

/**
 * Authentication
 */
const auth = getAuth(app);

/**
 * Cloud Firestore
 */
const db = getFirestore(app);

/**
 * Firebase Storage
 */
const storage = getStorage(app);

/**
 * Exportações
 */
export {

    app,

    auth,

    db,

    storage

};
