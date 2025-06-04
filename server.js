require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const conectarDB = require('./db.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
conectarDB();

// Configuración CORS mejorada
const allowedOrigins = [
  'https://agenda-yic3.onrender.com',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin) || origin?.includes('render.com')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares esenciales
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Para preflight requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api/auth', require('./routes/auth'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'CorsError') {
    return res.status(403).json({ 
      error: 'Acceso no permitido',
      details: err.message 
    });
  }
  
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS habilitado para:`);
  allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
});