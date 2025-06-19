// Importa os módulos do Firebase (modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Credenciais
const firebaseConfig = {
  apiKey: "AIzaSyBy0TnXEcdTXO2LtJDdtqPI_hM-PEgDlCA",
  authDomain: "sebo-digital.firebaseapp.com",
  databaseURL: "https://sebo-digital-default-rtdb.firebaseio.com",
  projectId: "sebo-digital",
  storageBucket: "sebo-digital.appspot.com",
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Exporta para outros arquivos usarem
export { db, auth };
