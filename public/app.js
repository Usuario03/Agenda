document.addEventListener("DOMContentLoaded", () => {
  // Botón para ir a agendar (si existe)
  const btnAgendar = document.getElementById("btn-agendar");
  if (btnAgendar) {
    btnAgendar.addEventListener("click", () => {
      window.location.href = "agendar.html";
    });
  }

  // Botón cerrar sesión (si existe)
  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      mostrarFormulario("menu-principal");
    });
  }

  // Botón login (si existe)
  const btnLogin = document.getElementById("btn-login");
  if (btnLogin) {
    btnLogin.addEventListener("click", () => mostrarFormulario("form-login"));
  }

  // Botón registro (si existe)
  const btnRegistro = document.getElementById("btn-registro");
  if (btnRegistro) {
    btnRegistro.addEventListener("click", () => mostrarFormulario("form-registro"));
  }

  // Botones con clase 'volver' para regresar al menú principal
  document.querySelectorAll(".volver").forEach(btn => {
    btn.addEventListener("click", () => mostrarFormulario("menu-principal"));
  });

  // Formulario login
  const loginForm = document.querySelector(".form-login");
  if (loginForm) {
    loginForm.addEventListener("submit", loginUsuario);
  }

  // Formulario registro
  const registroForm = document.querySelector(".form-registro");
  if (registroForm) {
    registroForm.addEventListener("submit", registrarUsuario);
  }
});

function mostrarFormulario(id) {
  document.querySelectorAll("main, section").forEach(seccion => {
    seccion.classList.add("oculto");
  });
  const elem = document.getElementById(id);
  if (elem) {
    elem.classList.remove("oculto");
  }
}

async function loginUsuario(event) {
  event.preventDefault();

  const correoInput = document.getElementById("login-correo");
  const contraseñaInput = document.getElementById("login-contraseña");
  const resultado = document.getElementById("resultado-login");

  if (!correoInput || !contraseñaInput || !resultado) {
    console.error("Faltan elementos de login en el DOM");
    return;
  }

  const correo = correoInput.value;
  const contraseña = contraseñaInput.value;

  try {
    // IMPORTANTE: Cambia esta URL por la de tu backend en Render
    const res = await fetch("https://tu-api.onrender.com/api/auth/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        correo, 
        contraseña 
      }),
    });

    const data = await res.json();

    if (res.ok) {
      resultado.innerText = "✅ Inicio de sesión exitoso";
      resultado.style.color = "green";
      
      // Guarda el token en localStorage si lo recibes
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      setTimeout(() => {
        window.location.href = "agendar.html";
      }, 1000);
    } else {
      resultado.innerText = `⚠️ ${data.msg || "Credenciales inválidas"}`;
      resultado.style.color = "red";
    }
  } catch (error) {
    console.error("Error en login:", error);
    resultado.innerText = "❌ Error al conectar con el servidor";
    resultado.style.color = "red";
  }
}

async function registrarUsuario(event) {
  event.preventDefault();

  const primerNombreInput = document.getElementById("primer-nombre");
  const segundoNombreInput = document.getElementById("segundo-nombre");
  const cedulaInput = document.getElementById("cedula");
  const fechaNacimientoInput = document.getElementById("fecha-nacimiento");
  const correoInput = document.getElementById("correo");
  const telefonoInput = document.getElementById("telefono");
  const contraseñaInput = document.getElementById("contraseña");
  const confirmarContraseñaInput = document.getElementById("confirmar-contraseña");
  const sexoInput = document.getElementById("sexo");
  const direccionInput = document.getElementById("direccion");
  const resultado = document.getElementById("resultado-registro");

  if (
    !primerNombreInput || !cedulaInput || !fechaNacimientoInput || !correoInput ||
    !telefonoInput || !contraseñaInput || !confirmarContraseñaInput ||
    !sexoInput || !direccionInput || !resultado
  ) {
    console.error("Faltan elementos de registro en el DOM");
    return;
  }

  const usuario = {
    primerNombre: primerNombreInput.value,
    segundoNombre: segundoNombreInput.value,
    cedula: cedulaInput.value,
    fechaNacimiento: fechaNacimientoInput.value,
    correo: correoInput.value,
    telefono: telefonoInput.value,
    contraseña: contraseñaInput.value,
    sexo: sexoInput.value,
    direccion: direccionInput.value,
  };

  if (usuario.contraseña !== confirmarContraseñaInput.value) {
    resultado.innerText = "⚠️ Las contraseñas no coinciden";
    resultado.style.color = "red";
    return;
  }

  try {
    // IMPORTANTE: Cambia esta URL por la de tu backend en Render
    const res = await fetch("https://tu-api.onrender.com/api/auth/register", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    const data = await res.json();

    if (res.ok) {
      resultado.innerText = "✅ Registro exitoso";
      resultado.style.color = "green";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      resultado.innerText = `⚠️ ${data.msg || "Error al registrar"}`;
      resultado.style.color = "red";
    }
  } catch (error) {
    console.error("Error en registro:", error);
    resultado.innerText = "❌ Error al conectar con el servidor";
    resultado.style.color = "red";
  }
}