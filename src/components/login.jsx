import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Link,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useContext(UserContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5030/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        console.log("✅ Login exitoso");
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setError(false);
        navigate("/home");
      } else {
        console.log("❌ Credenciales incorrectas");
        setError(true);
      }
    } catch (err) {
      console.error("Error al conectar con la API:", err);
      setError(true);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Mitad Izquierda: Formulario */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #8B0000, #E53935)",
        }}
      >
        <Container maxWidth={false}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
              backgroundColor: "white",
              maxWidth: 400,
              margin: "0 auto",
            }}
          >
            {/* Logo */}
            <img
              src="/viba1.png"
              alt="Carnes ViBa"
              style={{ width: "150px", marginBottom: "20px" }}
            />

            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Iniciar Sesión
            </Typography>

            {/* Formulario */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%", mt: 2 }}
            >
              <TextField
                label="Email"
                name="email"
                type="text"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={error}
              />
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={error}
                helperText={error ? "Correo o contraseña incorrectos" : ""}
              />

              <Link
                href="#"
                underline="hover"
                sx={{ display: "block", textAlign: "right", mt: 1 }}
              >
                ¿Olvidaste tu contraseña?
              </Link>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#E53935",
                  "&:hover": { backgroundColor: "#C62828" },
                  textTransform: "none",
                  fontSize: "16px",
                }}
              >
                Sign In
              </Button>

              <Typography textAlign="center" sx={{ my: 2 }}>
                o continuar con
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<GoogleIcon />}
                sx={{
                  textTransform: "none",
                  fontSize: "16px",
                  borderColor: "#E53935",
                  color: "#E53935",
                  "&:hover": { backgroundColor: "#fbe9e7" },
                }}
              >
                Google
              </Button>
            </Box>

            <Typography variant="caption" sx={{ mt: 2 }}>
              <Link href="#" underline="hover">
                Términos & Condiciones
              </Link>{" "}
              |{" "}
              <Link href="#" underline="hover">
                Soporte
              </Link>{" "}
              |{" "}
              <Link href="#" underline="hover">
                Legal & Opciones
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Mitad Derecha: Imagen de fondo */}
      <Box
        sx={{
          width: "50%",
          backgroundImage: "url('/carne.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </Box>
  );
}
