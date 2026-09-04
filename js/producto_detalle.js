document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "p001"; // producto por defecto para pruebas
    const producto = getProductById(id);
  
    const contenido = document.getElementById("producto-contenido");
    const noEncontrado = document.getElementById("producto-no-encontrado");
  
    if (!producto) {
      document.getElementById("producto-nombre").textContent = "Producto no encontrado";
      noEncontrado.style.display = "block";
      return;
    }
  
    // --- Encabezado y datos generales ---
    document.title = producto.name + " — Tecno Factory";
    document.getElementById("producto-nombre").textContent = producto.name;
    document.getElementById("producto-nombre-2").textContent = producto.name;
    document.getElementById("producto-codigo").textContent =
      producto.code + " · " + producto.category;
    document.getElementById("producto-imagen").setAttribute("data-tag", producto.category);
    document.getElementById("producto-desc").textContent = producto.description;
  
    // --- Precio ---
    document.getElementById("producto-precio").textContent = formatCLP(producto.price);
    const precioAnterior = document.getElementById("producto-precio-anterior");
    if (producto.oldPrice) {
      precioAnterior.textContent = formatCLP(producto.oldPrice);
    } else {
      precioAnterior.style.display = "none";
    }
  
    // --- Stock ---
    const stockTag = document.getElementById("producto-stock");
    const qtyInput = document.getElementById("qty-input");
    const btnAgregar = document.getElementById("btn-agregar-carrito");
  
    if (producto.stock <= 0) {
      stockTag.textContent = "Sin stock";
      stockTag.classList.add("low");
      btnAgregar.disabled = true;
      qtyInput.disabled = true;
    } else if (producto.stock <= producto.stockCritico) {
      stockTag.textContent = "Quedan solo " + producto.stock + " unidades";
      stockTag.classList.add("low");
    } else {
      stockTag.textContent = producto.stock + " disponibles";
      stockTag.classList.add("ok");
    }
    qtyInput.max = producto.stock;
  
    // --- Especificaciones ---
    const specsWrap = document.getElementById("producto-specs");
    producto.specs.forEach(function (spec) {
      const row = document.createElement("div");
      row.className = "spec-row";
      row.innerHTML =
        "<span>" + spec.label + "</span><span>" + spec.value + "</span>";
      specsWrap.appendChild(row);
    });
  
    contenido.style.display = "block";
  
    // --- Selector de cantidad ---
    document.getElementById("qty-menos").addEventListener("click", function () {
      const valor = Math.max(1, parseInt(qtyInput.value || "1", 10) - 1);
      qtyInput.value = valor;
    });
    document.getElementById("qty-mas").addEventListener("click", function () {
      const max = producto.stock || 1;
      const valor = Math.min(max, parseInt(qtyInput.value || "1", 10) + 1);
      qtyInput.value = valor;
    });
    qtyInput.addEventListener("change", function () {
      let valor = parseInt(qtyInput.value || "1", 10);
      if (isNaN(valor) || valor < 1) valor = 1;
      if (valor > producto.stock) valor = producto.stock;
      qtyInput.value = valor;
    });
  
    // --- Añadir al carrito ---
    const carritoStatus = document.getElementById("carrito-status");
    btnAgregar.addEventListener("click", function () {
      const cantidad = parseInt(qtyInput.value || "1", 10);
      const resultado = addToCart(producto.id, cantidad);
  
      carritoStatus.classList.remove("show", "success", "error");
      carritoStatus.textContent = resultado.message;
      carritoStatus.classList.add("show", resultado.ok ? "success" : "error");
    });
  });
  