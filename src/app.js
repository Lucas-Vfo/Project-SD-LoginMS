const express = require('express');
const authRoutes = require('./routes');
require('dotenv').config();
const cors = require('cors');

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const app = express();
app.use(express.json()); // Habilita el middleware para parsear JSON en el cuerpo de las solicitudes.
app.use(cors(corsOptions)); // Use this after the variable declaration

// Registrar las rutas de autenticación bajo el prefijo '/api'.
app.use('/api', authRoutes);

// Definir el puerto en el que se ejecutará el servicio.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // Iniciar el servidor y mostrar un mensaje en consola.
  console.log(`Servidor de autenticación corriendo en el puerto ${PORT}`);
});