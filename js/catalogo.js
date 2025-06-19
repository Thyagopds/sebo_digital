document.addEventListener('DOMContentLoaded', () => {
    const booksContainer = document.querySelector('#booksContainer');
    const searchInput = document.querySelector('#searchInput');
    const sortSelect = document.querySelector('#sortSelect');
    const genreSelect = document.querySelector('#genreSelect');
    const stateSelect = document.querySelector('#stateSelect');

    function loadBooks() {
        let books = JSON.parse(localStorage.getItem('books')) || [];

        const searchTerm = searchInput.value.trim().toLowerCase();
        const sortBy = sortSelect.value;
        const selectedGenre = genreSelect ? genreSelect.value : '';
        const selectedState = stateSelect ? stateSelect.value : '';

        if (searchTerm) {
            books = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm)
            );
        }

        if (selectedGenre) {
            books = books.filter(book => book.genre === selectedGenre);
        }

        if (selectedState) {
            books = books.filter(book => book.condition === selectedState);
        }

        if (sortBy === 'nome-asc') {
            books.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'nome-desc') {
            books.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sortBy === 'preco-asc') {
            books.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === 'preco-desc') {
            books.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        booksContainer.innerHTML = '';
        books.forEach(book => {
            const bookCard = `
                <div class="col mt-3">
                    <a href="detalhes.html?id=${book.id}" class="text-decoration-none text-dark">
                        <div class="card h-100 shadow-sm livro-card">
                            <div class="d-flex justify-content-center img-livro-card">
                                <img src="${book.image || 'img/placeholder.jpg'}" class="card-img-top livro-img rounded" alt="${book.title}">
                            </div>
                            <div class="card-body d-flex flex-column">
                                <div class="p-2">
                               
                                    <h5 class="card-title m-0 p-0 truncate-one-line">${book.title}</h5>
                                   
                                    <p class="card-text mb-1"><strong>Autor:</strong> ${book.author}</p>
                                    <p class="card-text mb-2"><strong>Gênero:</strong> ${book.genre}</p>
                                </div>
                                <div class="livro-preco mt-auto">R$ ${book.price}</div>
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
    genreSelect.addEventListener('change', loadBooks);
    stateSelect.addEventListener('change', loadBooks);
});