// Esperamos a que todo el DOM esté cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
  // Obtenemos el formulario de inscripción por su ID
  const formulario = document.getElementById("formulario-inscripcion");

  // Si el formulario no existe en la página, no hacemos nada.
  if (!formulario) {
    return;
  }

  // Escuchamos el evento submit del formulario
  formulario.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenimos el envío tradicional del formulario

    // --- Guard Clause #1: Validación del formulario ---
    // Si la validación externa falla, detenemos la ejecución aquí.
    if (!validarFormulario()) {
      return;
    }

    // Obtenemos los valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const password = document.getElementById("password").value;

    // Recuperamos los usuarios o inicializamos un array vacío
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // --- Guard Clause #2: Verificación de usuario existente ---
    const existe = usuarios.some(u => u.email === email);
    if (existe) {
      alert("Ya existe una cuenta con ese correo.");
      return; // Detenemos la ejecución si el correo ya está en uso
    }

    //Si todas las validaciones pasan, procedemos a registrar ---

    // Creamos un objeto con los datos del nuevo usuario
    const nuevoUsuario = {
      nombre,
      usuario,
      email,
      fechaNacimiento,
      password,
      tipo: "normal" // Todos los usuarios registrados desde aquí son tipo normal
    };

    // Agregamos el nuevo usuario al array
    usuarios.push(nuevoUsuario);

    // Guardamos el array actualizado en el localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Avisamos al usuario y lo redirigimos al login
    alert("¡Usuario registrado con éxito!");
    formulario.reset(); // Limpiamos el formulario
    window.location.href = "login.html"; // Redirigimos al login
  });
});