// =====================================================================
// Funciones Auxiliares (Helpers) para LocalStorage
// =====================================================================
const getSesion = () => JSON.parse(localStorage.getItem("sesion"));
const guardarSesion = (sesion) => localStorage.setItem("sesion", JSON.stringify(sesion));
const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];
const guardarUsuarios = (usuarios) => localStorage.setItem("usuarios", JSON.stringify(usuarios));


// =====================================================================
// Lógica Principal de la Página de Perfil
// =====================================================================

/**
 * Rellena los campos del formulario y los elementos visuales con los datos del usuario.
 * @param {object} usuario - El objeto del usuario logueado.
 * @param {object} elementos - Un objeto con las referencias a los elementos del DOM.
 */
function poblarFormulario(usuario, elementos) {
  // Rellenamos el formulario
  elementos.nombreInput.value = usuario.nombre || "";
  elementos.usuarioInput.value = usuario.usuario || "";
  elementos.emailInput.value = usuario.email || "";
  elementos.fechaNacimientoInput.value = usuario.fechaNacimiento || "";

  // Rellenamos los elementos visuales de la tarjeta de perfil
  if (elementos.displayNombre) {
    elementos.displayNombre.textContent = usuario.nombre || "Usuario";
  }
  if (elementos.displayEmail) {
    elementos.displayEmail.textContent = usuario.email || "";
  }
}

/**
 * Maneja el envío del formulario para actualizar los datos del perfil.
 * @param {Event} e - El evento de submit.
 * @param {object} usuarioLogueado - El objeto del usuario antes de la modificación.
 * @param {object} elementos - Un objeto con las referencias a los elementos del DOM.
 */
function handleProfileUpdate(e, usuarioLogueado, elementos) {
  e.preventDefault();

  // Validaciones (asumiendo que vienen de validaciones.js)
  const esValido = validarCampoVacio("nombre") &&
                   validarCampoVacio("usuario") &&
                   validarFechaNacimiento("fechaNacimiento");

  if (!esValido) {
    return;
  }

  // Obtenemos los nuevos valores desde los elementos ya referenciados
  const nombre = elementos.nombreInput.value.trim();
  const usuario = elementos.usuarioInput.value.trim();
  const fechaNacimiento = elementos.fechaNacimientoInput.value;

  const usuarios = getUsuarios();
  const index = usuarios.findIndex(u => u.email === usuarioLogueado.email);

  if (index !== -1) {
    // Actualizamos los datos en la lista de usuarios
    usuarios[index].nombre = nombre;
    usuarios[index].usuario = usuario;
    usuarios[index].fechaNacimiento = fechaNacimiento;
    guardarUsuarios(usuarios);

    // Actualizamos también la sesión activa si el nombre de usuario cambió
    const sesion = getSesion();
    sesion.usuario = usuario;
    guardarSesion(sesion);

    // Volvemos a poblar el formulario para actualizar los datos visuales (ej: nombre en la tarjeta)
    poblarFormulario(usuarios[index], elementos);

    alert("Datos actualizados correctamente ✅");
  } else {
    alert("Error: No se pudo encontrar el usuario para actualizar.");
  }
}

/**
 * Función principal que inicializa la página de perfil.
 */
function initPerfilPage() {
  const sesion = getSesion();

  // Guard Clause: Si no hay sesión o no es un usuario normal, redirige.
  if (!sesion || sesion.tipo !== "normal") {
    window.location.href = "index.html";
    return;
  }

  const usuarios = getUsuarios();
  const form = document.getElementById("form-perfil");
  
  // Guard Clause: Si no se encuentra el formulario, no continuamos.
  if (!form) return;

  // Obtenemos todos los elementos del DOM una sola vez
  const elementos = {
    form,
    nombreInput: document.getElementById("nombre"),
    usuarioInput: document.getElementById("usuario"),
    emailInput: document.getElementById("email"),
    fechaNacimientoInput: document.getElementById("fechaNacimiento"),
    displayNombre: document.getElementById("display-nombre"),
    displayEmail: document.getElementById("display-email")
  };

  // Buscamos al usuario logueado por su nombre de usuario guardado en la sesión
  const usuarioLogueado = usuarios.find(u => u.usuario === sesion.usuario);

  if (usuarioLogueado) {
    // Rellenamos el formulario con los datos actuales
    poblarFormulario(usuarioLogueado, elementos);
    
    // Añadimos el listener pasando los datos necesarios para evitar re-cálculos
    form.addEventListener("submit", (e) => handleProfileUpdate(e, usuarioLogueado, elementos));
  } else {
    // Caso improbable: la sesión existe pero el usuario fue eliminado
    alert("Error al cargar los datos del perfil. Serás redirigido.");
    localStorage.removeItem("sesion");
    window.location.href = "index.html";
  }
}

// =====================================================================
// Punto de Entrada: Ejecutamos cuando el DOM está listo
// =====================================================================
document.addEventListener("DOMContentLoaded", initPerfilPage);