const fs = require('fs');
const path = require('path');

// Simulación de una base de datos con archivo JSON
const filePath = path.join(__dirname, '..', 'data', 'usuarios.json');

// Asegúrate de que exista el archivo de datos
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

// Registrar usuario
const registerUser = (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
  }

  const usuarios = JSON.parse(fs.readFileSync(filePath));

  const existe = usuarios.find(user => user.correo === correo);
  if (existe) {
    return res.status(400).json({ mensaje: 'El usuario ya está registrado' });
  }

  usuarios.push({ correo, contraseña });
  fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));

  res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
};

// Iniciar sesión
const loginUser = (req, res) => {
  const { correo, contraseña } = req.body;

  const usuarios = JSON.parse(fs.readFileSync(filePath));
  const usuario = usuarios.find(user => user.correo === correo && user.contraseña === contraseña);

  if (usuario) {
    res.json({ mensaje: 'Inicio de sesión exitoso' });
  } else {
    res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }
};

module.exports = { registerUser, loginUser };
