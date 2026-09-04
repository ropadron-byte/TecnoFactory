// randomize.js
import { fetchAllTargetProducts } from './api.js';

// Función privada para mezclar un array (Algoritmo de Fisher-Yates)
function shuffleArray(array) {

  const mezclado = [...array]; // Clonamos para no modificar el array original
  
  for (let i = mezclado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mezclado[i], mezclado[j]] = [mezclado[j], mezclado[i]]; // Intercambio de posiciones
  }
  
  return mezclado;
}

// Exportamos la función que usaremos en el frontend
export async function getRandomProducts() {
  // 1. Llamamos a la cápsula base para obtener la data cruda
  const allProducts = await fetchAllTargetProducts();
  
  // 2. Retornamos la data mezclada
  return shuffleArray(allProducts);
}