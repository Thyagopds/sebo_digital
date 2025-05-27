document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#cadastro-form');
    const booksList = document.querySelector('#books-list');

    // Função para carregar e exibir a lista de livros
    function loadBooks() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        booksList.innerHTML = '';

        if (books.length === 0) {
            booksList.innerHTML = '<p class="nenhum-livro">Nenhum livro cadastrado.</p>';
            return;
        }

        books.forEach(book => {
            const bookCard = `
                <div class="col-12 col-md-6 col-lg-5 col-xl-4 col-xxl-3 mb-4">
                    <div class="card h-100 shadow-sm border-0 flex-row align-items-center p-3">
                        <img src="${book.image || 'img/placeholder.jpg'}" class="livro-img rounded" alt="${book.title}">
                        <div class="card-body p-0 d-flex flex-column align-items-center text-center w-100">
                            <div>
                                <h5 class="card-title fw-bold">${book.title}</h5>
                                <p class="card-text mb-1"><strong>Autor:</strong> ${book.author}</p>
                                <p class="card-text mb-2"><strong>Preço:</strong> R$ ${book.price}</p>
                            </div>
                            <div class="mt-3 d-flex justify-content-center gap-2">
                                <button class="btn btn-outline-danger btn-sm remove-book" data-id="${book.id}" title="Remover">
                                    <i class="bi bi-trash"></i>
                                </button>
                                <a href="editar.html?id=${book.id}" class="btn btn-outline-primary btn-sm" title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            booksList.insertAdjacentHTML('beforeend', bookCard);
        });

        // Eventos de clique para remover
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
    let bookIdToRemove = null; // Guardar o ID temporariamente

    function removeBook(bookId) {
        bookIdToRemove = bookId; // Armazenar o ID do livro para remoção
        const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        modal.show();
    }

    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (bookIdToRemove !== null) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books = books.filter(book => book.id != bookIdToRemove);
        localStorage.setItem('books', JSON.stringify(books));
        loadBooks(); // Atualizar a lista
        showSuccessMessage('Livro removido com sucesso!');
        bookIdToRemove = null;

        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
        modal.hide();
    }
    });

    // Função auxiliar para exibir mensagem de sucesso
    function showSuccessMessage(message) {
        const msgDiv = document.getElementById('mensagem-sucesso');
        msgDiv.textContent = ''; // Limpa conteúdo anterior
        msgDiv.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ${message}`;
        msgDiv.classList.remove('d-none');

        setTimeout(() => {
            msgDiv.classList.add('d-none');
        }, 5000);
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
                const mensagem = document.getElementById('mensagem-sucesso');
                mensagem.classList.remove('d-none');

                // Ocultar a mensagem após 3 segundos
                setTimeout(() => {
                    mensagem.classList.add('d-none');
                }, 5000);
                form.reset();
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            saveBook(book);
            const mensagem = document.getElementById('mensagem-sucesso');
            mensagem.classList.remove('d-none');

            // Ocultar a mensagem após 3 segundos
            setTimeout(() => {
                mensagem.classList.add('d-none');
            }, 5000);
            form.reset();
        }
    });

    // Carregar livros ao iniciar
    loadBooks();
});