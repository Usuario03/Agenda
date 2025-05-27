require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("./db.js");

const app = express();

// ⚠️ Aquí defines el puerto
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB Atlas
conectarDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
