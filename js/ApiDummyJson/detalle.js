// detalle.js
//
// Punto de entrada de pages/tienda/detalle_productos.html. A diferencia
// de main.js y productos.js, acá no traigo una lista de productos: leo
// el "id" desde la URL (?id=123) y pido justo ese producto a la API.
import { fetchProductById } from './api.js';
import { registerProducts } from './store.js';
import { formatCLP, stockInfo } from './render.js';

// Referencias a los elementos del DOM que voy a necesitar. Las agrupo
// acá arriba para que el resto de las funciones queden más limpias.
const estadoCarga = document.getElementById("estado-carga");
const bloqueError = document.getElementById("producto-error");
const bloqueDetalle = document.getElementById("producto-detalle");

const tituloPagina = document.getElementById("producto-titulo");
const imagenProducto = document.getElementById("producto-imagen");
const categoriaProducto = document.getElementById("producto-categoria");
const nombreProducto = document.getElementById("producto-nombre");
const descripcionProducto = document.getElementById("producto-descripcion");
const precioProducto = document.getElementById("producto-precio");
const stockProducto = document.getElementById("producto-stock");
const listaEspecificaciones = document.getElementById("lista-especificaciones");
const inputCantidad = document.getElementById("input-cantidad");
const botonRestar = document.getElementById("btn-restar");
const botonSumar = document.getElementById("btn-sumar");
const botonAgregar = document.getElementById("btn-agregar-carrito");
const mensajeCarrito = document.getElementById("mensaje-carrito");

/**
 * Leo el parámetro "id" desde la URL actual (por ejemplo
 * detalle_productos.html?id=45). Uso URLSearchParams porque es más
 * seguro y claro que andar cortando el string a mano.
 */
function obtenerIdDeLaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("id");
}

/**
 * Arma cada fila de la lista de especificaciones (marca, categoría,
 * peso, garantía, etc.) reutilizando la clase .spec-row que ya existía
 * en estilos.css para este propósito.
 */
function agregarEspecificacion(etiqueta, valor) {
  if (!valor) return;
  const fila = document.createElement("div");
  fila.className = "spec-row";
  fila.innerHTML = `<span>${etiqueta}</span><span>${valor}</span>`;
  listaEspecificaciones.appendChild(fila);
}

/**
 * Pinta en pantalla toda la información del producto una vez que ya
 * llegó desde la API. Separo esta función de la de "cargar" para que
 * quede claro qué parte es responsable de pedir datos y cuál de
 * mostrarlos.
 */
function mostrarProducto(producto) {
  registerProducts(producto);

  const { clase: claseStock, texto: textoStock } = stockInfo(producto.stock);

  tituloPagina.textContent = producto.title;
  document.title = `${producto.title} — Tecno Factory`;

  imagenProducto.src = producto.thumbnail;
  imagenProducto.alt = producto.title;

  categoriaProducto.textContent = producto.category.toUpperCase();
  nombreProducto.textContent = producto.title;
  descripcionProducto.textContent = producto.description;

  precioProducto.textContent = formatCLP(producto.price);
  stockProducto.textContent = textoStock;
  stockProducto.classList.add(claseStock);

  agregarEspecificacion("Marca", producto.brand);
  agregarEspecificacion("Categoría", producto.category);
  agregarEspecificacion("Stock disponible", `${producto.stock} unidades`);
  agregarEspecificacion("Calificación", producto.rating ? `${producto.rating} / 5` : null);
  agregarEspecificacion("Garantía", producto.warrantyInformation);
  agregarEspecificacion("Envío", producto.shippingInformation);

  // No dejo agregar más unidades que las que hay en stock.
  inputCantidad.max = producto.stock > 0 ? producto.stock : 1;
  if (producto.stock <= 0) {
    botonAgregar.disabled = true;
    botonAgregar.textContent = "Sin stock disponible";
  }

  estadoCarga.style.display = "none";
  bloqueDetalle.style.display = "grid";
}

/**
 * Función principal: leo el id de la URL, pido el producto y decido si
 * muestro la ficha o el mensaje de error (id inválido, producto
 * inexistente o falla de red).
 */
async function cargarFichaProducto() {
  const id = obtenerIdDeLaUrl();

  if (!id) {
    estadoCarga.style.display = "none";
    bloqueError.style.display = "block";
    return;
  }

  const producto = await fetchProductById(id);

  if (!producto || producto.id === undefined) {
    estadoCarga.style.display = "none";
    bloqueError.style.display = "block";
    return;
  }

  mostrarProducto(producto);
}

// --- Selector de cantidad (+/-) ---
botonRestar.addEventListener("click", () => {
  const actual = Number(inputCantidad.value) || 1;
  inputCantidad.value = Math.max(1, actual - 1);
});

botonSumar.addEventListener("click", () => {
  const actual = Number(inputCantidad.value) || 1;
  const maximo = Number(inputCantidad.max) || 999;
  inputCantidad.value = Math.min(maximo, actual + 1);
});

// --- Botón "Agregar al carrito" ---
// Uso addToCart() de carrito.js (ya cargado como script clásico antes
// que este módulo) y muestro el mensaje de éxito o error que devuelve.
botonAgregar.addEventListener("click", () => {
  const id = Number(obtenerIdDeLaUrl());
  const cantidad = Number(inputCantidad.value) || 1;
  const resultado = window.addToCart(id, cantidad);

  mensajeCarrito.textContent = resultado.message;
  mensajeCarrito.style.color = resultado.ok ? "var(--ok)" : "var(--danger)";
  mensajeCarrito.style.display = "block";
});

document.addEventListener("DOMContentLoaded", cargarFichaProducto);
