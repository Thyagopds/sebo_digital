document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const erro = document.getElementById('mensagem-erro');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Oculta o alerta anterior
    erro.classList.add('d-none');

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    // Verificação de credenciais fixas
    if (email === 'admin@gmail.com' && senha === 'admin123') {
      // Simula redirecionamento após login válido
      window.location.href = 'cadastrar.html'; // substitua por sua página de destino
    } else {
      erro.classList.remove('d-none');
    }
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