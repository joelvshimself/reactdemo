import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TwoFAScreen() {
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const generate2FA = async () => {
    const res = await fetch("http://localhost:3000/api/auth/generate-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setQr(data.qr);
    setSecret(data.secret);
  };
  
  const verify2FA = async () => {
    const res = await fetch("http://localhost:3000/api/auth/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email }) // ✅ enviar email en lugar de secret
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
      <p>Presiona para generar tu código QR:</p>
      <button onClick={generate2FA}>Generar QR</button>
      {qr && (
        <>
          <img src={qr} alt="Escanea el código con Google Authenticator" />
          <div style={{ marginTop: "1rem" }}>
            <input
              type="text"
              placeholder="Código de 6 dígitos"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button onClick={verify2FA}>Verificar Código</button>
          </div>
        </>
      )}
    </div>
  );
}
