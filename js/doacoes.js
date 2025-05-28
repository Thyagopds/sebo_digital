document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('doacao-form');
  const mensagem = document.getElementById('mensagem-doacao');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo-doacao').value.trim();
    const autor = document.getElementById('autor-doacao').value.trim();
    const condicao = document.getElementById('condicao-doacao').value;

    if (!titulo || !autor || !condicao) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    mensagem.classList.remove('d-none');
    form.reset();
    setTimeout(() => {
      mensagem.classList.add('d-none');
    }, 5000);
  });
});