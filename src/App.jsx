import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home"; // Página de inicio
import Producto from "./components/producto";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"  element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/producto" element={<Producto />} />
      </Routes>
    </Router>
  );
}

export default App;