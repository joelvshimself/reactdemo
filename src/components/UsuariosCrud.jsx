import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const API_URL = "http://localhost:5030";

const UsuariosCrud = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUsuarios();
  }, [token]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        setError("No autorizado. Redirigiendo al inicio de sesión...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (response.status === 403) {
        setError(
          "⚠️ No tienes permisos suficientes para acceder a esta información."
        );
        return;
      }

      if (!response.ok) {
        throw new Error("Error al obtener usuarios");
      }

      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError("Error al obtener la lista de usuarios. Verifica la API.");
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Usuarios (SAP HANA)</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={logoutUser} style={{ marginRight: "10px" }}>
          Cerrar sesión
        </button>
        <button onClick={() => navigate("/home")}>Volver a Inicio</button>
      </div>

      {loading && <p>Cargando usuarios...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", maxWidth: "800px" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Último Login</th>
            <th>Fecha de Creación</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.name}</td>
              <td>{usuario.email}</td>
              <td>
                {usuario.lastLogin
                  ? new Date(usuario.lastLogin).toLocaleString()
                  : "—"}
              </td>
              <td>
                {usuario.createdAt
                  ? new Date(usuario.createdAt).toLocaleString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosCrud;
