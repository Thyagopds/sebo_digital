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
                <img src="${d.image || 'img/placeholder.jpg'}" class="card-img-top mb-2" alt="Imagem doada" style="max-height:180px;object-fit:cover;">
                <div class="card-body">
                    <h5 class="card-title">${d.title || 'Sem título'}</h5>
                    <p class="card-text"><strong>Autor:</strong> ${d.author || 'Desconhecido'}</p>
                    <p class="card-text"><strong>Observações:</strong> ${d.description || 'Sem observações'}</p>
                    <div class="d-flex gap-2 justify-content-center mt-3">
                        <button class="btn btn-success btn-aprovar" data-id="${id}">Aprovar</button>
                        <button class="btn btn-danger btn-reprovar" data-id="${id}">Reprovar</button>
                    </div>
                </div>
            </div>
        `;
        doacoesList.appendChild(card);
    });

    doacoesList.querySelectorAll('.btn-aprovar').forEach(btn => {
        btn.addEventListener('click', async () => {
            await update(ref(db, `doacoes/${btn.dataset.id}`), { status: 'aprovada' });

            const doacaoSnapshot = await get(ref(db, `doacoes/${btn.dataset.id}`));
            const doacao = doacaoSnapshot.val();

            await push(ref(db, 'livros'), {
                title: doacao.title,
                author: doacao.author,
                condition: doacao.condition,
                description: doacao.description,
                image: doacao.image,
                genre: doacao.genre || null,
                price: doacao.price || null,
                origin: 'doacao',
                date: new Date().toISOString(),
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