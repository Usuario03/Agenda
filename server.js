require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./db.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
conectarDB();

// Configuración CORS mejorada y dinámica
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://agenda-yic3.onrender.com',  // Tu frontend en Render
      'http://localhost:3000'              // Desarrollo local
    ];
    
    // Permitir solicitudes sin origen (como apps móviles o Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes("render.com")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

// Aplicar CORS
app.use(cors(corsOptions));

// Manejar preflight para todas las rutas
app.options("*", cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use("/api/auth", require("./routes/auth"));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Manejo de errores mejorado
app.use((err, req, res, next) => {
  if (err.name === 'CorsError') {
    return res.status(403).json({ error: 'Acceso no permitido por CORS' });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Rutas para vistas HTML
app.get(["/", "/agendar", "/login", "/registro"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health Check
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    cors: 'configured',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS habilitado para:`);
  console.log(`   - https://agenda-yic3.onrender.com`);
  console.log(`   - http://localhost:3000`);
});