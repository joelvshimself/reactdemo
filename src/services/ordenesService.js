const API_URL = "http://localhost:3000/api";

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token.trim()}` : "";
};

export const getOrdenes = async () => {
  const response = await fetch(`${API_URL}/ordenes`, {
    headers: {
      "Authorization": getToken()
    }
  });
  return response.ok ? await response.json() : [];
};

export const createOrden = async (orden) => {
  const response = await fetch(`${API_URL}/ordenes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getToken()
    },
    body: JSON.stringify(orden)
  });
  return response.ok;
};

export const updateOrden = async (id, orden) => {
  const response = await fetch(`${API_URL}/ordenes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getToken()
    },
    body: JSON.stringify(orden)
  });
  return response.ok;
};

export const deleteOrden = async (id) => {
  const response = await fetch(`${API_URL}/ordenes/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": getToken()
    }
  });
  return response.ok;
};
