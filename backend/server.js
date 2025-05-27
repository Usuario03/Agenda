require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("./db.js");


const app = express();

// Conectar a MongoDB Atlas
conectarDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

app.listen(5000, () => {
 console.log(`Servidor corriendo en el puerto ${PORT}`);
});
