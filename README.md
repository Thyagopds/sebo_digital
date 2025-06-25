# Sebo Digital

Sistema web para gerenciamento e venda de livros usados, com funcionalidades para administração, catálogo, doações, pedidos e autenticação de usuários.

## Funcionalidades

- **Catálogo de Livros:** Visualização, busca, filtro e ordenação de livros disponíveis.
- **Administração:** Cadastro, edição e remoção de livros, validação de doações, gestão de usuários.
- **Doações:** Usuários autenticados podem doar livros preenchendo formulário completo.
- **Carrinho e Pedidos:** Adição de livros ao carrinho, finalização de compra e histórico de pedidos.
- **Autenticação:** Cadastro, login e controle de acesso por perfil (admin/cliente).
- **Painel Admin:** Estatísticas rápidas de usuários, livros e doações.

## Tecnologias

- HTML5, CSS3, JavaScript (ES6+)
- [Bootstrap 5](https://getbootstrap.com/)
- [Firebase Realtime Database](https://firebase.google.com/)
- [Firebase Auth](https://firebase.google.com/)

## Como rodar

1. Clone o repositório.
2. Configure as credenciais do Firebase em `js/firebaseConfig.js`.
3. Abra `index.html` ou `catalogo_livros.html` em um navegador moderno.
4. Para acessar o painel admin, use:
   - **Usuário:** admin@sebo.com
   - **Senha:** admin123

## Estrutura

- `index.html` — Página inicial
- `catalogo_livros.html` — Catálogo público de livros
- `livros_crud_admin.html` — Gerenciamento de livros (admin)
- `doacoes.html` — Formulário de doação de livros
- `doacoes_list_admin.html` — Validação de doações (admin)
- `login.html` / `register.html` — Autenticação de usuários
- `js/` — Scripts JavaScript (lógica de CRUD, autenticação, etc)
- `css/` — Estilos personalizados

## Observações

- Apenas usuários autenticados podem doar livros ou realizar pedidos.
- Apenas administradores têm acesso ao painel de administração.
- O projeto utiliza Firebase apenas como backend (sem servidor próprio).

---
Desenvolvido para fins acadêmicos.