import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { UserProvider, UserContext } from "./context/UserContext";
import Login from "./components/login";
import Home from "./components/home";
import Producto from "./components/producto";
import UsersList from "./components/UsuariosList"; // Importamos el nuevo componente

function ProtectedRoute({ element }) {
  const { token } = useContext(UserContext);
  return token ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/producto"
            element={<ProtectedRoute element={<Producto />} />}
          />
          <Route
            path="/usuarios-list"
            element={<ProtectedRoute element={<UsersList />} />} /> {/* Nueva ruta */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
