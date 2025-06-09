// =====================================================================
// Funciones Auxiliares (Helpers) para LocalStorage
// =====================================================================
const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];
const guardarUsuarios = (usuarios) => localStorage.setItem("usuarios", JSON.stringify(usuarios));


// =====================================================================
// Lógica Principal de la Página de Recuperación
// =====================================================================

/**
 * Maneja el evento de envío del formulario de recuperación.
 * @param {Event} e - El evento de submit.
 */
function handlePasswordRecovery(e) {
  e.preventDefault(); // Prevenimos el envío tradicional del formulario

  // Asumimos que estas funciones vienen de 'validaciones.js' y ya están refactorizadas.
  // Si la validación visual falla, las funciones devuelven false y detenemos el proceso.
  const esFormularioValido = validarEmail("email") && validarPassword("nuevaPassword", "confirmarPassword");
  
  // Guard Clause #1: Validación de campos.
  if (!esFormularioValido) {
    return;
  }

  // Obtenemos los valores de los campos ya validados
  const email = document.getElementById("email").value.trim();
  const nuevaPassword = document.getElementById("nuevaPassword").value; // No necesita trim aquí

  const usuarios = getUsuarios();
  const index = usuarios.findIndex(u => u.email === email);

  // Guard Clause #2: Verificar si el usuario existe.
  if (index === -1) {
    alert("No se encontró un usuario registrado con ese correo electrónico.");
    return;
  }

  // --- "Camino Feliz": Si todo es correcto, actualizamos la contraseña ---

  // Actualizamos la contraseña del usuario encontrado
  usuarios[index].password = nuevaPassword;

  // Guardamos la lista de usuarios actualizada
  guardarUsuarios(usuarios);

  // Informamos al usuario y redirigimos a la página de login
  alert("Contraseña actualizada exitosamente ✅");
  window.location.href = "login.html";
}

/**
 * Función que inicializa los componentes de la página de recuperación.
 */
function initRecuperarPage() {
  const form = document.getElementById("form-recuperar");

  // Si el formulario existe en la página, le asignamos el evento.
  if (form) {
    form.addEventListener("submit", handlePasswordRecovery);
  }
}

// =====================================================================
// Punto de Entrada: Ejecutamos cuando el DOM está listo
// =====================================================================
document.addEventListener("DOMContentLoaded", initRecuperarPage);