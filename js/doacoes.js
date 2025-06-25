import { db } from './firebaseConfig.js';
import { ref, push } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const mensagem = document.getElementById('mensagem-doacao');
const form = document.getElementById('doacao-form');

let usuarioLogado = null;

// Verifica autenticação antes de permitir doar
onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        usuarioLogado = user;
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    const title = document.getElementById('titulo-doacao').value.trim();
    const author = document.getElementById('autor-doacao').value.trim();
    const genre = document.getElementById('genero-doacao').value;
    const priceRaw = document.getElementById('preco-doacao').value;
    const price = priceRaw ? parseFloat(priceRaw) : null;
    const condition = document.getElementById('condicao-doacao').value;
    const description = document.getElementById('observacoes-doacao').value.trim();
    const imageInput = document.getElementById('imagem-doacao');
    let imageUrl = "";

    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        imageUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    if (!title || !author || !genre || !condition) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    try {
        await push(ref(db, 'doacoes'), {
            title: title,
            author: author,
            genre: genre,
            price: price,
            condition: condition,
            description: description,
            image: imageUrl,
            status: 'pendente',
            date: new Date().toISOString(),
            userId: usuarioLogado.uid,
            userEmail: usuarioLogado.email
        });

        mensagem.classList.remove('d-none');
        form.reset();
        setTimeout(() => {
            mensagem.classList.add('d-none');
        }, 5000);
    } catch (error) {
        alert('Erro ao enviar doação: ' + error.message);
        console.error(error);
    }
});