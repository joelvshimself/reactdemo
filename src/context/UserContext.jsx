import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const savedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        if (decoded.exp * 1000 > Date.now()) {
          console.log("🔑 Token válido encontrado:", savedToken);
          return savedToken;
        } else {
          console.warn("⚠️ Token expirado. Se solicitará nueva autenticación.");
        }
      } catch (error) {
        console.error("❌ Error al decodificar el token:", error);
      }
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      sessionStorage.setItem("token", token);
      console.log("✅ Token actualizado:", token);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
