import { cadastrarUsuario } from './service/UserService.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cadastro');
  const sucesso = document.getElementById('mensagem-sucesso');
  const erro = document.getElementById('mensagem-erro');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    sucesso.classList.add('d-none');
    erro.classList.add('d-none');

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value;
    const confirmarSenha = form.confirmarsenha.value;

    if (senha !== confirmarSenha) {
      erro.textContent = "As senhas não coincidem.";
      erro.classList.remove('d-none');
      return;
    }

    const resultado = await cadastrarUsuario(nome, email, senha);

    if (resultado.sucesso) {
      sucesso.classList.remove('d-none');
      form.reset();
    } else {
      erro.textContent = resultado.erro;
      erro.classList.remove('d-none');
    }
  });
});

function toggleSenha(idInput, btn) {
  const input = document.getElementById(idInput);
  const icon = btn.querySelector('i');

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("bi-eye");
    icon.classList.add("bi-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("bi-eye-slash");
    icon.classList.add("bi-eye");
  }
}