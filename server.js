require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const conectarDB = require('./db.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
conectarDB();

// Configuración CORS mejorada y más flexible
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir todas las solicitudes de Render y localhost
    const allowedPatterns = [
      /https?:\/\/agenda-yic3\.onrender\.com$/,
      /https?:\/\/tu-api\.onrender\.com$/,
      /http:\/\/localhost(:\d+)?$/
    ];
    
    // Permitir solicitudes sin origen (Postman, móviles, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedPatterns.some(pattern => pattern.test(origin))) {
      callback(null, true);
    } else {
      console.log('Origen bloqueado:', origin); // Para debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Aplicar CORS
app.use(cors(corsOptions));

// Manejar explícitamente las peticiones OPTIONS (preflight)
app.options('*', cors(corsOptions));

// Resto de tu configuración...
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api/auth', require('./routes/auth'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n✅ Servidor listo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS configurado para:`);
  console.log(`   - https://agenda-yic3.onrender.com`);
  console.log(`   - http://localhost:3000`);
  console.log(`   - Cualquier subdominio de render.com`);
});