import { db } from './firebaseConfig.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

async function carregarLivrosFirebase() {
    const snapshot = await get(ref(db, 'livros'));
    const livrosData = snapshot.exists() ? snapshot.val() : {};
    
    return Object.keys(livrosData).map(key => {
        const livro = livrosData[key];
        return {
            id: key,
            titulo: livro.titulo || 'Título Desconhecido',
            autor: livro.autor || 'Autor Desconhecido',
            condicao: livro.condicao || 'Não informado',
            observacoes: livro.observacoes || '',
            imagem: livro.imagem || 'img/placeholder.jpg',
            genero: livro.genero || null,
            preco: livro.preco || null
        };
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const booksContainer = document.querySelector('#booksContainer');
    const searchInput = document.querySelector('#searchInput');
    const sortSelect = document.querySelector('#sortSelect');
    const genreSelect = document.querySelector('#genreSelect');
    const stateSelect = document.querySelector('#stateSelect');

    async function loadBooks() {
        let books = await carregarLivrosFirebase();

        const searchTerm = searchInput.value.trim().toLowerCase();
        const sortBy = sortSelect.value;
        const selectedGenre = genreSelect ? genreSelect.value : '';
        const selectedState = stateSelect ? stateSelect.value : '';

        if (searchTerm) {
            books = books.filter(book =>
                book.titulo.toLowerCase().includes(searchTerm) ||
                book.autor.toLowerCase().includes(searchTerm)
            );
        }

        if (selectedGenre) {
            books = books.filter(book => book.genero && book.genero.toLowerCase() === selectedGenre.toLowerCase());
        }

        if (selectedState) {
            books = books.filter(book => book.condicao.toLowerCase() === selectedState.toLowerCase());
        }

        if (sortBy === 'nome-asc') {
            books.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (sortBy === 'nome-desc') {
            books.sort((a, b) => b.titulo.localeCompare(a.titulo));
        } else if (sortBy === 'preco-asc') {
            books.sort((a, b) => (a.preco || 0) - (b.preco || 0));
        } else if (sortBy === 'preco-desc') {
            books.sort((a, b) => (b.preco || 0) - (a.preco || 0));
        }

        booksContainer.innerHTML = '';

        if (books.length === 0) {
            booksContainer.innerHTML = '<p class="text-center w-100 mt-5">Nenhum livro encontrado com os filtros aplicados.</p>';
            return;
        }

        books.forEach(book => {
            const tituloExibicao = book.titulo;
            const autorExibicao = book.autor;
            const generoExibicao = book.genero || 'Gênero Não Informado';
            const precoExibicao = typeof book.preco === 'number' ? `R$ ${book.preco.toFixed(2)}` : 'R$ Grátis';
            const imagemExibicao = book.imagem;

            const bookCard = `
                <div class="col mt-3">
                    <a href="detalhes.html?id=${book.id}" class="text-decoration-none text-dark">
                        <div class="card h-100 shadow-sm livro-card">
                            <div class="d-flex justify-content-center img-livro-card">
                                <img src="${imagemExibicao}" class="card-img-top livro-img rounded" alt="${tituloExibicao}">
                            </div>
                            <div class="card-body d-flex flex-column">
                                <div class="p-2">
                                    <h5 class="card-title m-0 p-0 truncate-one-line">${tituloExibicao}</h5>
                                    <p class="card-text mb-1"><strong>Autor:</strong> ${autorExibicao}</p>
                                    <p class="card-text mb-2"><strong>Gênero:</strong> ${generoExibicao}</p>
                                </div>
                                <div class="livro-preco mt-auto">${precoExibicao}</div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            booksContainer.insertAdjacentHTML('beforeend', bookCard);
        });
    }

    loadBooks();

    searchInput.addEventListener('input', loadBooks);
    sortSelect.addEventListener('change', loadBooks);
    if (genreSelect) genreSelect.addEventListener('change', loadBooks);
    if (stateSelect) stateSelect.addEventListener('change', loadBooks);
});