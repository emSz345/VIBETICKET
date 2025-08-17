
import { initializeApp } from "firebase/app";
import axios from "axios";
import { getAuth, signInWithPopup, OAuthProvider, GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential } from "firebase/auth";

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
const FB = window.FB;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

const createFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};


//  login com Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    if (!user.email) {
      throw new Error("E-mail não disponível na conta Google");
    }

    return {
      displayName: user.displayName || user.email.split('@')[0],
      email: user.email,
      photoURL: user.photoURL || "",
      uid: user.uid,
       isAdmin: false // Adicione este campo
    };
  } catch (error) {
    console.error("Erro no login com Google:", error);
    throw error;
  }
};


const facebookProvider = new FacebookAuthProvider();


//ERRO
const signInWithFacebook = () => {
  return new Promise((resolve, reject) => {
    if (!window.FB) {

      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/pt_BR/sdk.js";
      script.async = true;
      script.onload = () => {
        window.FB.init({
          appId: "2369325230112335", // ✅ Coloque aqui seu App ID do Facebook
          cookie: true,
          xfbml: false,
          version: "v18.0"
        });

        realizarLoginComFacebook(resolve, reject);
      };
      script.onerror = reject;
      document.body.appendChild(script);
    } else {
      realizarLoginComFacebook(resolve, reject);
    }
  });
};


function realizarLoginComFacebook(resolve, reject) {
  window.FB.login((response) => {
    if (response.authResponse) {
      const accessToken = response.authResponse.accessToken;
      const credential = FacebookAuthProvider.credential(accessToken);

      (async () => {
        try {
          const result = await signInWithCredential(auth, credential);
          const user = result.user;
         

         

          // Envia os dados pro backend
          const response = await axios.post(
            "http://localhost:5000/api/users/social-login",
            {
              provider: 'facebook',
              userData: {
                nome: user.displayName || "Usuário",
                email: user.email,
                imagemPerfil: user.photoURL || "",
                 isAdmin: false // Adicione este campo
              }
            }
          );

          const backendData = response.data;
          resolve({
            token: backendData.token,
            user: backendData.user
          });
        } catch (error) {
          console.error("Erro ao autenticar no Firebase:", error);
          reject(error);
        }
      })();
    } else {
      reject(new Error("Login com Facebook cancelado."));
    }
  }, { scope: "email" });
}



const signInWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    console.log("Login com Apple bem-sucedido!", result.user);
    alert("Login com Apple bem-sucedido!");
  } catch (error) {
    console.error("Erro ao realizar login com Apple", error);
    alert(`Erro ao realizar login com Apple: ${error.message}`);
  }
};

export { auth, createUserWithEmailAndPassword, signInWithFacebook, signInWithEmailAndPassword, signInWithGoogle, signInWithApple };
