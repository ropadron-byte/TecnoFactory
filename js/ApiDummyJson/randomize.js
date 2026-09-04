// randomize.js
//
// Este archivo lo uso para mezclar el catálogo y así no mostrar siempre
// los mismos productos en el mismo orden (por ejemplo en "Productos
// destacados" de la página de inicio). Separo la mezcla en su propio
// archivo para que api.js se mantenga enfocado solo en las peticiones.
import { fetchAllTargetProducts } from './api.js';

/**
 * Función privada (no la exporto) que mezcla un array usando el
 * algoritmo de Fisher-Yates. Lo elegí porque es el estándar para barajar
 * arrays de forma pareja: cada posición tiene la misma probabilidad de
 * terminar en cualquier lugar del resultado, a diferencia de hacer un
 * simple .sort(() => Math.random() - 0.5), que no queda tan parejo.
 */
function shuffleArray(array) {
  const mezclado = [...array]; // clono el array para no tocar el original

  for (let i = mezclado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mezclado[i], mezclado[j]] = [mezclado[j], mezclado[i]]; // intercambio de posiciones
  }

  return mezclado;
}

/**
 * Esta es la función que uso desde afuera: trae todos los productos de
 * mis categorías de interés y los devuelve ya mezclados, listos para
 * mostrar en la página de inicio o donde necesite un orden aleatorio.
 */
export async function getRandomProducts() {
  const allProducts = await fetchAllTargetProducts();
  return shuffleArray(allProducts);
}
