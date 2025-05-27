// app.js (Frontend JavaScript completo con conexión al backend)
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-agendar").addEventListener("click", () => {
    window.location.href = "index2.html";
  });

  document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
    mostrarFormulario("menu-principal");
  });

  document.getElementById("btn-login").addEventListener("click", () => mostrarFormulario("form-login"));
  document.getElementById("btn-registro").addEventListener("click", () => mostrarFormulario("form-registro"));

  document.querySelectorAll(".volver").forEach(btn => {
    btn.addEventListener("click", () => mostrarFormulario("menu-principal"));
  });

  document.querySelector("#form-login form").addEventListener("submit", loginUsuario);
  document.querySelector("#form-registro form").addEventListener("submit", registrarUsuario);
});

function mostrarFormulario(id) {
  document.querySelectorAll("main, section").forEach(seccion => {
    seccion.classList.add("oculto");
  });
  document.getElementById(id).classList.remove("oculto");
}

async function loginUsuario(event) {
  event.preventDefault();
  const correo = document.getElementById("login-correo").value;
  const contraseña = document.getElementById("login-contraseña").value;
  const resultado = document.getElementById("resultado-login");

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contraseña }),
    });

    const data = await res.json();

    if (res.ok) {
      resultado.innerText = "✅ Inicio de sesión exitoso";
      resultado.style.color = "green";
      setTimeout(() => mostrarFormulario("vista-principal"), 1000);
    } else {
      resultado.innerText = `⚠️ ${data.msg || "Credenciales inválidas"}`;
      resultado.style.color = "red";
    }
  } catch (error) {
    resultado.innerText = "❌ Error al conectar con el servidor";
    resultado.style.color = "red";
  }
}

async function registrarUsuario(event) {
  event.preventDefault();
  const usuario = {
    primerNombre: document.getElementById("primer-nombre").value,
    segundoNombre: document.getElementById("segundo-nombre").value,
    cedula: document.getElementById("cedula").value,
    fechaNacimiento: document.getElementById("fecha-nacimiento").value,
    correo: document.getElementById("correo").value,
    telefono: document.getElementById("telefono").value,
    contraseña: document.getElementById("contraseña").value,
    confirmarContraseña: document.getElementById("confirmar-contraseña").value,
    sexo: document.getElementById("sexo").value,
    direccion: document.getElementById("direccion").value,
  };

  const resultado = document.getElementById("resultado-registro");

  if (usuario.contraseña !== usuario.confirmarContraseña) {
    resultado.innerText = "⚠️ Las contraseñas no coinciden";
    resultado.style.color = "red";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    const data = await res.json();

    if (res.ok) {
      resultado.innerText = "✅ Registro exitoso";
      resultado.style.color = "green";
    } else {
      resultado.innerText = `⚠️ ${data.msg || "Error al registrar"}`;
      resultado.style.color = "red";
    }
  } catch (error) {
    resultado.innerText = "❌ Error al conectar con el servidor";
    resultado.style.color = "red";
  }
} 

// server.js (Backend Node.js)
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});
