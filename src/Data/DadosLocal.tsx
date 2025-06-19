// utils/auth.ts
export const isAuthenticated = () => {
  return !!localStorage.getItem("token") || !!localStorage.getItem("firebaseToken");
};

export const isAdmin = () => {
  // Adicione sua lógica para verificar se o usuário é admin
  return localStorage.getItem("userRole") === "admin";
};

export const getUserInfo = () => ({
  name: localStorage.getItem("userName") || "Usuário",
  email: localStorage.getItem("userEmail") || "usuario@email.com",
  loginType: localStorage.getItem("tipoLogin") as "email" | "google" | "facebook" || "email"
});