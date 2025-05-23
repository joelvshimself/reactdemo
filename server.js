import 'dotenv/config'; // Imports
import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; 
import userRoutes from './src/routes/userRoutes.js';
import ordenesRoutes from './src/routes/ordenesRoutes.js';
import setupSwagger from './src/config/swaggerConfig.js';
import twoFARoutes from './src/routes/twoFARoutes.js';
import crudr from './src/routes/crudr.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', twoFARoutes);

// Configurar Morgan 
app.use(morgan('dev'));  

// Configurar Swagger
setupSwagger(app);

// Rutas usuario
app.use('/api', userRoutes);
// Rutas CRUD
app.use('/api', crudr);

// Rutas ordenes
app.use('/api/ordenes', ordenesRoutes);

// Port y terminal Host
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger Docs en http://localhost:${PORT}/api-docs`);
});
