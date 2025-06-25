import { db } from './firebaseConfig.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

async function carregarLivrosFirebase() {
    const snapshot = await get(ref(db, 'livros'));
    const livrosData = snapshot.exists() ? snapshot.val() : {};
    
    return Object.keys(livrosData).map(key => {
        const livro = livrosData[key];
        return {
            id: key,
            title: livro.title || 'Título Desconhecido',
            author: livro.author || 'Autor Desconhecido',
            condition: livro.condition || 'Não informado',
            description: livro.description || 'Nenhuma descrição disponível.',
            image: livro.image || 'img/placeholder.jpg',
            genre: livro.genre || 'Gênero Não Informado',
            price: livro.price || null
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
        const selectedGenre = genreSelect ? genreSelect.value.toLowerCase() : '';
        const selectedState = stateSelect ? stateSelect.value.toLowerCase() : '';

        if (searchTerm) {
            books = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm)
            );
        }

        if (selectedGenre) {
            books = books.filter(book => String(book.genre).toLowerCase() === selectedGenre);
        }

        if (selectedState) {
            books = books.filter(book => String(book.condition).toLowerCase() === selectedState);
        }

        if (sortBy === 'nome-asc') {
            books.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'nome-desc') {
            books.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sortBy === 'preco-asc') {
            books.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        } else if (sortBy === 'preco-desc') {
            books.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        }

        booksContainer.innerHTML = '';

        if (books.length === 0) {
            booksContainer.innerHTML = '<p class="text-center w-100 mt-5">Nenhum livro encontrado com os filtros aplicados.</p>';
            return;
        }

        books.forEach(book => {
            const titleToDisplay = book.title;
            const authorToDisplay = book.author;
            const genreToDisplay = book.genre;
            const priceToDisplay = typeof book.price === 'number' ? `R$ ${book.price.toFixed(2)}` : 'R$ Grátis';
            const imageToDisplay = book.image;

            const bookCard = `
                <div class="col mt-3">
                    <a href="detalhes.html?id=${book.id}" class="text-decoration-none text-dark">
                        <div class="card h-100 shadow-sm livro-card">
                            <div class="d-flex justify-content-center img-livro-card">
                                <img src="${imageToDisplay}" class="card-img-top livro-img rounded" alt="${titleToDisplay}">
                            </div>
                            <div class="card-body d-flex flex-column">
                                <div class="p-2">
                                    <h5 class="card-title m-0 p-0 truncate-one-line">${titleToDisplay}</h5>
                                    <p class="card-text mb-1"><strong>Autor:</strong> ${authorToDisplay}</p>
                                    <p class="card-text mb-2"><strong>Gênero:</strong> ${genreToDisplay}</p>
                                </div>
                                <div class="livro-preco mt-auto">${priceToDisplay}</div>
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