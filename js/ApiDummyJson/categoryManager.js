// categoryManager.js
import { fetchAllTargetProducts, fetchCategory } from './api.js';

// 1. Traer solo los productos de CIERTA categoría
// Reutiliza directamente la función de api.js, actuando como un puente limpio.
export async function getProductsBySpecificCategory(categoryName) {
  return await fetchCategory(categoryName);
}

// 2. Traer TODOS los productos ordenados/agrupados por su categoría
export async function getGroupedProducts() {
  // Obtenemos la data cruda de la cápsula base
  const allProducts = await fetchAllTargetProducts();
  
  // Usamos reduce para crear un objeto donde cada "llave" es una categoría
  const grouped = allProducts.reduce((acumulador, producto) => {
    const categoria = producto.category;
    
    // Si la categoría no existe en el objeto, la creamos como un array vacío
    if (!acumulador[categoria]) {
      acumulador[categoria] = [];
    }
    
    // Empujamos el producto a su respectiva categoría
    acumulador[categoria].push(producto);
    return acumulador;
  }, {});

  return grouped;
}