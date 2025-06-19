import { db, auth } from './firebaseConfig.js';
import { ref, query, orderByChild, equalTo, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { verificarAutenticacao } from './auth/verificaAutenticacao.js';

verificarAutenticacao(user => {
  const pedidosContainer = document.getElementById('pedidos-container');
  const nenhumPedidoMsg = document.getElementById('nenhum-pedido');

  function formatPrice(price) {
    return `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  }

  function criarCardPedido(pedido, key) {
    const card = document.createElement('div');
    card.className = 'col-12 col-lg-8 offset-lg-2 p-4 border rounded shadow-sm bg-light';

    card.innerHTML = `
      <h5>Pedido <span class="">${pedido.codigo || 'Sem código'}</span></h5>
      <p><strong>Data:</strong> ${formatDate(pedido.data)}</p>
      <p><strong>Total:</strong> ${formatPrice(pedido.total)}</p>
      <hr />
      <h6>Itens:</h6>
      <ul class="list-group mb-0">
          ${pedido.itens.map(item => `
          <li class="list-group-item d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
              <img src="${item.image}" alt="${item.title}" style="width: 50px; height: auto; border-radius: 4px;">
              <div>
                  <strong>${item.title}</strong><br/>
                  Quantidade: ${item.quantity}
              </div>
              </div>
              <span>${formatPrice(item.price)}</span>
          </li>
          `).join('')}
      </ul>
      `;
    return card;
  }

  onAuthStateChanged(auth, user => {
    if (!user) {
      pedidosContainer.innerHTML = `<p class="text-center text-danger">Você precisa estar logado para ver seus pedidos.</p>`;
      nenhumPedidoMsg.classList.add('d-none');
      return;
    }

    const pedidosRef = query(ref(db, 'pedidos'), orderByChild('userId'), equalTo(user.uid));

    onValue(pedidosRef, (snapshot) => {
      pedidosContainer.innerHTML = '';
      if (!snapshot.exists()) {
        nenhumPedidoMsg.classList.remove('d-none');
        return;
      }

      nenhumPedidoMsg.classList.add('d-none');
      const pedidos = snapshot.val();

      // Pedidos vem como objeto, iterar
      const pedidosArray = Object.entries(pedidos);
      pedidosArray.sort((a, b) => b[1].data - a[1].data); // Ordena do mais recente pro mais antigo

      pedidosArray.forEach(([key, pedido]) => {
        const card = criarCardPedido(pedido, key);
        pedidosContainer.appendChild(card);
      });
    }, {
      onlyOnce: false
    });
  });
});