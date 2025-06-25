import { db, auth } from './firebaseConfig.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { ensureAdminAccess } from './auth/authGuard.js';

ensureAdminAccess();

const userCountElement = document.getElementById('user-count');
const doacoesCountElement = document.getElementById('doacoes-count');
const livrosCountElement = document.getElementById('livros-count');

const usuariosRef = ref(db, 'usuarios');
get(usuariosRef).then(snapshot => {
  if (snapshot.exists()) {
    const total = Object.keys(snapshot.val()).length;
    userCountElement.textContent = total;
  } else {
    userCountElement.textContent = "0";
  }
}).catch(error => {
  console.error("Erro ao carregar usuários:", error);
  userCountElement.textContent = "Erro ao carregar";
});

const doacoesRef = ref(db, 'doacoes');
get(doacoesRef).then(snapshot => {
  if (snapshot.exists()) {
    const total = Object.keys(snapshot.val()).length;
    doacoesCountElement.textContent = total;
  } else {
    doacoesCountElement.textContent = "0";
  }
}).catch(error => {
  console.error("Erro ao carregar doações:", error);
  doacoesCountElement.textContent = "Erro ao carregar";
});

const livrosRef = ref(db, 'livros');
get(livrosRef).then(snapshot => {
  if (snapshot.exists()) {
    const total = Object.keys(snapshot.val()).length;
    livrosCountElement.textContent = total;
  } else {
    livrosCountElement.textContent = "0";
  }
}).catch(error => {
  console.error("Erro ao carregar livros:", error);
  livrosCountElement.textContent = "Erro ao carregar";
});