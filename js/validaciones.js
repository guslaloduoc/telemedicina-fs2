/**
 * ---------------------------------------------------------------------
 * Función Auxiliar Genérica para Ejecutar y Visualizar una Validación
 * ---------------------------------------------------------------------
 * @param {string} idCampo - El ID del elemento del formulario a validar.
 * @param {function} funcionDeValidacion - Una función que recibe el valor del campo y devuelve true si es válido, false si no lo es.
 * @returns {boolean} - El resultado de la validación.
 */
function ejecutarValidacion(idCampo, funcionDeValidacion) {
  const campo = document.getElementById(idCampo);
  // Si el campo no existe en el DOM, no se puede validar.
  if (!campo) return false;

  const esValido = funcionDeValidacion(campo.value);
  
  campo.classList.toggle("is-valid", esValido);
  campo.classList.toggle("is-invalid", !esValido);
  
  return esValido;
}

// ✅ Valida que un campo no esté vacío
function validarCampoVacio(idCampo) {
  // La lógica específica es: "el valor sin espacios no debe estar vacío".
  const logica = (valor) => valor.trim() !== "";
  return ejecutarValidacion(idCampo, logica);
}

// ✅ Valida que un email tenga el formato correcto
function validarEmail(idCampo) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // La lógica específica es: "el valor debe cumplir con la expresión regular de email".
  const logica = (valor) => regexEmail.test(valor.trim());
  return ejecutarValidacion(idCampo, logica);
}

// ✅ Valida que el usuario tenga al menos 18 años (lógica simplificada y más robusta)
function validarFechaNacimiento(idCampo) {
  const logica = (valor) => {
    // Si no se ingresa fecha, no es válido.
    if (!valor) return false;

    const fechaLimite = new Date();
    // Restamos 18 años a la fecha de hoy para obtener la fecha límite de nacimiento.
    fechaLimite.setFullYear(fechaLimite.getFullYear() - 18);
    
    // El usuario es válido si su fecha de nacimiento es anterior o igual a la fecha límite.
    return new Date(valor) <= fechaLimite;
  };
  return ejecutarValidacion(idCampo, logica);
}

// ✅ Valida contraseña segura y coincidencia con su confirmación
function validarPassword(idPassword, idConfirmar) {
  const pass = document.getElementById(idPassword);
  const confirm = document.getElementById(idConfirmar);
  
  if (!pass || !confirm) return false;

  const regexSegura = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Validación de seguridad de la contraseña principal
  const esPassSeguro = regexSegura.test(pass.value);
  pass.classList.toggle("is-valid", esPassSeguro);
  pass.classList.toggle("is-invalid", !esPassSeguro);

  // Validación de coincidencia de contraseñas
  const sonPassIguales = pass.value === confirm.value && confirm.value !== "";
  confirm.classList.toggle("is-valid", sonPassIguales);
  confirm.classList.toggle("is-invalid", !sonPassIguales);

  return esPassSeguro && sonPassIguales;
}

// ✅ Función general que orquesta todas las validaciones de una forma más legible
function validarFormulario() {
  // Creamos un array con todas las funciones de validación que deben ejecutarse.
  // Esto hace que agregar o quitar validaciones sea muy sencillo.
  const todasLasValidaciones = [
    () => validarCampoVacio("nombre"),
    () => validarCampoVacio("usuario"),
    () => validarEmail("email"),
    () => validarFechaNacimiento("fechaNacimiento"),
    () => validarPassword("password", "confirmarPassword"),
  ];

  // El método .every() ejecuta cada función y devuelve true solo si TODAS devuelven true.
  // Es importante notar que .every() se detiene en cuanto una función devuelve false,
  // pero para asegurar que todas las clases de validación se apliquen,
  // es mejor usar reduce o un bucle. Usaremos reduce para mantenerlo funcional.
  
  // Usamos reduce para asegurar que todas las funciones se ejecuten y se apliquen
  // todos los estilos visuales, y al mismo tiempo acumular el resultado final.
  return todasLasValidaciones.reduce((esValidoGlobal, validacionActual) => {
      // Ejecutamos la validación actual Y mantenemos el estado de validez global.
      return validacionActual() && esValidoGlobal;
  }, true);
}