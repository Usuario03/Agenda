document.addEventListener('DOMContentLoaded', () => {
  // Configuración base
  const API_BASE_URL = 'https://tu-api.onrender.com';
  const token = localStorage.getItem('token');
  
  // Mapeo de elementos del DOM
  const elements = {
    forms: {
      login: document.querySelector('.form-login'),
      register: document.querySelector('.form-registro')
    },
    buttons: {
      agendar: document.getElementById('btn-agendar'),
      logout: document.getElementById('btn-cerrar-sesion'),
      login: document.getElementById('btn-login'),
      register: document.getElementById('btn-registro')
    },
    results: {
      login: document.getElementById('resultado-login'),
      register: document.getElementById('resultado-registro')
    }
  };

  // Configuración de event listeners
  const setupEventListeners = () => {
    // Navegación
    if (elements.buttons.agendar) {
      elements.buttons.agendar.addEventListener('click', () => {
        window.location.href = 'agendar.html';
      });
    }

    if (elements.buttons.logout) {
      elements.buttons.logout.addEventListener('click', () => {
        localStorage.removeItem('token');
        mostrarFormulario('menu-principal');
      });
    }

    // Formularios
    if (elements.forms.login) {
      elements.forms.login.addEventListener('submit', (e) => handleAuth(e, 'login'));
    }

    if (elements.forms.register) {
      elements.forms.register.addEventListener('submit', (e) => handleAuth(e, 'register'));
    }

    // Verificar token al cargar
    if (token) verifyToken(token);
  };

  // Función para verificar token
  const verifyToken = async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) localStorage.removeItem('token');
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  };

  // Manejador de autenticación unificado
  const handleAuth = async (event, type) => {
    event.preventDefault();
    const form = event.target;
    const resultElement = type === 'login' 
      ? elements.results.login 
      : elements.results.register;

    try {
      // Validación adicional para registro
      if (type === 'register') {
        const password = form.querySelector('#contraseña').value;
        const confirmPassword = form.querySelector('#confirmar-contraseña').value;
        
        if (password !== confirmPassword) {
          resultElement.textContent = '⚠️ Las contraseñas no coinciden';
          resultElement.style.color = 'red';
          return;
        }
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch(`${API_BASE_URL}/api/auth/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (response.ok) {
        resultElement.textContent = type === 'login' 
          ? '✅ Inicio de sesión exitoso' 
          : '✅ Registro exitoso';
        resultElement.style.color = 'green';

        if (type === 'login' && responseData.token) {
          localStorage.setItem('token', responseData.token);
        }

        setTimeout(() => {
          window.location.href = type === 'login' 
            ? 'agendar.html' 
            : 'login.html';
        }, 1500);
      } else {
        resultElement.textContent = `⚠️ ${responseData.msg || 'Error en la operación'}`;
        resultElement.style.color = 'red';
      }
    } catch (error) {
      console.error(`${type} error:`, error);
      resultElement.textContent = '❌ Error de conexión con el servidor';
      resultElement.style.color = 'red';
    }
  };

  // Inicialización
  setupEventListeners();
});

// Función para mostrar formularios
function mostrarFormulario(id) {
  document.querySelectorAll('main, section').forEach(sec => {
    sec.classList.add('oculto');
  });
  const elem = document.getElementById(id);
  if (elem) elem.classList.remove('oculto');
}