// Espera que el documento HTML esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
  // Recupera la sesión activa desde localStorage
  const sesion = JSON.parse(localStorage.getItem("sesion"));

  // Recupera todos los usuarios almacenados desde localStorage
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Validación: si no hay sesión activa o el tipo de usuario no es "admin", bloquea el acceso
  if (!sesion || sesion.tipo !== "admin") {
    alert("Acceso denegado. Solo para administradores."); // Muestra mensaje de error
    window.location.href = "index.html"; // Redirige a la página de inicio
    return; // Detiene la ejecución del resto del código
  }

  // Si el usuario es admin, se cargan los usuarios en la tabla
  cargarUsuarios();
});

// Función para cargar y mostrar todos los usuarios en la tabla del panel admin
function cargarUsuarios() {
  // Obtiene de nuevo los usuarios actualizados
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Selecciona el cuerpo de la tabla donde se mostrarán los usuarios
  const tabla = document.getElementById("tabla-usuarios");
  tabla.innerHTML = ""; // Limpia cualquier contenido previo en la tabla

  // Itera sobre cada usuario y crea una fila con sus datos
  usuarios.forEach((user, index) => {
    const fila = document.createElement("tr"); // Crea una nueva fila de tabla

    // Inserta los datos del usuario en celdas, incluyendo botones de acción
    fila.innerHTML = `
      <td>${index + 1}</td> <!-- Número de fila -->
      <td>${user.nombre || "-"}</td> <!-- Nombre del usuario -->
      <td>${user.usuario || "-"}</td> <!-- Nombre de usuario -->
      <td>${user.email}</td> <!-- Email del usuario -->
      <td>${user.fechaNacimiento || "-"}</td> <!-- Fecha de nacimiento -->
      <td>${user.tipo || "normal"}</td> <!-- Tipo de usuario: normal/admin -->
      <td>
        <!-- Botón para editar el usuario -->
        <button class="btn btn-warning btn-sm me-2" onclick="editarUsuario(${index})">Editar</button>
        <!-- Botón para eliminar el usuario -->
        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${index})">Eliminar</button>
      </td>
    `;

    tabla.appendChild(fila); // Agrega la fila a la tabla
  });
}

// Función para editar un usuario
function editarUsuario(index) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")); // Obtiene usuarios
  const usuario = usuarios[index]; // Selecciona el usuario a editar

  // Pide nuevos valores al admin mediante prompts
  const nuevoNombre = prompt("Nuevo nombre:", usuario.nombre);
  const nuevoUsuario = prompt("Nuevo usuario:", usuario.usuario);
  const nuevoCorreo = prompt("Nuevo correo:", usuario.email);

  // Si se completan los tres campos, se actualiza el usuario
  if (nuevoNombre && nuevoUsuario && nuevoCorreo) {
    usuarios[index].nombre = nuevoNombre;
    usuarios[index].usuario = nuevoUsuario;
    usuarios[index].email = nuevoCorreo;

    localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Guarda cambios
    alert("Usuario actualizado ✅"); // Confirmación
    location.reload(); // Recarga la página para mostrar cambios
  }
}

// Función para eliminar un usuario
function eliminarUsuario(index) {
  const sesion = JSON.parse(localStorage.getItem("sesion")); // Sesión activa
  const usuarios = JSON.parse(localStorage.getItem("usuarios")); // Lista de usuarios

  // Previene que el admin se elimine a sí mismo
  if (usuarios[index].email === sesion.email) {
    alert("No puedes eliminar tu propio usuario.");
    return;
  }

  // Confirma si realmente desea eliminar
  if (confirm("¿Estás seguro de eliminar este usuario?")) {
    usuarios.splice(index, 1); // Elimina al usuario del array
    localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Actualiza localStorage
    alert("Usuario eliminado ❌");
    location.reload(); // Recarga la vista
  }
}
