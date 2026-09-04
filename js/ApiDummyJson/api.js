// api.js

// Lista de las categorías que nos interesan
const TARGET_CATEGORIES = [
  "laptops",
  "mens-watches",
  "mobile-accessories",
  "smartphones",
  "tablets"
];

// 1. Traer datos de UNA sola categoría
export async function fetchCategory(categoryName) {
  try {
    const response = await fetch(`https://dummyjson.com/products/category/${categoryName}`);
    const data = await response.json();
    return data.products; // Retorna solo el array de productos
  } catch (error) {
    console.error(`Error obteniendo la categoría ${categoryName}:`, error);
    return [];
  }
}

// 2. Traer TODAS las categorías de interés y unirlas en un solo array
export async function fetchAllTargetProducts() {
  try {
    // Promise.all permite hacer todas las peticiones al mismo tiempo (más rápido)
    const promises = TARGET_CATEGORIES.map(cat => fetchCategory(cat));
    const results = await Promise.all(promises);
    
    // results es un array de arrays (ej: [[laptops], [relojes], ...])
    // .flat() lo convierte en una sola lista gigante de productos
    return results.flat(); 
  } catch (error) {
    console.error("Error obteniendo todos los productos:", error);
    return [];
  }
}