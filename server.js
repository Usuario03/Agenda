require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./db.js");

const app = express();
const PORT = process.env.PORT || 10000;

// Conectar a MongoDB
conectarDB();

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/api/auth", require("./routes/auth"));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas específicas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/agendar", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "agendar.html"));
});

app.get("/registro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "registro.html"));
});

// Captura cualquier otra ruta y devuelve index.html (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
