import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, OAuthProvider, GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC32vVABbCQv8Xm_iA-lC1BBEuUh7AfujU",
  authDomain: "b4yint.firebaseapp.com",
  projectId: "b4yint",
  storageBucket: "b4yint.firebasestorage.app",
  messagingSenderId: "418405680864",
  appId: "1:418405680864:web:7c394b9f91535e0a043285",
  measurementId: "G-5JR4J6G81J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");



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
      isAdmin: false
    };
  } catch (error) {
    console.error("Erro no login com Google:", error);
    throw error;
  }
};

const signInWithFacebook = () => {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/pt_BR/sdk.js";
      script.async = true;
      script.onload = () => {
        window.FB.init({
          appId: "2369325230112335",
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

          resolve({
            displayName: user.displayName || "Usuário",
            email: user.email,
            photoURL: user.photoURL || "",
            uid: user.uid,
            isAdmin: false
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