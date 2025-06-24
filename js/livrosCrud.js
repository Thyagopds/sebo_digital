import { ensureAdminAccess } from './auth/authGuard.js';

ensureAdminAccess(); // Verifica e redireciona se não for admin

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('livros-table-body');
  const modalConfirm = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  const modalEdit = new bootstrap.Modal(document.getElementById('editLivroModal'));
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const editForm = document.getElementById('editLivroForm');
  const imageInput = document.getElementById('edit-imagem');
  const previewImagem = document.getElementById('preview-imagem');

  let bookIdToDelete = null;
  let books = JSON.parse(localStorage.getItem('books')) || [];

  function renderBooks() {
    books = JSON.parse(localStorage.getItem('books')) || [];
    tableBody.innerHTML = '';

    if (books.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum livro cadastrado.</td></tr>';
      return;
    }

    books.forEach(book => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${book.image || 'img/placeholder.jpg'}" alt="${book.title}" width="50"></td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>R$ ${book.price}</td>
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
        const book = books.find(b => b.id == id);
        if (book) {
          fillEditForm(book);
          modalEdit.show();
        }
      });
    });
  }




  document.getElementById('addLivroForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const livro = {
      id: Date.now(),
      title: document.getElementById('add-titulo').value,
      author: document.getElementById('add-autor').value,
      genre: document.getElementById('add-genero').value,
      price: parseFloat(document.getElementById('add-preco').value).toFixed(2),
      condition: document.getElementById('add-condicao').value,
      description: document.getElementById('add-descricao').value,
      image: '',
    };

    // Adicionar ao LocalStorage
    const books = JSON.parse(localStorage.getItem('books')) || [];

    books.push(livro);
    localStorage.setItem('books', JSON.stringify(books));

    // Atualizar a tabela
    renderBooks();

    // Fechar o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addLivroModal'));
    modal.hide();
  });

  function atualizarTabelaLivros() {
    const books = JSON.parse(localStorage.getItem('books')) || [];

    const tbody = document.getElementById('livros-table-body');
    tbody.innerHTML = ''; // Limpar tabela

    livros.forEach((livro, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${livro.titulo}</td>
        <td>${livro.autor}</td>
        <td>${livro.genero}</td>
        <td>${livro.preco}</td>
        <td>${livro.condicao}</td>
        <td>
          <button class="btn btn-sm btn-primary">Editar</button>
          <button class="btn btn-sm btn-danger">Excluir</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }


  function fillEditForm(book) {
    editForm['edit-index'].value = book.id;
    editForm['edit-titulo'].value = book.title;
    editForm['edit-autor'].value = book.author;
    editForm['edit-genero'].value = book.genre;
    editForm['edit-preco'].value = book.price;
    editForm['edit-condicao'].value = book.condition;
    editForm['edit-descricao'].value = book.description || '';

    previewImagem.src = book.image || 'img/placeholder.jpg';
    imageInput.value = ''; // limpa o input para nova seleção
  }

  // Atualiza preview da imagem ao escolher novo arquivo
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
      previewImagem.src = URL.createObjectURL(file);
    } else {
      // Se remover o arquivo, volta para a imagem original do livro
      const id = editForm['edit-index'].value;
      const book = books.find(b => b.id == id);
      previewImagem.src = book?.image || 'img/placeholder.jpg';
    }
  });

  confirmDeleteBtn.addEventListener('click', () => {
    if (!bookIdToDelete) return;
    books = books.filter(b => b.id != bookIdToDelete);
    localStorage.setItem('books', JSON.stringify(books));
    modalConfirm.hide();
    renderBooks();
  });

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedBook = {
      id: Number(editForm['edit-index'].value),
      title: editForm['edit-titulo'].value,
      author: editForm['edit-autor'].value,
      genre: editForm['edit-genero'].value,
      price: Number(editForm['edit-preco'].value).toFixed(2),
      condition: editForm['edit-condicao'].value,
      description: editForm['edit-descricao'].value,
      image: books.find(b => b.id == editForm['edit-index'].value)?.image || ''
    };

    if (imageInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updatedBook.image = event.target.result; // base64 da nova imagem
        saveUpdatedBook(updatedBook);
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      saveUpdatedBook(updatedBook);
    }
  });

  function saveUpdatedBook(updatedBook) {
    books = books.map(b => b.id == updatedBook.id ? updatedBook : b);
    localStorage.setItem('books', JSON.stringify(books));
    modalEdit.hide();
    renderBooks();
  }

  renderBooks();
});
