import { db, auth } from './firebaseConfig.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { ensureAdminAccess } from './auth/authGuard.js';

ensureAdminAccess(); // Verifica e redireciona se não for admin

const userCountElement = document.getElementById('user-count');

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