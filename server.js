require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./db.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
conectarDB();

// Configuración CORS para producción/desarrollo
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-frontend.onrender.com', 'https://www.tudominio.com'] 
    : 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Para manejar datos grandes
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use("/api/auth", require("./routes/auth"));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor!' });
});

// Rutas para vistas HTML (SPA - Single Page Application)
app.get(["/", "/agendar", "/login", "/registro"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta de verificación de salud del servidor
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});