import 'dotenv/config'; // Imports 
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './src/routes/userRoutes.js';
import setupSwagger from './src/config/swaggerConfig.js';
import session from "express-session";
import passport from "./src/passport.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { verifyToken } from './src/controllers/authController.js'; 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS bien configurado (solo una vez)
app.use(cors({
  origin: 'http://localhost:5173', // Frontend
  credentials: true // Cookies cross-origin
}));

app.use(express.json());
app.use(morgan('dev'));

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true si usas HTTPS
    httpOnly: true,
    sameSite: 'lax' // Importante para cross-origin
  }
}));

// Inicializar Passport y sesiones
app.use(passport.initialize());
app.use(passport.session());

// Configurar Swagger
setupSwagger(app);

// Rutas API
app.use('/api', userRoutes);

// ✅ Nueva ruta para verificar token recibido desde frontend
app.post('/auth/verify', verifyToken);

// Rutas de login SAP
app.get("/auth/sap", (req, res, next) => {
  passport.authenticate("oidc", {
    prompt: 'login' // 🚀 Esto fuerza la pantalla de login limpia
  })(req, res, next);
});

app.get("/auth/callback",
  passport.authenticate("oidc", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const user = req.user;
    const sessionUser = {
      id: user.localUser?.id,
      nombre: user.localUser?.nombre,
      email: user.localUser?.email,
      rol: user.localUser?.rol,
    };

    const internalToken = jwt.sign(sessionUser, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });    

    console.log("✅ Token interno generado:", internalToken);

    res.redirect(`http://localhost:5173/home?internal_token=${internalToken}`);
  }
);



app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

app.get("/auth/logout-local", (req, res) => {
  req.session.destroy(() => {
    req.logout(() => {
      res.clearCookie("connect.sid");
      res.status(200).send("Sesión local eliminada");
    });
  });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger Docs en http://localhost:${PORT}/api-docs`);
});
