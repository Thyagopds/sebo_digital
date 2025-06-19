import { auth } from '../firebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

/**
 * Verifica se o usuário está autenticado.
 * Se não estiver, redireciona para a página de login.
 * @param {Function} callback - Função a ser executada se o usuário estiver logado.
 */
export function verificarAutenticacao(callback) {
  onAuthStateChanged(auth, user => {
    if (user) {
      callback(user); // prossegue com lógica se autenticado
    } else {
      window.location.href = 'login.html';
    }
  });
}
