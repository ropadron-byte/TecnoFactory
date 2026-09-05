// catalogo.js
//
// Pinta la grilla de productos en pages/tienda/productos.html y maneja
// los botones de filtro por categoría. Todo se arma en JavaScript a
// partir del arreglo de productos.js: no depende de ninguna API externa.

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid-productos");
  const sinResultados = document.getElementById("sin-resultados");
  const estadoCarga = document.getElementById("estado-carga");
  const botonesFiltro = document.querySelectorAll(".filter-btn");

  if (!grid) return;

  // Como los productos son locales, no hay que "esperar" nada: oculto
  // el aviso de carga y muestro la grilla de inmediato.
  if (estadoCarga) estadoCarga.style.display = "none";
  grid.style.display = "grid";

  function pintarProductos(categoria) {
    const productos = obtenerProductos().filter(function (p) {
      return categoria === "todos" || p.categoria === categoria;
    });

    grid.innerHTML = "";

    if (productos.length === 0) {
      sinResultados.style.display = "block";
      return;
    }
    sinResultados.style.display = "none";

    productos.forEach(function (producto) {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML =
        '<a href="detalle_productos.html?codigo=' + encodeURIComponent(producto.codigo) + '">' +
          '<div class="media media--card" style="display:flex; align-items:center; justify-content:center; font-size:3.5rem;">' +
            iconoCategoria(producto.categoria) +
          "</div>" +
        "</a>" +
        '<div class="card-body">' +
          '<span class="card-meta">' + producto.categoria + "</span>" +
          '<h3><a href="detalle_productos.html?codigo=' + encodeURIComponent(producto.codigo) + '">' + producto.nombre + "</a></h3>" +
          '<p class="price">' + formatCLP(producto.precio) + "</p>" +
          (producto.stock > 0
            ? '<button type="button" class="btn accent small" data-add-codigo="' + producto.codigo + '">Añadir al carrito</button>'
            : '<span class="stock-tag">Sin stock</span>') +
        "</div>";
      grid.appendChild(card);
    });

    // Cada botón "Añadir al carrito" agrega 1 unidad del producto.
    grid.querySelectorAll("[data-add-codigo]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const resultado = addToCart(btn.getAttribute("data-add-codigo"), 1);
        btn.textContent = resultado.ok ? "¡Añadido!" : resultado.message;
        setTimeout(function () { btn.textContent = "Añadir al carrito"; }, 1500);
      });
    });
  }

  // Botones de filtro por categoría.
  botonesFiltro.forEach(function (btn) {
    btn.addEventListener("click", function () {
      botonesFiltro.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      pintarProductos(btn.getAttribute("data-categoria"));
    });
  });

  pintarProductos("todos");
});
