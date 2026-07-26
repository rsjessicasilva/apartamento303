/*************************************************
 * CONTROLE APARTAMENTO 303
 * firebase.js
 * Versão 3.0
 *************************************************/

/* ===== IMPORTS FIREBASE ===== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence

} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {

    getFirestore

} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


/*================================================
 CONFIGURAÇÃO FIREBASE
================================================*/

/*
Substituir pelos dados do projeto Firebase
*/

const firebaseConfig = {

    apiKey: "SUA_API_KEY",

    authDomain: "SEU_PROJETO.firebaseapp.com",

    projectId: "SEU_PROJETO",

    storageBucket: "SEU_PROJETO.appspot.com",

    messagingSenderId: "000000000000",

    appId: "1:000000000000:web:000000000000"

};


/*================================================
 INICIALIZAÇÃO
================================================*/

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const provider = new GoogleAuthProvider();


/*================================================
 MANTER LOGIN
================================================*/

await setPersistence(

    auth,

    browserLocalPersistence

);


/*================================================
 LOGIN
================================================*/

export async function loginGoogle(){

    try{

        const resultado =

        await signInWithPopup(

            auth,

            provider

        );

        return resultado.user;

    }

    catch(erro){

        console.error(erro);

        throw erro;

    }

}


/*================================================
 LOGOUT
================================================*/

export async function logout(){

    await signOut(auth);

}


/*================================================
 USUÁRIO ATUAL
================================================*/

export function usuarioAtual(){

    return auth.currentUser;

}


/*================================================
 OBSERVADOR
================================================*/

export function observarLogin(callback){

    onAuthStateChanged(

        auth,

        callback

    );

}


/*================================================
 EXPORTS
================================================*/

export {

    db,

    auth

};
