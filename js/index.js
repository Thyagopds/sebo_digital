document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-fale-conosco');
  const mensagemSucesso = document.getElementById('mensagem-sucesso');

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o reload da página

    if (form.checkValidity()) {
      const dadosFormulario = {
        nome: form.nome.value.trim(),
        email: form.email.value.trim(),
        assunto: form.assunto.value.trim(),
        mensagem: form.mensagem.value.trim()
      };
      console.log("Dados enviados:");
      console.log("Nome:", dadosFormulario.nome);
      console.log("Email:", dadosFormulario.email);
      console.log("Assunto:", dadosFormulario.assunto);
      console.log("Mensagem:", dadosFormulario.mensagem);

      mensagemSucesso.classList.remove('d-none');
      
      form.reset();
    }
  });
});