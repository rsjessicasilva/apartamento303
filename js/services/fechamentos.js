/* ==========================================================
   FIREBASE
========================================================== */

import {

    db

} from "../../firebase.js";

import {

    collection,
    addDoc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

/* ==========================================================
   COLLECTION
========================================================== */

const fechamentosRef =
    collection(db, "fechamentos");

/* ==========================================================
   SALVAR FECHAMENTO
========================================================== */

export async function salvarFechamento(resumo) {

    const documento = {

        ...resumo,

        fechadoEm: serverTimestamp()

    };

    const ref = await addDoc(

        fechamentosRef,

        documento

    );

    return ref.id;

}