import { auth, db } from '../firebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

export function loadHeader() {
  onAuthStateChanged(auth, async user => {
    let role = null;
    const displayName = user?.displayName || user?.email?.split('@')[0] || '';
    const email = user?.email || '';

    if (user) {
      const userRef = ref(db, `usuarios/${user.uid}`);
      try {
        const snapshot = await get(userRef);
        role = snapshot.val()?.role || null;
      } catch (error) {
        console.error('Erro ao buscar role do usuário:', error);
      }
    }

    const userSectionHTML = user
      ? `
        <div class="dropdown" style="margin-right: 2.4rem;">
          <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
            <div class="avatar rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center" style="width:40px; height:40px; font-weight:600;">
              ${displayName.charAt(0).toUpperCase()}
            </div>
          </a>
          <ul class="dropdown-menu dropdown-menu-end text-small shadow" aria-labelledby="dropdownUser" style="min-width: 200px;">
            <li><h6 class="dropdown-header">${displayName}</h6></li>
            <li><p class="dropdown-item-text text-muted mb-0" style="font-size: 0.85rem;">${email}</p></li>
            <li><hr class="dropdown-divider"></li>
            <li><button id="btn-logout" class="dropdown-item">Sair</button></li>
          </ul>
        </div>
      `
      : `
        <a class="link-login" href="login.html" title="Entrar">
          <button class="btn p-0 border-0 bg-transparent">
            <i class="bi bi-box-arrow-in-right fs-4 text-white"></i>
          </button>
        </a>
      `;

    // Carrinho com badge
    const iconLinksHTML = `
      <a class="link-login position-relative" href="carrinho.html" title="Carrinho">
        <button class="btn p-0 border-0 bg-transparent">
          <i class="bi bi-cart3 fs-4 text-white"></i>
          <span id="cart-badge" 
           style="font-size:0.8rem; left:60%; top:10%; transform:translate(-50%, 0);">
            0
          </span>
        </button>
      </a>
      <a class="link-login" href="pedidos.html" title="Meus Pedidos">
        <button class="btn p-0 border-0 bg-transparent">
          <i class="bi bi-box-seam fs-4 text-white"></i>
        </button>
      </a>
      ${role === 'admin' ? `
        <a class="link-login" href="index_admin.html" title="Painel Admin">
          <button class="btn p-0 border-0 bg-transparent">
            <i class="bi bi-bar-chart fs-4 text-white"></i>
          </button>
        </a>
      ` : ''}
    `;

    const headerHTML = `
      <header>
        <nav class="navbar navbar-expand-lg barra-navegacao fixed-top">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">
              <img src="img/logo.png" alt="logo">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
              aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="index.html">Início</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="catalogo_livros.html">Catálogo</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="sobre_nos.html">Sobre nós</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="doacoes.html">Doações</a>
                </li>
              </ul>

              <div class="d-flex align-items-center gap-3" id="icon-links">
                ${iconLinksHTML}
              </div>

              <div id="user-auth-section">
                ${userSectionHTML}
              </div>
            </div>
          </div>
        </nav>
      </header>
    `;

    const headerContainer = document.createElement('div');
    headerContainer.innerHTML = headerHTML;
    document.body.insertBefore(headerContainer, document.body.firstChild);

    // Atualiza badge do carrinho
    function atualizarBadgeCarrinho() {
      const badge = document.getElementById('cart-badge');
      if (!badge) return;
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);

      if (total > 0) {
        badge.textContent = total;
        badge.classList.remove('d-none');
      } else {
        badge.classList.add('d-none');
      }
    }

    atualizarBadgeCarrinho();
    document.addEventListener('cartUpdated', atualizarBadgeCarrinho);

    if (user) {
      document.getElementById('btn-logout')?.addEventListener('click', () => {
        auth.signOut().then(() => {
          window.location.href = 'index.html';
        });
      });
    }
  });
}