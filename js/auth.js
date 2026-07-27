/**
 * ==========================================================
 * Apartamento 303
 * Controle Financeiro
 * Versão: 3.0.0
 * Arquivo: auth.js
 * ==========================================================
 */

import { auth, db } from "../firebase.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { COLLECTIONS } from "./config.js";

let usuarioAtual = null;
let authInicializada = false;
/**
 * Login Google
 */
export async function fazerLogin() {

    try {

        const provider = new GoogleAuthProvider();

        provider.setCustomParameters({
            prompt: "select_account"
        });

        const resultado = await signInWithPopup(auth, provider);

        await salvarUsuario(resultado.user);
        usuarioAtual =
        await carregarUsuario(
        resultado.user.uid
    );
        return resultado.user;

    } catch (erro) {

        console.error("Erro ao fazer login:", erro);

        throw erro;

    }

}

/**
 * Logout
 */
export async function fazerLogout() {

  usuarioAtual = null;

    await signOut(auth);

}

/**
 * Observa autenticação
 */
export function observarAutenticacao(callback) {

console.log("AUTH 1 - Entrou em observarAutenticacao");
    onAuthStateChanged(auth, async (user) => {
        console.log("AUTH 2 - onAuthStateChanged disparou", user);

        if (!user) {
            console.log("AUTH 3 - Usuário não autenticado");
            usuarioAtual = null;

            authInicializada = true;

            callback(null);

            return;

        }
        console.log("AUTH 4 - Usuário autenticado");
        await salvarUsuario(user);

        usuarioAtual = await carregarUsuario(user.uid);

        authInicializada = true;

        callback(usuarioAtual);

    });

}

/**
 * Retorna usuário logado
 */
export function getUsuarioAtual() {

    return usuarioAtual;

}
/**
 * Indica se o Firebase já respondeu
 * ao primeiro estado de autenticação.
 */
export function authPronta() {

    return authInicializada;

}
/**
 * Jessica ou Juliana
 */
export function getNomeUsuario() {

    return usuarioAtual?.nome ?? "";

}

/**
 * UID
 */
export function getUidUsuario() {

    return usuarioAtual?.uid ?? "";

}

/**
 * Salva usuário
 */
async function salvarUsuario(user) {

    const ref = doc(
        db,
        COLLECTIONS.USERS,
        user.uid
    );

    const existente = await getDoc(ref);

    if (!existente.exists()) {

        await setDoc(ref, {

            uid: user.uid,

            nome: user.displayName,

            email: user.email,

            foto: user.photoURL,

            ativo: true,

            criadoEm: serverTimestamp(),

            ultimoLogin: serverTimestamp()

        });

    } else {

        await setDoc(
            ref,
            {

                ultimoLogin: serverTimestamp()

            },
            { merge: true }
        );

    }

}

/**
 * Carrega usuário Firestore
 */
async function carregarUsuario(uid) {

    const ref = doc(
        db,
        COLLECTIONS.USERS,
        uid
    );

    const snap = await getDoc(ref);

    if (!snap.exists()) {

        return null;

    }

return {

    uid,

    ...snap.data()

};

}