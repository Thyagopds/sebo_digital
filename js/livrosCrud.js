import { ensureAdminAccess } from './auth/authGuard.js';
import { db } from './firebaseConfig.js';
import { ref, get, set, update, remove, push } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

async function addLivroFirebase(livroData) {
  const newLivroRef = push(ref(db, 'livros'));
  livroData.id = newLivroRef.key;
  await set(newLivroRef, livroData);
  const modal = bootstrap.Modal.getInstance(document.getElementById('addLivroModal'));
  modal.hide();
}

async function carregarLivrosFirebase() {
  const snapshot = await get(ref(db, 'livros'));
  const livrosData = snapshot.exists() ? snapshot.val() : {};

  return Object.keys(livrosData).map(key => {
    const livro = livrosData[key];
    return {
      id: key,
      title: livro.title || 'Desconhecido',
      author: livro.author || 'Desconhecido',
      genre: livro.genre || 'Não Informado',
      price: typeof livro.price === 'number' ? livro.price : parseFloat(livro.price) || null,
      condition: livro.condition || 'Não informado',
      description: livro.description || '',
      image: livro.image || 'img/placeholder.jpg',
      origin: livro.origin || null,
      date: livro.date || null
    };
  });
}

async function atualizarLivroFirebase(livro) {
  const livroRef = ref(db, `livros/${livro.id}`);
  await update(livroRef, livro);
}

async function excluirLivroFirebase(id) {
  const livroRef = ref(db, `livros/${id}`);
  await remove(livroRef);
}

ensureAdminAccess();

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('livros-table-body');
  const modalConfirm = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  const modalEdit = new bootstrap.Modal(document.getElementById('editLivroModal'));
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const editForm = document.getElementById('editLivroForm');
  const imageInput = document.getElementById('edit-imagem');
  const previewImagem = document.getElementById('preview-imagem');

  let bookIdToDelete = null;
  let booksCache = [];
  let searchTerm = '';

  async function renderBooks() {
    booksCache = await carregarLivrosFirebase();
    tableBody.innerHTML = '';

    // Filtragem por busca
    const filteredBooks = booksCache.filter(book => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        (book.title && book.title.toLowerCase().includes(term)) ||
        (book.author && book.author.toLowerCase().includes(term)) ||
        (book.genre && book.genre.toLowerCase().includes(term))
      );
    });

    if (filteredBooks.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum livro cadastrado.</td></tr>';
      return;
    }

    filteredBooks.forEach(book => {
      const priceToDisplay = typeof book.price === 'number' ? `R$ ${book.price.toFixed(2)}` : 'R$ Grátis';
      const tr = document.createElement('tr');
      tr.innerHTML = `
                <td><img src="${book.image}" alt="${book.title}" width="50"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.genre || 'Não informado'}</td>
                <td>${priceToDisplay}</td>
                <td>${book.condition}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-edit" data-id="${book.id}"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-delete" data-id="${book.id}"><i class="bi bi-trash"></i></button>
                    </div>
                </td>
            `;
      tableBody.appendChild(tr);
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        bookIdToDelete = btn.dataset.id;
        modalConfirm.show();
      });
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const book = booksCache.find(b => b.id === id);
        if (book) {
          fillEditForm(book);
          modalEdit.show();
        }
      });
    });
  }

  document.getElementById('addLivroForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById('add-imagem');
    const file = fileInput.files[0];

    const newBookData = {
      title: document.getElementById('add-titulo').value.trim(),
      author: document.getElementById('add-autor').value.trim(),
      genre: document.getElementById('add-genero').value.trim(),
      price: parseFloat(document.getElementById('add-preco').value),
      condition: document.getElementById('add-condicao').value.trim(),
      description: document.getElementById('add-descricao').value.trim(),
      image: '',
      origin: 'manual',
      date: new Date().toISOString()
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        newBookData.image = e.target.result;
        await addLivroFirebase(newBookData);
        renderBooks();
        document.getElementById('addLivroForm').reset();
        document.getElementById('preview-add-imagem').src = 'img/placeholder.jpg';
      };
      reader.readAsDataURL(file);
    } else {
      newBookData.image = 'img/placeholder.jpg';
      await addLivroFirebase(newBookData);
      renderBooks();
      document.getElementById('addLivroForm').reset();
      document.getElementById('preview-add-imagem').src = 'img/placeholder.placeholder.jpg';
    }
  });

  function fillEditForm(book) {
    editForm['edit-index'].value = book.id;
    editForm['edit-titulo'].value = book.title;
    editForm['edit-autor'].value = book.author;
    // Seleciona o valor correto no select de gênero
    editForm['edit-genero'].value = book.genre || '';
    editForm['edit-preco'].value = book.price;
    // Seleciona o valor correto no select de condição
    editForm['edit-condicao'].value = book.condition || '';
    editForm['edit-descricao'].value = book.description;
    previewImagem.src = book.image;
    imageInput.value = '';
  }

  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
      previewImagem.src = URL.createObjectURL(file);
    } else {
      const id = editForm['edit-index'].value;
      const book = booksCache.find(b => b.id === id);
      previewImagem.src = book?.image || 'img/placeholder.jpg';
    }
  });

  confirmDeleteBtn.addEventListener('click', async () => {
    if (!bookIdToDelete) return;
    await excluirLivroFirebase(bookIdToDelete);
    modalConfirm.hide();
    renderBooks();
  });

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookId = editForm['edit-index'].value;
    const currentBook = booksCache.find(b => b.id === bookId);

    const updatedBookData = {
      id: bookId,
      title: editForm['edit-titulo'].value.trim(),
      author: editForm['edit-autor'].value.trim(),
      genre: editForm['edit-genero'].value.trim(),
      price: parseFloat(editForm['edit-preco'].value),
      condition: editForm['edit-condicao'].value.trim(),
      description: editForm['edit-descricao'].value.trim(),
      image: currentBook.image || 'img/placeholder.jpg',
      origin: currentBook.origin || null,
      date: currentBook.date || null
    };

    if (imageInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updatedBookData.image = event.target.result;
        saveUpdatedBook(updatedBookData);
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      saveUpdatedBook(updatedBookData);
    }
  });

  async function saveUpdatedBook(updatedBook) {
    await atualizarLivroFirebase(updatedBook);
    modalEdit.hide();
    renderBooks();
  }

  const addImageInput = document.getElementById('add-imagem');
  const previewAddImagem = document.getElementById('preview-add-imagem');

  addImageInput.addEventListener('change', () => {
    const file = addImageInput.files[0];
    if (file) {
      previewAddImagem.src = URL.createObjectURL(file);
    } else {
      previewAddImagem.src = 'img/placeholder.jpg';
    }
  });

  // Adiciona evento de busca ao digitar
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.trim();
    renderBooks();
  });

  renderBooks();
});