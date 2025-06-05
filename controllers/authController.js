const bcrypt = require("bcrypt");
const Usuario = require("../models/User");

// Registro de usuario
const registerUser = async (req, res) => {
  try {
    const {
      primerNombre,
      segundoNombre,
      cedula,
      fechaNacimiento,
      correo,
      telefono,
      contraseña,
      confirmarContraseña,
      sexo,
      direccion,
    } = req.body;

    // Validaciones
    if (
      !primerNombre ||
      !cedula ||
      !correo ||
      !contraseña ||
      !confirmarContraseña
    ) {
      return res.status(400).json({ mensaje: "Campos obligatorios faltantes" });
    }

    if (contraseña !== confirmarContraseña) {
      return res.status(400).json({ mensaje: "Las contraseñas no coinciden" });
    }

    if (contraseña.length < 12) {
      return res
        .status(400)
        .json({ mensaje: "La contraseña debe tener al menos 12 caracteres" });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // Crear nuevo usuario (el hash de la contraseña se maneja en el middleware del modelo)
    const nuevoUsuario = new Usuario({
      primerNombre,
      segundoNombre,
      cedula,
      fechaNacimiento,
      correo,
      telefono,
      contraseña,
      sexo,
      direccion,
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error en registerUser:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    // Comparar contraseña usando el método del modelo
    const contraseñaValida = await usuario.comparePassword(contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    res.json({ mensaje: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error("Error en loginUser:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

module.exports = { registerUser, loginUser };
