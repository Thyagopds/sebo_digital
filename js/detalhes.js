import { verificarAutenticacao } from './auth/verificaAutenticacao.js';
import { db } from './firebaseConfig.js';
import { ref, get, set } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

async function carregarLivroFirebase(id) {
    const snapshot = await get(ref(db, `livros/${id}`));
    return snapshot.exists() ? snapshot.val() : null;
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    const book = await carregarLivroFirebase(bookId);

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
        errorMessage.classList.remove('d-none');
        bookDetails.classList.add('d-none');
        return;
    }

    bookImage.src = book.image || '../img/placeholder.jpg';
    bookImage.alt = book.title;
    bookTitle.textContent = book.title;
    bookDescription.textContent = book.description || 'Nenhuma descrição disponível.';
    // Formata o preço com vírgula e duas casas decimais
    bookPrice.textContent = `R$ ${Number(book.price).toFixed(2).replace('.', ',')}`;
    tableTitle.textContent = book.title;
    tableAuthor.textContent = book.author;
    tableGenre.textContent = book.genre.charAt(0).toUpperCase() + book.genre.slice(1);
    tableCondition.textContent = book.condition.charAt(0).toUpperCase() + book.condition.slice(1);
    tableDescription.textContent = book.description || 'Nenhuma descrição disponível.';

    const comprarBtn = document.querySelector('.comprar-btn');

    comprarBtn.addEventListener('click', () => {
        verificarAutenticacao(async (user) => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
            document.dispatchEvent(new Event('cartUpdated'));

            await set(ref(db, 'carrinhos/' + user.uid), cart);

            const mensagem = document.getElementById('mensagem-sucesso');
            mensagem.classList.remove('d-none');
            setTimeout(() => {
                mensagem.classList.add('d-none');
            }, 5000);
        });
    });
});