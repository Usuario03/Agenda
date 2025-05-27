// models/User.js
const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  primerNombre: String,
  segundoNombre: String,
  cedula: String,
  fechaNacimiento: String,
  correo: String,
  telefono: String,
  contraseña: String,
  sexo: String,
  direccion: String,
});

module.exports = mongoose.model("Usuario", usuarioSchema);
