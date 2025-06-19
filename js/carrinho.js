import { db, auth } from './firebaseConfig.js';
import { ref, push, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { verificarAutenticacao } from './auth/verificaAutenticacao.js';

document.addEventListener('DOMContentLoaded', () => {
  verificarAutenticacao(async (user) => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const finalizarBtn = document.querySelector('.btn-finalizar');
    const mensagemSucesso = document.getElementById('mensagem-sucesso');

    function formatPrice(price) {
      return `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
    }

    function calcularTotal(cart) {
      return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function renderCart() {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cartItemsContainer.innerHTML = '';
      const resumoElement = document.querySelector('.resumo-carrinho');

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="carrinho-vazio"><p class="text-center">Seu carrinho está vazio.</p></div>';
        cartTotalElement.textContent = formatPrice(0);

        cartItemsContainer.classList.remove('livro-carrinho', 'justify-content-between', 'col-md-7');
        if (resumoElement) resumoElement.style.display = 'none';
        return;
      }

      if (resumoElement) resumoElement.style.display = '';

      cart.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'p-4 mb-3 rounded';
        card.innerHTML = `
          <div class="row align-items-center">
            <div class="col-3 text-center">
              <img src="${item.image}" class="img-fluid rounded" alt="${item.title}">
            </div>
            <div class="col-8">
              <h5>${item.title}</h5>
              <p class="text-muted">${formatPrice(item.price)}</p>
              <div class="d-flex align-items-center mb-2">
                <label class="me-2 mb-0">Quantidade:</label>
                <select class="form-select w-auto me-2" id="qty-${index}">
                  ${[...Array(10)].map((_, i) =>
                    `<option value="${i + 1}" ${item.quantity === i + 1 ? 'selected' : ''}>${i + 1}</option>`
                  ).join('')}
                </select>
                <button class="btn btn-danger btn-remove" data-index="${index}">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(card);

        // Atualizar quantidade no select
        card.querySelector('select').addEventListener('change', (e) => {
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
          cart[index].quantity = parseInt(e.target.value);
          localStorage.setItem('cart', JSON.stringify(cart));
          renderCart();
        });

        // Remover item do carrinho
        card.querySelector('.btn-remove').addEventListener('click', () => {
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
          cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          renderCart();
        });
      });

      cartTotalElement.textContent = formatPrice(calcularTotal(cart));
    }

    finalizarBtn.addEventListener('click', async () => {
      if (!user) {
        alert('Você precisa estar logado para finalizar a compra.');
        return;
      }

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
      }

      const pedidosRef = ref(db, 'pedidos');
      const novoPedidoRef = push(pedidosRef);
      const pedidoId = novoPedidoRef.key;

      const agora = new Date();
      const dataStr = agora.toISOString().slice(0, 10).replace(/-/g, '');
      const codigoPedido = `PD-${dataStr}-${pedidoId.slice(-5).toUpperCase()}`;

      const pedido = {
        codigo: codigoPedido,
        userId: user.uid,
        total: calcularTotal(cart),
        data: Date.now(),
        itens: cart.map(item => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      };

      try {
        await set(novoPedidoRef, pedido);
        localStorage.removeItem('cart');
        renderCart();

        mensagemSucesso.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>Compra finalizada com sucesso!<br>Código do pedido: <strong>${codigoPedido}</strong>`;
        mensagemSucesso.classList.remove('d-none');
        setTimeout(() => mensagemSucesso.classList.add('d-none'), 5000);
      } catch (e) {
        console.error('Erro ao salvar pedido no Firebase:', e);
        alert('Erro ao finalizar pedido. Tente novamente.');
      }
    });

    renderCart();
  });
});
