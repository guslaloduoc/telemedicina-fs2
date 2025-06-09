// =====================================================================
// Funciones Auxiliares para interactuar con LocalStorage
// =====================================================================
const getSesion = () => JSON.parse(localStorage.getItem("sesion"));
const getCarrito = () => JSON.parse(localStorage.getItem("carrito")) || [];
const guardarCarrito = (carrito) => localStorage.setItem("carrito", JSON.stringify(carrito));


// =====================================================================
// Lógica para Agregar una Hora/Item al Carrito
// =====================================================================
function agregarItemAlCarrito(e) {
  // Usamos .closest() para encontrar el botón si se hizo clic en un ícono dentro de él
  const boton = e.target.closest(".agregar-carrito");

  // Si el clic no fue en un botón de agregar, no hacemos nada
  if (!boton) return;
  
  const juego = boton.dataset.juego; // Obtiene el nombre del item
  const sesion = getSesion();

  // Guard Clause 1: Validar si hay una sesión de usuario "normal"
  if (!sesion || sesion.tipo !== "normal") {
    alert("Debes iniciar sesión para agendar una hora.");
    window.location.href = "login.html";
    return;
  }

  const carrito = getCarrito();
  
  // Guard Clause 2: Verificar si el item ya existe en el carrito del usuario
  const yaExiste = carrito.some(item => item.usuario === sesion.usuario && item.juego === juego);
  if (yaExiste) {
    alert("Esta hora o servicio ya está en tu lista.");
    return;
  }

  // Si todo es válido, agregamos el item
  carrito.push({ juego, usuario: sesion.usuario });
  guardarCarrito(carrito);
  alert(`"${juego}" fue agregado a tus horas agendadas 🛒`);
}


// =====================================================================
// Lógica para la Página de "Mis Horas" (carrito.html)
// =====================================================================
function renderizarPaginaCarrito() {
  const contenedor = document.getElementById("contenedor-carrito");
  const btnComprar = document.getElementById("btn-comprar");
  
  // Si los elementos necesarios no están en la página, no continuamos.
  if (!contenedor || !btnComprar) return;

  const sesion = getSesion();
  
  // Guard Clause: Si no hay sesión válida, redirigir.
  if (!sesion || sesion.tipo !== "normal") {
    window.location.href = "index.html";
    return;
  }

  const carrito = getCarrito();
  const juegosUsuario = carrito.filter(item => item.usuario === sesion.usuario);

  // Limpiamos el contenedor antes de renderizar
  contenedor.innerHTML = "";

  if (juegosUsuario.length === 0) {
    contenedor.innerHTML = '<p class="text-center text-muted">No tienes horas en tu lista.</p>';
    btnComprar.classList.add("d-none"); // Ocultamos el botón de compra
  } else {
    const lista = document.createElement("ul");
    lista.className = "list-group";
    
    // Guardamos el índice ORIGINAL del carrito en el botón de eliminar.
    // Esto simplifica enormemente la lógica de eliminación.
    carrito.forEach((item, indiceOriginal) => {
      // Solo mostramos los items del usuario actual
      if (item.usuario !== sesion.usuario) return;

      const itemLi = document.createElement("li");
      itemLi.className = "list-group-item d-flex justify-content-between align-items-center";
      itemLi.textContent = item.juego;

      const botonEliminar = document.createElement("button");
      botonEliminar.className = "btn btn-sm btn-danger eliminar-item";
      botonEliminar.textContent = "Eliminar";
      // Guardamos el índice REAL del carrito en el botón
      botonEliminar.dataset.indice = indiceOriginal; 

      itemLi.appendChild(botonEliminar);
      lista.appendChild(itemLi);
    });

    contenedor.appendChild(lista);
    btnComprar.classList.remove("d-none"); // Mostramos el botón de compra
  }
}

function manejarAccionesCarrito(e) {
  // Manejar eliminación de un item
  if (e.target.classList.contains("eliminar-item")) {
    const indice = parseInt(e.target.dataset.indice, 10);
    let carrito = getCarrito();
    
    // Eliminación directa y segura gracias al índice guardado
    carrito.splice(indice, 1);
    
    guardarCarrito(carrito);
    renderizarPaginaCarrito(); // Re-renderizamos la vista sin recargar la página
  }

  // Manejar finalización de la compra
  if (e.target.id === "btn-comprar") {
    const sesion = getSesion();
    let carrito = getCarrito();

    // Filtramos el carrito para mantener solo los items de OTROS usuarios
    const nuevoCarrito = carrito.filter(item => item.usuario !== sesion.usuario);
    
    guardarCarrito(nuevoCarrito);
    alert("¡Horas confirmadas con éxito! 🎉");
    renderizarPaginaCarrito(); // Re-renderizamos para mostrar el carrito vacío
  }
}


// =====================================================================
// Inicialización del Script
// =====================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Delegación de eventos para los botones de "Agregar" en todo el sitio.
  document.addEventListener("click", agregarItemAlCarrito);

  // 2. Si estamos en la página del carrito, la renderizamos y escuchamos acciones.
  if (document.getElementById("contenedor-carrito")) {
    renderizarPaginaCarrito();
    // Delegación de eventos para los botones "Eliminar" y "Confirmar"
    document.addEventListener("click", manejarAccionesCarrito);
  }
});