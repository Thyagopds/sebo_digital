document.addEventListener('DOMContentLoaded', () => {
    const booksContainer = document.querySelector('#booksContainer');
    const searchInput = document.querySelector('#searchInput');
    const sortSelect = document.querySelector('#sortSelect');
    
    function loadBooks(searchTerm = '', sortBy = '') {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        
        // Filtrar por termo de pesquisa
        if (searchTerm) {
            books = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Ordenar
        if (sortBy === 'nome') {
            books.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'preco') {
            books.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }
        
        // Limpar container
        booksContainer.innerHTML = '';
        
        // Renderizar livros
        books.forEach(book => {
            const bookCard = `
                <div class="col mt-3">
                    <a href="livros/detalhes.html?id=${book.id}" class="text-decoration-none text-dark">
                        <div class="card h-100 shadow-sm livro-card">
                            <div class="d-flex justify-content-center img-livro-card">
                                <img src="${book.image || 'img/placeholder.jpg'}" class="card-img-top livro-img rounded" alt="${book.title}">
                            </div>
                            <div class="card-body d-flex flex-column align-items-start">
                                <h5 class="card-title">${book.title}</h5>
                                <div class="livro-preco mt-auto">R$ ${book.price}</div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            booksContainer.insertAdjacentHTML('beforeend', bookCard);
        });
    }
    
    // Carregar livros iniciais
    loadBooks();
    
    // Evento de pesquisa
    searchInput.addEventListener('input', () => {
        loadBooks(searchInput.value, sortSelect.value);
    });
    
    // Evento de ordenação
    sortSelect.addEventListener('change', () => {
        loadBooks(searchInput.value, sortSelect.value);
    });
});