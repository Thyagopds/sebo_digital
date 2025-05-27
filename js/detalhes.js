document.addEventListener('DOMContentLoaded', () => {
    // Extrair o ID do livro do parâmetro de consulta da URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    // Carregar livros do localStorage
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.id == bookId);

    // Elementos do DOM
    const errorMessage = document.getElementById('error-message');
    const bookDetails = document.getElementById('book-details');
    const bookImage = document.getElementById('book-image');
    const bookTitle = document.getElementById('book-title');
    const bookDescription = document.getElementById('book-description');
    const bookPrice = document.getElementById('book-price');
    const tableTitle = document.getElementById('table-title');
    const tableAuthor = document.getElementById('table-author');
    const tableGenre = document.getElementById('table-genre');
    const tableCondition = document.getElementById('table-condition');
    const tableDescription = document.getElementById('table-description');

    if (!book) {
        // Mostrar mensagem de erro se o livro não for encontrado
        errorMessage.classList.remove('d-none');
        bookDetails.classList.add('d-none');
        return;
    }

    // Preencher os dados do livro
    bookImage.src = book.image || '../img/placeholder.jpg';
    bookImage.alt = book.title;
    bookTitle.textContent = book.title;
    bookDescription.textContent = book.description || 'Nenhuma descrição disponível.';
    bookPrice.textContent = `R$ ${book.price}`;
    tableTitle.textContent = book.title;
    tableAuthor.textContent = book.author;
    tableGenre.textContent = book.genre.charAt(0).toUpperCase() + book.genre.slice(1);
    tableCondition.textContent = book.condition.charAt(0).toUpperCase() + book.condition.slice(1);
    tableDescription.textContent = book.description || 'Nenhuma descrição disponível.';

    document.querySelector('.comprar-btn').addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existing = cart.find(item => item.id === book.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
        id: book.id,
        title: book.title,
        price: book.price,
        image: book.image || '../img/placeholder.jpg',
        quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    const mensagem = document.getElementById('mensagem-sucesso');
    mensagem.classList.remove('d-none');

    // Ocultar a mensagem após 3 segundos
    setTimeout(() => {
        mensagem.classList.add('d-none');
    }, 5000);
    });
});