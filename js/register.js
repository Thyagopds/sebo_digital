document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-cadastro');
  const sucesso = document.getElementById('mensagem-sucesso');
  const erro = document.getElementById('mensagem-erro');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Oculta alertas anteriores
    sucesso.classList.add('d-none');
    erro.classList.add('d-none');

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value;
    const confirmarSenha = form.confirmarsenha.value;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (senha !== confirmarSenha) {
      erro.classList.remove('d-none');
      return;
    }

    console.log("Cadastro enviado:");
    console.log("Nome:", nome);
    console.log("Email:", email);
    console.log("Senha: (oculta por segurança)");

    sucesso.classList.remove('d-none');
    form.reset();
  });
});

// Função para mostrar/ocultar senha
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