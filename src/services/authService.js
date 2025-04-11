const API_URL = "http://localhost:3000"; // Ajusta si cambias de puerto o de ambiente

// ✅ Guardar tokens en localStorage
const setToken = (token) => localStorage.setItem("token", token); // SAP IAS token (opcional si quieres conservar)
const setInternalToken = (token) => localStorage.setItem("internalToken", token); // ✅ Nuestro token interno

// ✅ Obtener tokens
const getToken = () => localStorage.getItem("token");
const getInternalToken = () => localStorage.getItem("internalToken");

// ✅ Eliminar tokens
const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("internalToken"); // ✅ Eliminamos ambos
};

// ✅ Verificar si el usuario está autenticado
const isAuthenticated = () => !!getInternalToken(); // ✅ Verificamos por el token interno

// ✅ Verificar token de SAP IAS y obtener token interno del backend
const verifySapToken = async (sapToken) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sapToken}`, // ✅ Así lo enviamos como debe ser
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setToken(sapToken); // Opcional, por si quieres mantenerlo para otros flujos
      setInternalToken(data.internalToken); // ✅ Guardamos el token interno firmado por nuestro backend
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Error al verificar token:", error);
    return { success: false, message: "Error en la conexión con el servidor" };
  }
};

// ✅ Logout del frontend (limpia ambos tokens locales)
const logout = () => {
  removeToken();
};

// ✅ Exportamos todas las funciones
export {
  verifySapToken,
  logout,
  isAuthenticated,
  getToken,
  getInternalToken,
  setToken,
  setInternalToken
};
