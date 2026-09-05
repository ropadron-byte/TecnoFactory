// home.js
//
// Muestra los productos destacados en la página de inicio (index.html).
// Usa el catálogo local definido en productos.js: no hay que esperar
// ninguna respuesta de internet, así que los productos aparecen apenas
// carga la página.

document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.getElementById("productos-destacados");
  if (!contenedor) return; // por si este script se incluye en otra página

  const productos = obtenerProductos().slice(0, 8); // mostramos hasta 8 productos

  contenedor.innerHTML = "";

  productos.forEach(function (producto) {
    // Uso las mismas clases de Bootstrap que ya traía el home (col, card,
    // card-body) para no tener que tocar el HTML ni el CSS del index.
    const col = document.createElement("div");
    col.className = "col mb-2";
    col.innerHTML =
      '<div class="card h-100 text-center p-3">' +
        '<div class="media" style="height:140px; margin-bottom:.75rem;">' + mediaProductoHTML(producto) + "</div>" +
        '<div class="card-body d-flex flex-column">' +
          '<h6 class="card-title">' + producto.nombre + "</h6>" +
          '<p class="text-muted small mb-1">' + producto.categoria + "</p>" +
          '<p class="fw-bold mb-3">' + formatCLP(producto.precio) + "</p>" +
          '<a href="pages/tienda/detalle_productos.html?codigo=' + encodeURIComponent(producto.codigo) + '" class="btn btn-outline-primary mt-auto">Ver producto</a>' +
        "</div>" +
      "</div>";
    contenedor.appendChild(col);
  });
});
