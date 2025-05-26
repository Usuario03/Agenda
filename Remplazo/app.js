document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-agendar").addEventListener("click", () => {
    window.location.href = "index2.html"; // Redirecciona al segundo HTML
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

// Funciones
function mostrarFormulario(id) {
  document.querySelectorAll("main, section").forEach(seccion => {
    seccion.classList.add("oculto");
  });
  document.getElementById(id).classList.remove("oculto");
}

function loginUsuario(event) {
  event.preventDefault();
  const correo = document.getElementById("login-correo").value;
  const contraseña = document.getElementById("login-contraseña").value;
  const resultado = document.getElementById("resultado-login");

  if (correo && contraseña) {
    resultado.innerText = `✅ Inicio de sesión exitoso`;
    resultado.style.color = "green";
    setTimeout(() => {
      mostrarFormulario("vista-principal");
    }, 1000);
  } else {
    resultado.innerText = "⚠️ Complete todos los campos";
    resultado.style.color = "red";
  }
}

function registrarUsuario(event) {
  event.preventDefault();
  const correo = document.getElementById("correo").value;
  const contraseña = document.getElementById("contraseña").value;
  const confirmarContraseña = document.getElementById("confirmar-contraseña").value;
  const resultado = document.getElementById("resultado-registro");

  if (contraseña !== confirmarContraseña) {
    resultado.innerText = "⚠️ Las contraseñas no coinciden";
    resultado.style.color = "red";
  } else {
    resultado.innerText = `✅ Registro exitoso`;
    resultado.style.color = "green";
  }
}
