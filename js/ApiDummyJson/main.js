// main.js
import { getRandomProducts } from './randomize.js';
import { getProductsBySpecificCategory, getGroupedProducts } from './categoryManager.js';

// Función autoejecutable para probar en consola
(async () => {
  console.log("⏳ Cargando datos...");

  // Prueba 1: Productos Aleatorios
  const randomProducts = await getRandomProducts();
  console.log("🎲 Productos Aleatorizados (primeros 4):", randomProducts.slice(0, 4));

  // Prueba 2: Solo una categoría específica
  const soloRelojes = await getProductsBySpecificCategory("mens-watches");
  console.log("⌚ Solo Relojes:", soloRelojes);

  // Prueba 3: Todos ordenados por categoría
  const agrupados = await getGroupedProducts();
  console.log("📦 Productos agrupados por categoría:", agrupados);
  
  // Puedes acceder a los agrupados así: agrupados["smartphones"]
})();