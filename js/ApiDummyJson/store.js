// store.js
//
// carrito.js (mi script del carrito) es un script "clásico", no un módulo,
// así que no puede hacer `import` de lo que traigo desde la API. Para que
// igual pueda encontrar un producto por su id y validar el stock antes de
// agregarlo al carrito, guardo acá los productos que ya descargué en un
// Map y expongo una función `getProductById` en el objeto `window`.
//
// La idea es simple: cada vez que pinto productos en una página (inicio,
// catálogo o ficha de detalle), los "registro" acá. Así, cuando el usuario
// hace clic en "Agregar al carrito", carrito.js puede llamar a
// `window.getProductById(id)` y obtener el producto real, con su stock
// actualizado, sin tener que volver a llamar a la API.

const productosPorId = new Map();

/**
 * Guardo (o actualizo) uno o varios productos en el store local.
 * Acepta tanto un array de productos como un único producto, para no
 * tener que escribir dos funciones distintas.
 */
export function registerProducts(productos) {
  const lista = Array.isArray(productos) ? productos : [productos];

  lista.forEach(producto => {
    if (producto && producto.id !== undefined) {
      productosPorId.set(producto.id, producto);
    }
  });
}

/**
 * Busco un producto por id dentro de lo que ya tengo registrado.
 * Ojo: dummyjson entrega ids numéricos, pero cuando vienen desde un
 * dataset (por ejemplo el atributo data-id de un botón) llegan como
 * string, así que comparo probando ambas formas.
 */
export function getProductById(id) {
  if (productosPorId.has(id)) return productosPorId.get(id);

  const idNumerico = Number(id);
  if (productosPorId.has(idNumerico)) return productosPorId.get(idNumerico);

  return null;
}

// Expongo la función en window para que carrito.js (script clásico) la
// pueda usar tal como si fuera una función global normal.
window.getProductById = getProductById;
