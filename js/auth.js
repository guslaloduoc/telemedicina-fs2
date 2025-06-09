// =====================================================================
// Configuración y Constantes
// =====================================================================
const DEFAULT_ADMIN = {
  nombre: "Administrador",
  usuario: "admin",
  email: "dayanaolivares377@gmail.com",
  password: "Admin123",
  tipo: "admin"
};

// =====================================================================
// Funciones Auxiliares (Helpers) para LocalStorage
// =====================================================================
const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];
const guardarUsuarios = (usuarios) => localStorage.setItem("usuarios", JSON.stringify(usuarios));


// =====================================================================
// Lógica de Inicialización del Script
// =====================================================================

/**
 * Verifica si el usuario administrador por defecto ya existe.
 * Si no existe, lo crea y lo guarda en localStorage.
 */
function asegurarAdminPorDefecto() {
  const usuarios = getUsuarios();
  const existeAdmin = usuarios.some(user => user.email === DEFAULT_ADMIN.email);

  if (!existeAdmin) {
    usuarios.push(DEFAULT_ADMIN);
    guardarUsuarios(usuarios);
    console.log("🛠 Usuario admin creado por defecto.");
  }
}

/**
 * Inicializa el formulario de login si se encuentra en la página actual.
 */
function inicializarFormularioLogin() {
  const formLogin = document.getElementById("form-login");
  if (!formLogin) {
    return; // Si no hay formulario de login, no hacemos nada más.
  }

  /**
   * Procesa el intento de inicio de sesión de un usuario.
   * @param {string} email - El email ingresado por el usuario.
   * @param {string} password - La contraseña ingresada.
   */
  const login = (email, password) => {
    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
      // Si el usuario es válido, creamos la sesión
      const sesion = {
        logueado: true,
        usuario: usuario.usuario,
        tipo: usuario.tipo
      };
      localStorage.setItem("sesion", JSON.stringify(sesion));

      // Redirigimos al usuario a la página de destino o al index
      const destino = localStorage.getItem("redirigirDespues") || "index.html";
      localStorage.removeItem("redirigirDespues");
      window.location.href = destino;
    } else {
      // Si las credenciales son incorrectas, mostramos una alerta
      alert("Correo o contraseña incorrectos.");
    }
  };

  // Añadimos el listener al formulario
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email && password) {
      login(email, password);
    } else {
      alert("Completa todos los campos.");
    }
  });
}

/**
 * Función principal que se ejecuta al cargar el DOM.
 * Orquesta todas las tareas de inicialización del módulo de autenticación.
 */
function initAuth() {
  asegurarAdminPorDefecto();
  inicializarFormularioLogin();
}

// =====================================================================
// Punto de Entrada: Ejecutamos la inicialización cuando el DOM está listo
// =====================================================================
document.addEventListener("DOMContentLoaded", initAuth);