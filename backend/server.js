require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./db.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
conectarDB();

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use("/api/auth", require("./routes/auth"));

// 🟩 Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname))); // sirve HTML, CSS, JS, imágenes

// 🟨 Ruta principal: index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🟦 Ruta para agendamiento: index2.html
app.get("/agendar", (req, res) => {
  res.sendFile(path.join(__dirname, "index2.html"));
});

// 🟩 Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
