import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Link,
  Title,
  Text,
  FlexBox,
  FlexBoxDirection
} from "@ui5/webcomponents-react";
import GoogleIcon from "@mui/icons-material/Google";
import { Button as MuiButton } from "@mui/material";
import { login } from "../services/authService"; // Asegúrate que esta ruta sea correcta

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const result = await login(form.email, form.password);
    
    if (result.success) {
      localStorage.setItem("localAuth", JSON.stringify(result.user));
  
      // 🚀 Redirige a SAP con el parámetro login_hint
      const sapAuthUrl = `http://localhost:3000/auth/sap?login_hint=${encodeURIComponent(form.email)}`;
      window.location.href = sapAuthUrl;
    } else {
      setError(true);
    }
  };
  
  

return (
  <FlexBox
    direction={FlexBoxDirection.Row}
    style={{
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
    }}
  >
    {/* Mitad izquierda: formulario */}
    <FlexBox
      direction={FlexBoxDirection.Column}
      style={{
        width: "50%",
        background: "linear-gradient(135deg, #8B0000, #E53935)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FlexBox
        direction="Column"
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "16px",
          maxWidth: "400px",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <img
          src="/viba1.png"
          alt="Carnes ViBa"
          style={{ width: "150px", margin: "0 auto 20px auto" }}
        />

        <Title level="H4">Iniciar Sesion</Title>

        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onInput={(e) =>
              handleChange({ target: { name: "email", value: e.target.value } })
            }
            style={{ marginBottom: "1rem", width: "100%" }}
          />
          <Input
            name="password"
            type="Password"
            placeholder="Contraseña"
            value={form.password}
            onInput={(e) =>
              handleChange({ target: { name: "password", value: e.target.value } })
            }
            style={{ marginBottom: "0.5rem", width: "100%" }}
          />
          {error && (
            <Text style={{ color: "red", fontSize: "12px" }}>
              Correo o contraseña incorrectos
            </Text>
          )}

          <FlexBox justifyContent="End" style={{ marginBottom: "1rem" }}>
            <Link href="#">¿Olvidaste tu contraseña?</Link>
          </FlexBox>

          <Button
            type="Submit"
            style={{
              width: "100%",
              backgroundColor: "#E53935",
              color: "white",
              marginBottom: "16px",
            }}
          >
            Sign In
          </Button>

          <Text style={{ textAlign: "center", marginBottom: "12px" }}>
            o continuar con
          </Text>
          <MuiButton
            fullWidth
            startIcon={<GoogleIcon />}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontSize: "16px",
              borderColor: "#E53935",
              color: "#E53935",
              "&:hover": {
                backgroundColor: "#fbe9e7",
                borderColor: "#C62828",
              },
              marginBottom: "12px"
            }}
          >
            Google
          </MuiButton>
        </form>

        <Text style={{ fontSize: "12px", textAlign: "center", marginTop: "1rem" }}>
          <Link href="#">Terminos & Condiciones</Link> |{" "}
          <Link href="#">Soporte</Link> |{" "}
          <Link href="#">Legal & Opciones</Link>
        </Text>
      </FlexBox>
    </FlexBox>

    {/* Mitad derecha: imagen */}
    <div
      style={{
        width: "50%",
        backgroundImage: "url('/carne.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  </FlexBox>
);
}
