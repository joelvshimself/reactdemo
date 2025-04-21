import { useNavigate } from "react-router-dom";
import {
  Button,
  Link,
  Title,
  Text,
  FlexBox,
  FlexBoxDirection
} from "@ui5/webcomponents-react";
import GoogleIcon from "@mui/icons-material/Google";
import { Button as MuiButton } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();

  const handleSapLogin = () => {
    window.location.href = "http://localhost:3000/auth/sap";
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
          }}
        >
          <img
            src="/viba1.png"
            alt="Carnes ViBa"
            style={{ width: "150px", margin: "0 auto 20px auto" }}
          />

          <Title level="H4" style={{ textAlign: "center", marginBottom: "1rem" }}>
            Iniciar Sesión
          </Title>

          <Button
            onClick={handleSapLogin}
            style={{
              width: "100%",
              backgroundColor: "#E53935",
              color: "white",
              marginBottom: "16px",
            }}
          >
            Iniciar Sesión
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

          <Text style={{ fontSize: "12px", textAlign: "center", marginTop: "1rem" }}>
            <Link href="#">Términos & Condiciones</Link> |{" "}
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
