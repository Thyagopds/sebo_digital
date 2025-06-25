import { auth, db } from './firebaseConfig.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const erroDiv = document.getElementById('mensagem-erro');

    const showErrorMessage = (message) => {
        erroDiv.textContent = message;
        erroDiv.classList.remove('d-none');
        setTimeout(() => {
            erroDiv.classList.add('d-none');
            erroDiv.textContent = '';
        }, 7000);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        erroDiv.classList.add('d-none');

        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        try {
            const cred = await signInWithEmailAndPassword(auth, email, senha);
            const uid = cred.user.uid;

            const snapshot = await get(ref(db, 'usuarios/' + uid));
            const dados = snapshot.val();

            if (!dados || !dados.role) {
                await auth.signOut();
                throw new Error("Sua conta não tem um perfil definido. Entre em contato com o suporte.");
            }

            // Redireciona para a página de doação se veio de lá
            const params = new URLSearchParams(window.location.search);
            if (params.get('redirect') === 'doacoes') {
                window.location.href = 'doacoes.html';
                return;
            }

            if (dados.role === 'admin') {
                window.location.href = 'index_admin.html';
            } else {
                window.location.href = 'catalogo_livros.html';
            }

        } catch (err) {
            let customMessage = "Ocorreu um erro desconhecido. Por favor, tente novamente mais tarde.";

            switch (err.code) {
                case 'auth/invalid-email':
                    customMessage = "O formato do e-mail é inválido.";
                    break;
                case 'auth/user-disabled':
                    customMessage = "Sua conta foi desativada. Por favor, entre em contato com o suporte.";
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                case 'auth/invalid-login-credentials':
                    customMessage = "E-mail ou senha incorretos. Por favor, verifique suas credenciais.";
                    break;
                case 'auth/too-many-requests':
                    customMessage = "Muitas tentativas de login falhas. Por favor, tente novamente em alguns minutos.";
                    break;
                default:
                    if (err.message === "Sua conta não tem um perfil definido. Entre em contato com o suporte.") {
                         customMessage = err.message;
                    } else {
                         customMessage = "Erro ao fazer login. Por favor, tente novamente.";
                    }
                    break;
            }

            showErrorMessage(customMessage);
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

// Torna a função global para uso no onclick do HTML
window.toggleSenha = toggleSenha;