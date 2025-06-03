require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./db.js");

const app = express();
const PORT = process.env.PORT || 10000;

// Conectar a MongoDB
conectarDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/api/auth", require("./routes/auth"));

// Archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Rutas específicas para tus páginas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/agendar", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "agendar.html"));
});

app.get("/registro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "registro.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Fallback para rutas no encontradas (opcional, útil si usas frontend tipo SPA)
app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
