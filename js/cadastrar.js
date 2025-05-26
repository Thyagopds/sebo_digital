document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#cadastro-form');
    const booksList = document.querySelector('#books-list');

    // Função para carregar e exibir a lista de livros
    function loadBooks() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        booksList.innerHTML = '';

        books.forEach(book => {
            const bookCard = `
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <div class="d-flex justify-content-center img-livro-card">
                            <img src="${book.image || 'img/placeholder.jpg'}" class="card-img-top livro-img rounded" alt="${book.title}" style="max-height: 200px; object-fit: contain;">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text">Autor: ${book.author}</p>
                            <p class="card-text">Preço: R$ ${book.price}</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-danger btn-sm remove-book" data-id="${book.id}">Remover</button>
                                <a href="editar.html?id=${book.id}" class="btn btn-primary btn-sm">Editar</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            booksList.insertAdjacentHTML('beforeend', bookCard);
        });

        // Adicionar eventos aos botões de remover
        document.querySelectorAll('.remove-book').forEach(button => {
            button.addEventListener('click', () => {
                const bookId = button.getAttribute('data-id');
                removeBook(bookId);
            });
        });
    }

    // Função para salvar um livro
    function saveBook(book) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
        loadBooks(); // Atualizar a lista após salvar
    }

    // Função para remover um livro
    function removeBook(bookId) {
        if (confirm('Tem certeza que deseja remover este livro?')) {
            let books = JSON.parse(localStorage.getItem('books')) || [];
            books = books.filter(book => book.id != bookId);
            localStorage.setItem('books', JSON.stringify(books));
            loadBooks(); // Atualizar a lista após remover
            alert('Livro removido com sucesso!');
        }
    }

    // Evento de submissão do formulário
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const title = form.querySelector('#titulo').value;
        const author = form.querySelector('#autor').value;
        const genre = form.querySelector('#genero').value;
        const condition = form.querySelector('#condicao').value;
        const price = parseFloat(form.querySelector('#preco').value);
        const description = form.querySelector('#descricao').value;
        const imageInput = form.querySelector('#capa-livro');
        
        if (!title || !author || !genre || !condition || !price) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const reader = new FileReader();
        const book = {
            id: Date.now(), // ID único baseado no timestamp
            title,
            author,
            genre,
            condition,
            price: price.toFixed(2),
            description,
            image: ''
        };

        if (imageInput.files.length > 0) {
            reader.onload = (e) => {
                book.image = e.target.result; // Imagem em Base64
                saveBook(book);
                alert('Livro cadastrado com sucesso!');
                form.reset();
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            saveBook(book);
            alert('Livro cadastrado com sucesso!');
            form.reset();
        }
    });

    // Carregar livros ao iniciar
    loadBooks();
});