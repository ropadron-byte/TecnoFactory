// admin-guard.js
//
// Controla quién puede entrar al panel de administración y qué puede
// ver cada tipo de usuario, según los roles del sistema:
//
//   - Administrador: acceso total al panel.
//   - Vendedor: solo puede ver la lista de productos y el detalle de
//     un producto (y, cuando exista, la lista/detalle de órdenes).
//     No debe ver nada relacionado a Usuarios, ni crear/editar productos.
//   - Cliente: no tiene acceso al panel de administración.
//
// Este script se debe cargar en el <head> de TODAS las páginas de
// pages/admin/, justo después de js/usuarios.js, para que corra antes
// de que la página termine de dibujarse.

(function () {
  const PAGINA_ACTUAL = location.pathname.split("/").pop();

  // Páginas del panel que solo puede usar un Administrador.
  const SOLO_ADMIN = [
    "usuario.html",
    "nuevo_usuario.html",
    "editar_usuario.html",
    "mostrar_usuario.html",
    "nuevo_producto.html",
    "editar_producto.html"
  ];

  const sesion = (typeof obtenerSesion === "function") ? obtenerSesion() : null;

  // Sin sesión iniciada, o sesión de un Cliente: no tiene nada que hacer
  // en el panel de administración, así que lo mandamos a iniciar sesión.
  if (!sesion || sesion.tipo === "Cliente") {
    window.location.replace("../tienda/iniciar_sesion.html");
    return;
  }

  if (sesion.tipo === "Vendedor") {
    // Si el vendedor intenta entrar directo por la URL a una página que
    // no le corresponde, lo mandamos de vuelta al listado de productos.
    if (SOLO_ADMIN.indexOf(PAGINA_ACTUAL) !== -1) {
      window.location.replace("producto.html");
      return;
    }

    // Inyectamos una regla CSS para ocultar todo lo marcado como
    // "data-admin-only" (links y botones de crear/editar/usuarios).
    // Se hace acá, antes de que el resto de la página se pinte, para
    // evitar que el vendedor vea un "parpadeo" de opciones que no
    // debería tener disponibles.
    const estilo = document.createElement("style");
    estilo.textContent = ".role-vendedor [data-admin-only] { display: none !important; }";
    document.head.appendChild(estilo);
    document.documentElement.classList.add("role-vendedor");
  }

  // Al terminar de cargar la página, mostramos quién inició sesión y
  // agregamos la opción de cerrar sesión en la barra lateral.
  document.addEventListener("DOMContentLoaded", function () {
    const bottom = document.querySelector(".admin-nav-bottom");
    if (!bottom) return;

    bottom.innerHTML =
      '<div style="padding:6px 12px 10px;font-size:.8rem;line-height:1.35;opacity:.85;">' +
        "Conectado como<br><strong>" + sesion.nombre + " " + (sesion.apellidos || "") + "</strong>" +
        "<br>" + sesion.tipo +
      "</div>" +
      '<a href="#" id="btn-cerrar-sesion"><span class="icon">🚪</span> Cerrar sesión</a>';

    const btnSalir = document.getElementById("btn-cerrar-sesion");
    if (btnSalir) {
      btnSalir.addEventListener("click", function (e) {
        e.preventDefault();
        cerrarSesion();
        window.location.href = "../tienda/iniciar_sesion.html";
      });
    }
  });
})();
