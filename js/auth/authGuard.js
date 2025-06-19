import { auth, db } from '../firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

export function ensureAdminAccess(redirectUrl = '/login.html') {
  const app = document.getElementById('app');
  if (app) app.style.display = 'none'; // Garante que não renderiza

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = redirectUrl;
      return;
    }

    const userRef = ref(db, `usuarios/${user.uid}`);

    try {
      const snapshot = await get(userRef);
      const dados = snapshot.val();

      if (!snapshot.exists() || dados.role !== 'admin') {
        window.location.href = redirectUrl;
        return;
      }

      // Usuário é admin → mostra a página
      if (app) app.style.display = 'block';
    } catch (error) {
      console.error('Erro ao verificar role:', error);
      window.location.href = redirectUrl;
    }
  });
}
