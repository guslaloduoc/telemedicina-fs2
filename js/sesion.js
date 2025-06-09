// =====================================================================
// Funciones Auxiliares para interactuar con LocalStorage
// =====================================================================
const getSesion = () => JSON.parse(localStorage.getItem("sesion"));
const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];

/**
 * Función principal que se ejecuta al cargar el DOM.
 * Se encarga de construir el menú de navegación dinámicamente.
 */
function initSession() {
  const sesion = getSesion();
  const nav = document.querySelector(".navbar-nav");

  if (!nav) return; // Salir si no hay barra de navegación

  nav.innerHTML = ""; // Limpiar el menú antes de construirlo

  // --- Definición de los enlaces del menú ---

  // Enlaces base, siempre visibles
  const linksBase = [
    { href: "index.html", text: "Inicio" },
  ];

  // Menú desplegable para las especialidades
  const dropdownEspecialidades = {
    isDropdown: true,
    text: "Especialidades",
    items: [
      { href: "medicina-general.html", text: "Medicina General" },
      { href: "psicologia.html", text: "Psicología" },
      { href: "medicina-integrativa.html", text: "Medicina Integrativa" },
    ]
  };
  
  // Enlaces para usuarios logueados (con íconos y clases de botón)
  const linksUsuarioLogueado = [
    { href: "perfil.html", html: '<i class="bi bi-person-fill me-2"></i>Mi Perfil' },
    { href: "carrito.html", html: '<i class="bi bi-calendar2-heart me-2"></i>Mis Horas' },
    { href: "#", html: 'Cerrar sesión', id: "cerrar-sesion", isButton: true, buttonClass: "btn-outline-danger" }
  ];

  // Enlaces para el administrador
  const linksAdmin = [
    { href: "admin.html", html: '<i class="bi bi-shield-lock-fill me-2"></i>Administrar' },
    { href: "#", html: '<i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión', id: "cerrar-sesion", isButton: true, buttonClass: "btn-outline-danger" }
  ];
  
  // Enlaces para visitantes no logueados
  const linksNoLogueado = [
    { href: "registro.html", text: "Registro", isButton: true, buttonClass: "btn-outline-primary" },
    { href: "login.html", text: "Iniciar sesión", isButton: true, buttonClass: "btn-primary" }
  ];

  // --- Construcción del menú final ---

  let linksFinales = [...linksBase, dropdownEspecialidades];

  if (sesion?.logueado) {
    linksFinales = linksFinales.concat(sesion.tipo === "admin" ? linksAdmin : linksUsuarioLogueado);
  } else {
    linksFinales = linksFinales.concat(linksNoLogueado);
  }

  // --- Renderizado del menú en el DOM ---
  
  linksFinales.forEach(linkInfo => {
    // Si es un menú desplegable (dropdown)
    if (linkInfo.isDropdown) {
      const li = document.createElement("li");
      li.className = "nav-item dropdown";
      li.innerHTML = `
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          ${linkInfo.text}
        </a>
        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
          ${linkInfo.items.map(item => `<li><a class="dropdown-item" href="${item.href}">${item.text}</a></li>`).join("")}
        </ul>
      `;
      nav.appendChild(li);
      return; // Continuar con el siguiente item del bucle
    }

    // Si es un enlace o botón normal
    const li = document.createElement("li");
    li.className = "nav-item";
    
    // Para botones, añadimos márgenes para separar
    if (linkInfo.isButton) {
        li.classList.add("ms-lg-2", "mt-2", "mt-lg-0");
    }

    const a = document.createElement("a");
    a.href = linkInfo.href;
    
    if (linkInfo.isButton) {
      a.className = `btn ${linkInfo.buttonClass} btn-sm`;
    } else {
      a.className = "nav-link";
    }

    if (linkInfo.id) {
      a.id = linkInfo.id;
    }
    
    // Usamos .innerHTML para poder insertar los íconos
    a.innerHTML = linkInfo.html || linkInfo.text;

    li.appendChild(a);
    nav.appendChild(li);
  });
  
  // Delegación de eventos para el botón de cerrar sesión
  nav.addEventListener("click", (e) => {
    const target = e.target.closest("#cerrar-sesion");
    if (target) {
      e.preventDefault();
      localStorage.removeItem("sesion");
      window.location.href = "index.html";
    }
  });
}

// Punto de entrada del script
document.addEventListener("DOMContentLoaded", initSession);