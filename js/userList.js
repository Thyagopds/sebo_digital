// js/user_list.js
import { db } from './firebaseConfig.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { ensureAdminAccess } from './auth/authGuard.js';

ensureAdminAccess(); // Verifica e redireciona se não for admin

const tbody = document.getElementById('user-table-body');

// Exibe mensagem de carregamento
tbody.innerHTML = `<tr><td colspan="5" class="text-center">Carregando usuários...</td></tr>`;

const usuariosRef = ref(db, 'usuarios');

get(usuariosRef).then(snapshot => {
  if (!snapshot.exists()) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum usuário encontrado.</td></tr>';
    return;
  }

  const users = snapshot.val();
  tbody.innerHTML = '';

  let index = 1;
  Object.values(users).forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index++}</td>
      <td>${user.nome || '-'}</td>
      <td>${user.email || '-'}</td>
      <td>${user.role || 'cliente'}</td>
      <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}).catch(error => {
  console.error("Erro ao buscar usuários:", error);
  tbody.innerHTML = '<tr><td colspan="5" class="text-danger text-center">Erro ao carregar usuários.</td></tr>';
});
