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

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal: index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta para agendamiento: index2.html
app.get("/agendar", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index2.html"));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});