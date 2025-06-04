const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const usuarioSchema = new mongoose.Schema({
  primerNombre: {
    type: String,
    required: [true, "El primer nombre es obligatorio"],
    trim: true,
  },
  segundoNombre: {
    type: String,
    trim: true,
  },
  cedula: {
    type: String,
    required: [true, "La cédula es obligatoria"],
    unique: true,
    trim: true,
  },
  fechaNacimiento: {
    type: Date,
    required: [true, "La fecha de nacimiento es obligatoria"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un correo válido"],
  },
  telefono: {
    type: String,
    required: [true, "El teléfono es obligatorio"],
    trim: true,
    match: [/^\d{10}$/, "El teléfono debe tener 10 dígitos"],
  },
  contraseña: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    minlength: [12, "La contraseña debe tener al menos 12 caracteres"],
  },
  sexo: {
    type: String,
    required: [true, "El sexo es obligatorio"],
    enum: ["M", "F"],
  },
  direccion: {
    type: String,
    required: [true, "La dirección es obligatoria"],
    trim: true,
  },
});

// Hashear la contraseña antes de guardar
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("contraseña")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.contraseña);
};

module.exports = mongoose.model("Usuario", usuarioSchema);