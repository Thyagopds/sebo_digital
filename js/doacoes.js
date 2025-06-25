import { db } from './firebaseConfig.js';
import { ref, push } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

const mensagem = document.getElementById('mensagem-doacao');
const form = document.getElementById('doacao-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('titulo-doacao').value.trim();
    const author = document.getElementById('autor-doacao').value.trim();
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

    if (!title || !author || !condition) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    try {
        await push(ref(db, 'doacoes'), {
            title: title,
            author: author,
            condition: condition,
            description: description,
            image: imageUrl,
            status: 'pendente',
            date: new Date().toISOString()
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