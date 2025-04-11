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
  localStorage.removeItem("internalToken"); 
};

//Verificar si el usuario está autenticado
const isAuthenticated = () => !!getInternalToken(); 

//Verificar token de SAP IAS y obtener token interno del backend
const verifySapToken = async (sapToken) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sapToken}`, 
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setToken(sapToken); 
      setInternalToken(data.internalToken); 
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Error al verificar token:", error);
    return { success: false, message: "Error en la conexión con el servidor" };
  }
};

//Logout 
const logout = () => {
  removeToken();
};


export {
  verifySapToken,
  logout,
  isAuthenticated,
  getToken,
  getInternalToken,
  setToken,
  setInternalToken
};
