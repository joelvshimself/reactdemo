import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TwoFAScreen() {
  const [qr, setQr] = useState(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Verifica si el usuario ya tiene 2FA activado
  useEffect(() => {
    const check2FA = async () => {
      const res = await fetch("http://localhost:3000/api/auth/check-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.twoFAEnabled) {
        setQr("yaActivado");
      }
    };

    if (email) {
      check2FA();
    }
  }, [email]);

  const generate2FA = async () => {
    const res = await fetch("http://localhost:3000/api/auth/generate-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setQr(data.qr);
  };

  const verify2FA = async () => {
    const res = await fetch("http://localhost:3000/api/auth/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email }),
    });

    const data = await res.json();
    if (data.success) {
      navigate("/home");
    } else {
      alert("❌ Código incorrecto");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Autenticación en 2 Pasos</h2>

      {qr === null && (
        <>
          <p>Presiona para generar tu código QR:</p>
          <button onClick={generate2FA}>Generar QR</button>
        </>
      )}

      {qr === "yaActivado" && (
        <p>Ya tienes activado Google Authenticator. Ingresa tu código:</p>
      )}

      {qr && qr !== "yaActivado" && (
        <img src={qr} alt="Escanea el código con Google Authenticator" />
      )}

      {(qr || qr === "yaActivado") && (
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Código de 6 dígitos"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={verify2FA}>Verificar Código</button>
        </div>
      )}
    </div>
  );
}
