  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-fale-conosco');
    const mensagemSucesso = document.getElementById('mensagem-sucesso');

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Impede o reload da página

      if (form.checkValidity()) {
        // Captura os dados
        const dadosFormulario = {
          nome: form.nome.value.trim(),
          email: form.email.value.trim(),
          assunto: form.assunto.value.trim(),
          mensagem: form.mensagem.value.trim()
        };

        // Exibe os dados no console
        console.log("Dados enviados:");
        console.log("Nome:", dadosFormulario.nome);
        console.log("Email:", dadosFormulario.email);
        console.log("Assunto:", dadosFormulario.assunto);
        console.log("Mensagem:", dadosFormulario.mensagem);

        // Exibe mensagem de sucesso
        mensagemSucesso.classList.remove('d-none');

        // Limpa o formulário
        form.reset();
      }
    });
  });