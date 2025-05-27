let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const finalizarBtn = document.querySelector('.btn-finalizar');

  function formatPrice(price) {
    return `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
  }

  function updateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalElement.textContent = formatPrice(total);
    localStorage.setItem('cart', JSON.stringify(cart)); // persistir
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';

    const resumoElement = document.querySelector('.resumo-carrinho');

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<div class="carrinho-vazio"><p class="text-center">Seu carrinho está vazio.</p></div>';
      cartTotalElement.textContent = formatPrice(0);

      // Remove classes e esconde resumo
      cartItemsContainer.classList.remove('livro-carrinho', 'justify-content-between', 'col-md-7');
      if (resumoElement) resumoElement.style.display = 'none';
      return;
    }

    cartItemsContainer.classList.add('livro-carrinho');
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
              <label for="qty-${index}" class="me-2 mb-0">Quantidade:</label>
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

      const select = card.querySelector('select');
      select.addEventListener('change', e => {
        cart[index].quantity = parseInt(e.target.value);
        updateTotal();
      });

      const removeBtn = card.querySelector('.btn-remove');
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateTotal();
      });
    });

    updateTotal();
  }

  // Evento de finalizar compra
  finalizarBtn.addEventListener('click', () => {
    localStorage.removeItem('cart');
    cart.length = 0; // limpa o array cart
    renderCart();

    const mensagem = document.createElement('div');
    mensagem.className = 'alert alert-success mt-3 text-center';
    mensagem.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>Compra finalizada com sucesso!`;
    finalizarBtn.parentElement.appendChild(mensagem);

    setTimeout(() => mensagem.remove(), 3000);
  });

  renderCart();
});
