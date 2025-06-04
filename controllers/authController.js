const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const dataDir = path.join(__dirname, '..', 'data');
const filePath = path.join(dataDir, 'usuarios.json');

// Crear archivo si no existe
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));

// Helper para leer/escribir usuarios
const readUsers = () => JSON.parse(fs.readFileSync(filePath));
const writeUsers = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

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
    if (!primerNombre || !cedula || !correo || !contraseña || !confirmarContraseña) {
      return res.status(400).json({ mensaje: 'Campos obligatorios faltantes' });
    }

    if (contraseña !== confirmarContraseña) {
      return res.status(400).json({ mensaje: 'Las contraseñas no coinciden' });
    }

    if (contraseña.length < 12) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 12 caracteres' });
    }

    const usuarios = readUsers();
    if (usuarios.some(user => user.correo === correo)) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Guardar usuario
    const nuevoUsuario = {
      primerNombre,
      segundoNombre,
      cedula,
      fechaNacimiento,
      correo,
      telefono,
      contraseña: hashedPassword, // Guarda la versión hasheada
      sexo,
      direccion,
    };

    writeUsers([...usuarios, nuevoUsuario]);
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const usuarios = readUsers();
    const usuario = usuarios.find(user => user.correo === correo);

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    // Comparar contraseña hasheada
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    res.json({ mensaje: 'Inicio de sesión exitoso' });

  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { registerUser, loginUser };