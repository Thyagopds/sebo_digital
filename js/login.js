document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const erro = document.getElementById('mensagem-erro');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    erro.classList.add('d-none');
    const email = emailInput.value.trim();
    const senha = senhaInput.value;
    if (email === 'admin@gmail.com' && senha === 'admin123') {
      window.location.href = 'cadastrar.html'; 
    } else {
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