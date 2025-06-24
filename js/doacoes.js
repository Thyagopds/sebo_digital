import { db } from './firebaseConfig.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('doacao-form');
  const mensagem = document.getElementById('mensagem-doacao');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo-doacao').value.trim();
    const autor = document.getElementById('autor-doacao').value.trim();
    const condicao = document.getElementById('condicao-doacao').value;
    const observacoes = document.getElementById('observacoes-doacao').value.trim();

    if (!titulo || !autor || !condicao) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    await push(ref(db, 'doacoes'), {
      titulo,
      autor,
      condicao,
      observacoes,
      status: 'pendente',
      data: new Date().toISOString()
    });

    mensagem.classList.remove('d-none');
    form.reset();
    setTimeout(() => {
      mensagem.classList.add('d-none');
    }, 5000);
  });
});