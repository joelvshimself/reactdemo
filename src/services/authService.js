const API_URL = "http://localhost:3000/api";

// Guardar token 
const setToken = (token) => localStorage.setItem("token", token);
const getToken = () => localStorage.getItem("token");
const removeToken = () => localStorage.removeItem("token");

// Verificar si el usuario esta autenticado
const isAuthenticated = () => !!getToken();

// Login
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: "Error en la conexión con el servidor" };
  }
};

// Registro
const register = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: "Error en la conexión con el servidor" };
  }
};

// Logout
const logout = () => {
  removeToken();
};

export { login, register, logout, isAuthenticated };
