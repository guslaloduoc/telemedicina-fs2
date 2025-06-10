// Envolvemos todo en una función autoejecutable (IIFE) para crear un scope privado
// y evitar conflictos con otros scripts.
(() => {
  // --- Funciones auxiliares internas de este script ---
  const getSesion = () => JSON.parse(localStorage.getItem("sesion"));
  const getCarrito = () => JSON.parse(localStorage.getItem("carrito")) || [];
  const guardarCarrito = (carrito) => localStorage.setItem("carrito", JSON.stringify(carrito));

  /**
   * Agrega un item al carrito.
   * @param {string} juego - El nombre del item/servicio a agregar.
   */
  const agregarAlCarrito = (juego) => {
    const sesion = getSesion();
    if (!sesion || sesion.tipo !== "normal") {
      alert("Debes iniciar sesión para agendar una hora.");
      window.location.href = "login.html";
      return;
    }

    const carrito = getCarrito();
    const yaExiste = carrito.some(item => item.usuario === sesion.usuario && item.juego === juego);
    if (yaExiste) {
      alert("Esta hora o servicio ya está en tu lista.");
      return;
    }

    carrito.push({ juego, usuario: sesion.usuario });
    guardarCarrito(carrito);
    alert(`"${juego}" fue agregado a tus horas agendadas 🛒`);
  };

  /**
   * Renderiza la lista de items en la página del carrito.
   */
  const renderizarCarrito = () => {
    const contenedor = document.getElementById("contenedor-carrito");
    const btnComprar = document.getElementById("btn-comprar");
    const sesion = getSesion();
    
    // Si no estamos en la página del carrito, no hacemos nada.
    if (!contenedor) return;

    if (!sesion || sesion.tipo !== "normal") {
      window.location.href = "index.html";
      return;
    }

    const carrito = getCarrito();
    contenedor.innerHTML = ""; // Limpiamos la vista

    // Guardamos los items del usuario y su índice original del carrito completo.
    const itemsUsuario = [];
    carrito.forEach((item, index) => {
      if (item.usuario === sesion.usuario) {
        itemsUsuario.push({ ...item, indexOriginal: index });
      }
    });

    if (itemsUsuario.length === 0) {
      contenedor.innerHTML = '<p class="text-center text-muted">No tienes horas en tu lista.</p>';
      btnComprar.classList.add("d-none");
    } else {
      const lista = document.createElement("ul");
      lista.className = "list-group";

      itemsUsuario.forEach(item => {
        const itemLi = document.createElement("li");
        itemLi.className = "list-group-item d-flex justify-content-between align-items-center";
        itemLi.textContent = item.juego;

        const botonEliminar = document.createElement("button");
        botonEliminar.className = "btn btn-sm btn-danger btn-eliminar";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.dataset.indice = item.indexOriginal; // Guardamos el índice real

        itemLi.appendChild(botonEliminar);
        lista.appendChild(itemLi);
      });

      contenedor.appendChild(lista);
      btnComprar.classList.remove("d-none");
    }
  };

  /**
   * Maneja la eliminación de un item del carrito.
   * @param {number} indice - El índice REAL del item en el array del carrito.
   */
  const eliminarDelCarrito = (indice) => {
    const carrito = getCarrito();
    carrito.splice(indice, 1); // Eliminamos usando el índice real
    guardarCarrito(carrito);
    renderizarCarrito(); // Actualizamos la vista sin recargar
  };
  
  /**
   * Maneja la confirmación de las horas.
   */
  const finalizarCompra = () => {
    const sesion = getSesion();
    const carrito = getCarrito();
    const nuevoCarrito = carrito.filter(item => item.usuario !== sesion.usuario);
    guardarCarrito(nuevoCarrito);
    alert("¡Horas confirmadas con éxito! 🎉");
    renderizarCarrito(); // Actualizamos la vista
  };

  // --- Punto de Entrada del Script ---
  document.addEventListener("DOMContentLoaded", () => {
    // Renderizamos el carrito si estamos en la página correcta.
    renderizarCarrito();

    // Añadimos UN SOLO listener para todos los clics.
    document.addEventListener("click", (e) => {
      const target = e.target;

      // Si se hace clic en "Agregar al Carrito"
      if (target.closest(".agregar-carrito")) {
        const juego = target.closest(".agregar-carrito").dataset.juego;
        agregarAlCarrito(juego);
      }

      // Si se hace clic en "Eliminar"
      if (target.classList.contains("btn-eliminar")) {
        const indice = parseInt(target.dataset.indice, 10);
        eliminarDelCarrito(indice);
      }

      // Si se hace clic en "Confirmar Horas"
      if (target.id === "btn-comprar") {
        finalizarCompra();
      }
    });
  });

})(); // La función se ejecuta inmediatamente