import { db } from './firebaseConfig.js';
import { ref, get, update, push } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

const doacoesList = document.getElementById('doacoes-list');
const mensagem = document.getElementById('mensagem');

function renderMensagem(text, tipo = 'info') {
    mensagem.textContent = text;
    mensagem.className = `alert alert-${tipo} mt-4 text-center`;
    mensagem.classList.remove('d-none');
    setTimeout(() => mensagem.classList.add('d-none'), 3000);
}

async function carregarDoacoesPendentes() {
    doacoesList.innerHTML = '';
    const snapshot = await get(ref(db, 'doacoes'));
    if (!snapshot.exists()) {
        doacoesList.innerHTML = '<p class="text-center">Nenhuma doação pendente.</p>';
        return;
    }
    const doacoes = snapshot.val();
    const pendentes = Object.entries(doacoes).filter(([id, d]) => d.status === 'pendente');
    if (pendentes.length === 0) {
        doacoesList.innerHTML = '<p class="text-center">Nenhuma doação pendente.</p>';
        return;
    }
    pendentes.forEach(([id, d]) => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
      <div class="card shadow-sm p-3 mb-4">
        <img src="${d.imagem || 'img/placeholder.jpg'}" class="card-img-top mb-2" alt="Imagem doada" style="max-height:180px;object-fit:cover;">
        <div class="card-body">
          <h5 class="card-title">${d.titulo || 'Sem título'}</h5>
          <p class="card-text"><strong>Autor:</strong> ${d.autor || 'Desconhecido'}</p>
          <p class="card-text"><strong>Observações:</strong> ${d.observacoes || 'Sem observações'}</p>
          <div class="d-flex gap-2 justify-content-center mt-3">
            <button class="btn btn-success btn-aprovar" data-id="${id}">Aprovar</button>
            <button class="btn btn-danger btn-reprovar" data-id="${id}">Reprovar</button>
          </div>
        </div>
      </div>
    `;
        doacoesList.appendChild(card);
    });

    // Eventos dos botões
    doacoesList.querySelectorAll('.btn-aprovar').forEach(btn => {
        btn.addEventListener('click', async () => {
            // Atualiza status da doação
            await update(ref(db, `doacoes/${btn.dataset.id}`), { status: 'aprovada' });

            // Busca dados da doação aprovada
            const doacaoSnapshot = await get(ref(db, `doacoes/${btn.dataset.id}`));
            const doacao = doacaoSnapshot.val();

            // Adiciona ao catálogo de livros
            await push(ref(db, 'livros'), {
                titulo: doacao.titulo,
                autor: doacao.autor,
                condicao: doacao.condicao,
                observacoes: doacao.observacoes, // Garanta que 'observacoes' seja o campo desejado para a descrição do livro no catálogo.
                imagem: doacao.imagem,
                origem: 'doacao',
                data: new Date().toISOString()
            });

            renderMensagem('Doação aprovada e livro adicionado ao catálogo!', 'success');
            carregarDoacoesPendentes();
        });
    });
    doacoesList.querySelectorAll('.btn-reprovar').forEach(btn => {
        btn.addEventListener('click', async () => {
            await update(ref(db, `doacoes/${btn.dataset.id}`), { status: 'recusada' });
            renderMensagem('Doação recusada.', 'warning');
            carregarDoacoesPendentes();
        });
    });
}

carregarDoacoesPendentes();