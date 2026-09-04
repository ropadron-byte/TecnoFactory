// render.js
//
// Acá dejo funciones chicas de formateo que reutilizo en más de una
// página (inicio, catálogo y ficha de producto). Las separo del resto
// para no repetir el mismo cálculo de precio o de stock en cada archivo.

/**
 * DummyJSON entrega los precios en dólares y sin formato. Como la tienda
 * es para Chile, los "traduzco" a un precio en pesos chilenos (uso un
 * tipo de cambio fijo solo para que se vea realista) y los formateo con
 * el separador de miles que usamos acá ($ 89.990, por ejemplo).
 */
export function formatCLP(precioUsd) {
  const TIPO_CAMBIO_CLP = 950; // valor fijo aproximado, solo para la demo
  const precioClp = Math.round(precioUsd * TIPO_CAMBIO_CLP);
  return precioClp.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  });
}

/**
 * Calculo el precio "antes del descuento" a partir del descuento que
 * entrega la API (discountPercentage), para poder mostrar el precio
 * tachado en las tarjetas cuando corresponde.
 */
export function precioSinDescuentoUsd(producto) {
  if (!producto.discountPercentage) return producto.price;
  return producto.price / (1 - producto.discountPercentage / 100);
}

/**
 * Devuelvo la clase CSS y el texto que voy a usar para la etiqueta de
 * stock, según cuántas unidades quedan. La uso tanto en las tarjetas
 * como en la ficha de detalle para no repetir esta lógica.
 */
export function stockInfo(stock) {
  if (stock <= 0) {
    return { clase: "low", texto: "Sin stock" };
  }
  if (stock <= 5) {
    return { clase: "low", texto: `¡Últimas ${stock}!` };
  }
  return { clase: "ok", texto: "Disponible" };
}

/**
 * Traduzco el "slug" de categoría que usa DummyJSON (por ejemplo
 * "mens-watches") a un nombre legible en español para mostrarlo en
 * botones de filtro, breadcrumbs, etc.
 */
export function nombreCategoria(slug) {
  const nombres = {
    laptops: "Notebooks",
    "mens-watches": "Relojes",
    "mobile-accessories": "Accesorios",
    smartphones: "Smartphones",
    tablets: "Tablets"
  };
  return nombres[slug] || slug;
}

/**
 * Uso esta función para mostrar/ocultar un bloque de "cargando..." y un
 * bloque de contenido, así no repito el mismo if/else en cada página.
 * `contenedorCarga` y `contenedorContenido` son elementos del DOM.
 */
export function mostrarCargando(contenedorCarga, contenedorContenido, cargando) {
  if (contenedorCarga) contenedorCarga.style.display = cargando ? "block" : "none";
  if (contenedorContenido) contenedorContenido.style.display = cargando ? "none" : "";
}
