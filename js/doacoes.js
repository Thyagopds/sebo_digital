const mensagem = document.getElementById('mensagem-doacao');
const form = document.getElementById('doacao-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo-doacao').value.trim();
  const autor = document.getElementById('autor-doacao').value.trim();
  const condicao = document.getElementById('condicao-doacao').value;
  const observacoes = document.getElementById('observacoes-doacao').value.trim();
  const imagemInput = document.getElementById('imagem-doacao');
  let imagemBase64 = "";

  if (imagemInput.files.length > 0) {
    const file = imagemInput.files[0];
    imagemBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  if (!titulo || !autor || !condicao) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  try {
    await push(ref(db, 'doacoes'), {
      titulo,
      autor,
      condicao,
      observacoes,
      imagem: imagemBase64,
      status: 'pendente',
      data: new Date().toISOString()
    });

    mensagem.classList.remove('d-none');
    form.reset();
    setTimeout(() => {
      mensagem.classList.add('d-none');
    }, 5000);
  } catch (error) {
    alert('Erro ao enviar doação: ' + error.message);
    console.error(error);
  }
});