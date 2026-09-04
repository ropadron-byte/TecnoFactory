// categoryManager.js
//
// Este archivo lo pienso como un "puente" entre la capa cruda de la API
// (api.js) y las páginas que necesitan los productos ya organizados por
// categoría. No hago fetch acá directamente, reutilizo lo que ya expone
// api.js para no duplicar la lógica de peticiones.
import { fetchAllTargetProducts, fetchCategory } from './api.js';

/**
 * Traigo solo los productos de UNA categoría específica.
 * Es básicamente un alias de fetchCategory, pero lo dejo con este nombre
 * porque desde las páginas (por ejemplo el catálogo con sus botones de
 * filtro) queda más claro llamar a "getProductsBySpecificCategory" que
 * acordarme del nombre interno de la función de la API.
 */
export async function getProductsBySpecificCategory(categoryName) {
  return await fetchCategory(categoryName);
}

/**
 * Traigo TODOS los productos de las categorías que me interesan y los
 * agrupo en un objeto donde cada llave es el nombre de la categoría y
 * el valor es el array de productos de esa categoría. Esto me sirve,
 * por ejemplo, para armar el catálogo completo dividido en secciones.
 */
export async function getGroupedProducts() {
  // Primero obtengo la data "cruda" (todos los productos mezclados).
  const allProducts = await fetchAllTargetProducts();

  // Uso reduce para ir armando el objeto agrupado: por cada producto,
  // reviso a qué categoría pertenece y lo empujo al array de esa llave.
  const grouped = allProducts.reduce((acumulador, producto) => {
    const categoria = producto.category;

    // Si todavía no existe esa categoría en el objeto, la creo vacía.
    if (!acumulador[categoria]) {
      acumulador[categoria] = [];
    }

    acumulador[categoria].push(producto);
    return acumulador;
  }, {});

  return grouped;
}
