import { db } from './firebaseConfig.js';
import { ref, get, update, push } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

const doacoesList = document.getElementById('doacoes-list');
const mensagem = document.getElementById('mensagem');
const tabLinks = document.querySelectorAll('#tab-doacoes .nav-link');
const modal = new bootstrap.Modal(document.getElementById('modalPreco'));
const inputPreco = document.getElementById('input-preco');
let doacaoSelecionadaId = null;

function renderMensagem(text, tipo = 'info') {
    mensagem.textContent = text;
    mensagem.className = `alert alert-${tipo} mt-4 text-center`;
    mensagem.classList.remove('d-none');
    setTimeout(() => mensagem.classList.add('d-none'), 3000);
}

async function carregarDoacoesPorStatus(status) {
    doacoesList.innerHTML = '';
    const snapshot = await get(ref(db, 'doacoes'));
    if (!snapshot.exists()) {
        doacoesList.innerHTML = `<tr><td colspan="9" class="text-center">Nenhuma doação neste status.</td></tr>`;
        return;
    }
    const doacoes = snapshot.val();
    // Ordena do mais novo para o mais velho
    const filtradas = Object.entries(doacoes)
        .filter(([_, d]) => d.status === status)
        .sort((a, b) => {
            const dateA = new Date(a[1].date || 0).getTime();
            const dateB = new Date(b[1].date || 0).getTime();
            return dateB - dateA;
        });

    if (filtradas.length === 0) {
        doacoesList.innerHTML = `<tr><td colspan="9" class="text-center">Nenhuma doação neste status.</td></tr>`;
        return;
    }

    filtradas.forEach(([id, d], idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <img src="${d.image || 'img/placeholder.jpg'}" alt="Imagem doada" style="width:60px;height:80px;object-fit:cover;border-radius:4px;">
            </td>
            <td>${d.title || ''}</td>
            <td>${d.author || ''}</td>
            <td>${d.genre || ''}</td>
            <td>${d.price !== undefined && d.price !== null && d.price !== '' ? `R$ ${Number(d.price).toFixed(2)}` : '-'}</td>
            <td>${d.condition || ''}</td>
            <td>${d.userEmail ? d.userEmail : (d.userId ? d.userId : 'Não informado')}</td>
            <td>${d.status}</td>
            <td>
                ${status === 'pendente' ? `
                <button class="btn btn-success btn-sm btn-aprovar" title="Aprovar" data-id="${id}">
                  <i class="bi bi-check-circle-fill"></i>
                </button>
                <button class="btn btn-danger btn-sm btn-reprovar" title="Reprovar" data-id="${id}">
                  <i class="bi bi-x-circle-fill"></i>
                </button>
                ` : ''}
            </td>
        `;
        doacoesList.appendChild(tr);
    });

    if (status === 'pendente') {
        doacoesList.querySelectorAll('.btn-aprovar').forEach(btn => {
            btn.addEventListener('click', () => {
                doacaoSelecionadaId = btn.dataset.id;
                inputPreco.value = '';
                modal.show();
            });
        });

        doacoesList.querySelectorAll('.btn-reprovar').forEach(btn => {
            btn.addEventListener('click', async () => {
                await update(ref(db, `doacoes/${btn.dataset.id}`), { status: 'recusada' });
                renderMensagem('Doação recusada.', 'warning');
                carregarDoacoesPorStatus('pendente');
            });
        });
    }
}

document.getElementById('confirmar-preco').addEventListener('click', async () => {
    const preco = parseFloat(inputPreco.value);
    if (isNaN(preco) || preco <= 0) {
        alert('Insira um valor válido para o preço.');
        return;
    }

    if (!doacaoSelecionadaId) return;

    await update(ref(db, `doacoes/${doacaoSelecionadaId}`), { status: 'aprovada' });
    const doacaoSnapshot = await get(ref(db, `doacoes/${doacaoSelecionadaId}`));
    const doacao = doacaoSnapshot.val();

    await push(ref(db, 'livros'), {
        title: doacao.title,
        author: doacao.author,
        condition: doacao.condition,
        description: doacao.description,
        image: doacao.image,
        genre: doacao.genre || null,
        price: preco,
        origin: 'doacao',
        date: new Date().toISOString(),
    });

    modal.hide();
    renderMensagem('Doação aprovada e livro adicionado ao catálogo!', 'success');
    carregarDoacoesPorStatus('pendente');
});

tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        tabLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const status = link.dataset.status;
        carregarDoacoesPorStatus(status);
    });
});

carregarDoacoesPorStatus('pendente');
