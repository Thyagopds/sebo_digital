import { auth, db } from './firebaseConfig.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const erro = document.getElementById('mensagem-erro');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    erro.classList.add('d-none');

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      const uid = cred.user.uid;

      const snapshot = await get(ref(db, 'usuarios/' + uid));
      const dados = snapshot.val();

      if (!dados || !dados.role) {
        throw new Error("Usuário sem role definida.");
      }

      if (dados.role === 'admin') {
        window.location.href = 'index_admin.html';
      } else {
        window.location.href = 'catalogo_livros.html';
      }

    } catch (err) {
      erro.textContent = "Credenciais inválidas ou erro: " + err.message;
      erro.classList.remove('d-none');
    }
  });
});

function toggleSenha(idInput, btn) {
    const input = document.getElementById(idInput);
    const icon = btn.querySelector('i');

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    }
}