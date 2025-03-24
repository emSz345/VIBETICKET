
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC32vVABbCQv8Xm_iA-lC1BBEuUh7AfujU",
  authDomain: "b4yint.firebaseapp.com",
  projectId: "b4yint",
  storageBucket: "b4yint.firebasestorage.app",
  messagingSenderId: "418405680864",
  appId: "1:418405680864:web:7c394b9f91535e0a043285",
  measurementId: "G-5JR4J6G81J"
};

// Inicializa o Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

//  login com Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Login com Google bem-sucedido!", user);
    alert("Login com Google bem-sucedido!");
  } catch (error) {
    console.error("Erro ao realizar login com Google", error);
    alert(`Erro ao realizar login com Google: ${error.message}`);
  }
};

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithGoogle };
