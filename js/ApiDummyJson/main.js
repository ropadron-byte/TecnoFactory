// main.js
//
// Este es el punto de entrada que uso en index.html (la página de
// inicio). Su trabajo es traer productos desde DummyJSON y pintar la
// sección "Productos Más Vendidos" con datos reales en vez de las
// tarjetas fijas que había antes con imágenes de otra API de prueba.
import { getRandomProducts } from './randomize.js';
import { registerProducts, getProductById } from './store.js';
import { formatCLP, precioSinDescuentoUsd, stockInfo } from './render.js';

// Cuántos productos quiero mostrar como "destacados" en el inicio.
const CANTIDAD_DESTACADOS = 4;

/**
 * Construyo el HTML de una tarjeta de producto para el home.
 * Mantengo la misma estructura de Bootstrap que ya se usaba en el
 * index.html original (card, card-body, botón "Agregar al Carrito")
 * para no romper el diseño, solo que ahora los datos vienen de la API.
 */
function crearTarjetaProducto(producto) {
  const precioFormateado = formatCLP(producto.price);
  const tieneDescuento = producto.discountPercentage >= 5;
  const { texto: textoStock } = stockInfo(producto.stock);

  // Solo muestro la insignia de "Oferta" si el descuento es relevante,
  // así se ve parecido a como estaba diseñada la sección originalmente.
  const insignia = tieneDescuento
    ? '<span class="badge bg-danger position-absolute top-0 end-0 m-2">Oferta</span>'
    : '';

  return `
    <div class="col">
      <div class="card h-100 shadow-sm border-0 position-relative">
        ${insignia}
        <img src="${producto.thumbnail}" class="card-img-top p-3" alt="${producto.title}" style="max-height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fs-6">${producto.title}</h5>
          <p class="card-text text-primary fw-bold mb-1">${precioFormateado}</p>
          <p class="card-text small text-muted mb-2">${textoStock}</p>
          <button class="btn btn-outline-primary mt-auto w-100" data-add-to-cart="${producto.id}">
            <i class="bi bi-cart-plus me-1"></i> Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Enlazo el clic de cada botón "Agregar al Carrito" con la función
 * addToCart de carrito.js. Ese archivo se carga como script clásico
 * antes que este módulo, así que addToCart ya existe en window cuando
 * llegamos hasta acá.
 */
function activarBotonesAgregar(contenedor) {
  contenedor.querySelectorAll("[data-add-to-cart]").forEach(boton => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.addToCart);
      const resultado = window.addToCart(id, 1);

      // Uso el texto del propio botón para dar feedback rápido, sin
      // necesitar un sistema de notificaciones más elaborado.
      const textoOriginal = boton.innerHTML;
      boton.innerHTML = resultado.ok ? "✔ Añadido" : resultado.message;
      boton.disabled = true;
      setTimeout(() => {
        boton.innerHTML = textoOriginal;
        boton.disabled = false;
      }, 1400);
    });
  });
}

/**
 * Función principal: pido productos aleatorios, los registro en el
 * store (para que carrito.js los pueda encontrar por id) y los pinto
 * en el contenedor de la página. Si algo falla, muestro un mensaje en
 * vez de dejar la sección vacía sin explicación.
 */
async function cargarProductosDestacados() {
  const contenedor = document.getElementById("productos-destacados");
  if (!contenedor) return; // esta página no tiene la sección, no hago nada

  try {
    const productos = await getRandomProducts();
    const destacados = productos.slice(0, CANTIDAD_DESTACADOS);

    registerProducts(destacados);

    if (destacados.length === 0) {
      contenedor.innerHTML = '<p class="text-center text-muted">No pudimos cargar los productos en este momento.</p>';
      return;
    }

    contenedor.innerHTML = destacados.map(crearTarjetaProducto).join("");
    activarBotonesAgregar(contenedor);
  } catch (error) {
    console.error("Error al cargar los productos destacados:", error);
    contenedor.innerHTML = '<p class="text-center text-muted">No pudimos cargar los productos en este momento.</p>';
  }
}

document.addEventListener("DOMContentLoaded", cargarProductosDestacados);
