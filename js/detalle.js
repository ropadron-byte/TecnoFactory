// detalle.js
//
// Arma la ficha de un producto en pages/tienda/detalle_productos.html.
// El producto a mostrar se identifica por su código, que viene en la
// URL como ?codigo=TF-NB-001.

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");
  const producto = codigo ? obtenerProductoPorCodigo(codigo) : null;

  const estadoCarga = document.getElementById("estado-carga");
  const errorEl = document.getElementById("producto-error");
  const detalleEl = document.getElementById("producto-detalle");

  if (estadoCarga) estadoCarga.style.display = "none";

  if (!producto) {
    if (errorEl) errorEl.style.display = "block";
    return;
  }

  detalleEl.style.display = "grid";

  document.title = producto.nombre + " — Tecno Factory";
  document.getElementById("producto-titulo").textContent = producto.nombre;
  document.getElementById("producto-categoria").textContent = producto.categoria;
  document.getElementById("producto-nombre").textContent = producto.nombre;
  document.getElementById("producto-descripcion").textContent = producto.descripcion;
  document.getElementById("producto-precio").textContent = formatCLP(producto.precio);

  // Galería de imágenes del producto: la imagen principal grande arriba
  // y, si tiene más de una, una fila de miniaturas para cambiarla.
  const imagenPrincipal = document.getElementById("producto-imagen");
  const miniaturasWrap = document.getElementById("producto-miniaturas");
  const imagenes = imagenesProducto(producto);

  function mostrarImagenPrincipal(url) {
    imagenPrincipal.src = url;
    imagenPrincipal.alt = producto.nombre;
  }

  if (imagenes.length === 0) {
    // Sin ninguna imagen cargada: dejamos el ícono de categoría como
    // antes, para no mostrar un espacio vacío o un ícono de imagen rota.
    imagenPrincipal.remove();
    const iconoDiv = document.createElement("div");
    iconoDiv.style.fontSize = "6rem";
    iconoDiv.style.display = "flex";
    iconoDiv.style.alignItems = "center";
    iconoDiv.style.justifyContent = "center";
    iconoDiv.style.height = "100%";
    iconoDiv.textContent = iconoCategoria(producto.categoria);
    document.querySelector(".media--square").appendChild(iconoDiv);
  } else {
    mostrarImagenPrincipal(imagenes[0]);
    imagenPrincipal.onerror = function () {
      handleImgError(imagenPrincipal, iconoCategoria(producto.categoria));
    };

    if (imagenes.length > 1 && miniaturasWrap) {
      imagenes.forEach(function (url, i) {
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "product-thumb" + (i === 0 ? " active" : "");
        thumb.innerHTML = '<img src="' + escapeAttr(url) + '" alt="Miniatura ' + (i + 1) + " de " + escapeAttr(producto.nombre) + '">';
        thumb.addEventListener("click", function () {
          mostrarImagenPrincipal(url);
          miniaturasWrap.querySelectorAll(".product-thumb").forEach(function (t) { t.classList.remove("active"); });
          thumb.classList.add("active");
        });
        miniaturasWrap.appendChild(thumb);
      });
    }
  }

  const stockEl = document.getElementById("producto-stock");
  const qtyInput = document.getElementById("input-cantidad");
  const btnAgregar = document.getElementById("btn-agregar-carrito");

  if (producto.stock <= 0) {
    stockEl.textContent = "Sin stock";
    btnAgregar.disabled = true;
    qtyInput.disabled = true;
  } else if (producto.stock <= producto.stockCritico) {
    stockEl.textContent = "¡Quedan solo " + producto.stock + " unidades!";
  } else {
    stockEl.textContent = producto.stock + " unidades disponibles";
  }
  qtyInput.max = producto.stock || 1;

  // Especificaciones simples a partir de los datos del producto.
  const specsWrap = document.getElementById("lista-especificaciones");
  const specs = [
    { label: "Código", value: producto.codigo },
    { label: "Categoría", value: producto.categoria },
    { label: "Stock disponible", value: producto.stock + " unidades" }
  ];
  specs.forEach(function (spec) {
    const row = document.createElement("div");
    row.className = "spec-row";
    row.innerHTML = "<span>" + spec.label + "</span><span>" + spec.value + "</span>";
    specsWrap.appendChild(row);
  });

  // Selector de cantidad.
  document.getElementById("btn-restar").addEventListener("click", function () {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value || "1", 10) - 1);
  });
  document.getElementById("btn-sumar").addEventListener("click", function () {
    const max = producto.stock || 1;
    qtyInput.value = Math.min(max, parseInt(qtyInput.value || "1", 10) + 1);
  });

  // Botón "Agregar al carrito".
  const mensajeCarrito = document.getElementById("mensaje-carrito");
  btnAgregar.addEventListener("click", function () {
    const cantidad = parseInt(qtyInput.value || "1", 10);
    const resultado = addToCart(producto.codigo, cantidad);
    mensajeCarrito.textContent = resultado.message;
    mensajeCarrito.style.display = "block";
    mensajeCarrito.style.color = resultado.ok ? "var(--ok)" : "var(--danger)";
  });
});
