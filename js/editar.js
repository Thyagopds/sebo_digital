document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#editar-form');
    const errorMessage = document.querySelector('#error-message');

    // Extrair o ID do livro da URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    // Carregar livros do localStorage
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.id == bookId);

    if (!book) {
        errorMessage.classList.remove('d-none');
        form.classList.add('d-none');
        return;
    }

    // Preencher o formulário com os dados do livro
    form.querySelector('#titulo').value = book.title;
    form.querySelector('#autor').value = book.author;
    form.querySelector('#genero').value = book.genre;
    form.querySelector('#condicao').value = book.condition;
    form.querySelector('#preco').value = book.price;
    form.querySelector('#descricao').value = book.description || '';
    

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

        const updatedBook = {
            id: Number(bookId),
            title,
            author,
            genre,
            condition,
            price: price.toFixed(2),
            description,
            image: book.image // Mantém a imagem existente por padrão
        };

        const reader = new FileReader();
        const mensagemEdicao = document.getElementById('mensagem-edicao');

        if (imageInput.files.length > 0) {
            reader.onload = (e) => {
                updatedBook.image = e.target.result; // Atualiza a imagem
                updateBook(updatedBook);

                // Mostra a mensagem de sucesso
                mensagemEdicao.classList.remove('d-none');

                // Redireciona após 2 segundos
                setTimeout(() => {
                    window.location.href = './cadastrar.html';
                }, 2000);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            updateBook(updatedBook);
            mensagemEdicao.classList.remove('d-none');
            setTimeout(() => {
                window.location.href = './cadastrar.html';
            }, 2000);
        }
    });

    // Função para atualizar o livro no localStorage
    function updateBook(updatedBook) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books = books.map(b => b.id == updatedBook.id ? updatedBook : b);
        localStorage.setItem('books', JSON.stringify(books));
    }
});