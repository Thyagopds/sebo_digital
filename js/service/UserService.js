import { db, auth } from '../firebaseConfig.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

export async function cadastrarUsuario(nome, email, senha) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    const uid = cred.user.uid;

    // Salvar como "cliente"
    await set(ref(db, 'usuarios/' + uid), {
      nome,
      email,
      role: "cliente"
    });

    return { sucesso: true };
  } catch (error) {
    return { sucesso: false, erro: error.message };
  }
}