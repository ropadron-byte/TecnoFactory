// productos.js
//
// Punto de entrada de pages/tienda/productos.html (el catálogo
// completo). Su trabajo es traer TODOS los productos agrupados por
// categoría, pintarlos en la grilla y responder cuando el usuario hace
// clic en alguno de los botones de filtro.
import { getGroupedProducts } from './categoryManager.js';
import { registerProducts } from './store.js';
import { formatCLP, stockInfo, nombreCategoria } from './render.js';

// Referencias a los elementos del DOM que voy a mostrar/ocultar u
// llenar. Las busco una sola vez al principio para no repetir
// document.getElementById en cada función.
const contenedorFiltros = document.getElementById("filtros-categoria");
const estadoCarga = document.getElementById("estado-carga");
const sinResultados = document.getElementById("sin-resultados");
const gridProductos = document.getElementById("grid-productos");

// Acá guardo el catálogo ya agrupado por categoría, una vez que llega
// desde la API, para no tener que volver a pedirlo cada vez que el
// usuario cambia de filtro.
let catalogoAgrupado = {};

/**
 * Arma el HTML de una tarjeta de producto para el catálogo, usando las
 * clases que ya existían en estilos.css (.card, .media, .price,
 * .stock-tag) para que calce con el resto del diseño de la tienda.
 */
function crearTarjetaProducto(producto) {
  const { clase: claseStock, texto: textoStock } = stockInfo(producto.stock);
  const tieneDescuento = producto.discountPercentage >= 5;

  return `
    <article class="card">
      <div class="media media--card">
        <img src="${producto.thumbnail}" alt="${producto.title}" loading="lazy">
        ${tieneDescuento ? `<span class="media-tag">-${Math.round(producto.discountPercentage)}%</span>` : ""}
      </div>
      <div class="card-body">
        <span class="card-meta">${nombreCategoria(producto.category).toUpperCase()}</span>
        <h3>${producto.title}</h3>
        <p class="price">${formatCLP(producto.price)}</p>
        <span class="stock-tag ${claseStock}">${textoStock}</span>
        <div style="display:flex; gap:8px; margin-top:auto; flex-wrap:wrap;">
          <a class="btn ghost small" href="detalle_productos.html?id=${producto.id}">Ver ficha</a>
          <button class="btn small" data-add-to-cart="${producto.id}">Agregar al carrito</button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Conecto cada botón "Agregar al carrito" de la grilla actual con
 * addToCart() de carrito.js (cargado como script clásico antes que
 * este módulo, así que ya está disponible en window).
 */
function activarBotonesAgregar() {
  gridProductos.querySelectorAll("[data-add-to-cart]").forEach(boton => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.addToCart);
      const resultado = window.addToCart(id, 1);

      const textoOriginal = boton.textContent;
      boton.textContent = resultado.ok ? "✔ Añadido" : resultado.message;
      boton.disabled = true;
      setTimeout(() => {
        boton.textContent = textoOriginal;
        boton.disabled = false;
      }, 1400);
    });
  });
}

/**
 * Pinta en pantalla una lista de productos ya filtrada. Si viene vacía,
 * muestro el mensaje de "sin resultados" en vez de una grilla en
 * blanco, para que quede claro que no es un error sino que esa
 * categoría no tiene productos.
 */
function renderizarProductos(productos) {
  if (!productos || productos.length === 0) {
    gridProductos.style.display = "none";
    sinResultados.style.display = "block";
    return;
  }

  registerProducts(productos);
  gridProductos.innerHTML = productos.map(crearTarjetaProducto).join("");
  gridProductos.style.display = "grid";
  sinResultados.style.display = "none";
  activarBotonesAgregar();
}

/**
 * Cambio el filtro activo: actualizo qué botón se ve "presionado" y
 * decido qué productos mostrar según la categoría elegida.
 */
function aplicarFiltro(categoria) {
  contenedorFiltros.querySelectorAll(".filter-btn").forEach(boton => {
    boton.classList.toggle("active", boton.dataset.categoria === categoria);
  });

  if (categoria === "todos") {
    // Uno todas las categorías del objeto agrupado en un solo array.
    const todos = Object.values(catalogoAgrupado).flat();
    renderizarProductos(todos);
  } else {
    renderizarProductos(catalogoAgrupado[categoria] || []);
  }
}

/**
 * Función principal: pido el catálogo agrupado, lo guardo en memoria,
 * muestro "Todos" por defecto y dejo los botones de filtro listos para
 * reaccionar a los clics del usuario.
 */
async function iniciarCatalogo() {
  try {
    catalogoAgrupado = await getGroupedProducts();
    estadoCarga.style.display = "none";
    aplicarFiltro("todos");
  } catch (error) {
    console.error("Error al iniciar el catálogo:", error);
    estadoCarga.style.display = "none";
    sinResultados.textContent = "No pudimos cargar el catálogo en este momento. Intenta de nuevo más tarde.";
    sinResultados.style.display = "block";
  }
}

// Cada botón de filtro solo necesita avisar con su data-categoria; la
// lógica de qué mostrar vive en aplicarFiltro().
contenedorFiltros.querySelectorAll(".filter-btn").forEach(boton => {
  boton.addEventListener("click", () => aplicarFiltro(boton.dataset.categoria));
});

document.addEventListener("DOMContentLoaded", iniciarCatalogo);
