// api.js
//
// Esta es la capa que habla directo con DummyJSON. La dejo lo más "tonta"
// posible a propósito: aquí solo hago fetch y devuelvo datos, sin tocar el
// DOM ni preocuparme de cómo se van a pintar. Así, si el día de mañana
// DummyJSON cambia o quiero cambiar de API, solo toco este archivo.

// URL base de la API. La guardo en una constante para no repetirla en cada
// función y para tener un único lugar donde cambiarla si hace falta.
const BASE_URL = "https://dummyjson.com/products";

// Estas son las categorías de DummyJSON que realmente me sirven para la
// tienda (notebooks, relojes, accesorios de celular, smartphones y tablets).
// Las tengo centralizadas acá porque tanto categoryManager.js como
// randomize.js las necesitan para armar el catálogo completo.
export const TARGET_CATEGORIES = [
  "laptops",
  "mens-watches",
  "mobile-accessories",
  "smartphones",
  "tablets"
];

// Uso un caché muy simple en memoria (un Map) para no golpear la API de
// nuevo cada vez que cambio de página o de filtro dentro de la misma
// sesión de navegación. La llave es la categoría y el valor son los
// productos ya descargados. Se vacía solo si recargo la página, lo cual
// me parece suficiente para el alcance de este proyecto.
const cacheCategorias = new Map();

/**
 * Trae los productos de UNA sola categoría.
 * Si ya la pedí antes en esta misma sesión, la devuelvo desde el caché
 * en vez de volver a llamar a la API.
 */
export async function fetchCategory(categoryName) {
  if (cacheCategorias.has(categoryName)) {
    return cacheCategorias.get(categoryName);
  }

  try {
    const response = await fetch(`${BASE_URL}/category/${categoryName}`);

    // fetch() no lanza error por códigos como 404 o 500, así que reviso
    // response.ok a mano para detectar esos casos como un error real.
    if (!response.ok) {
      throw new Error(`La API respondió con estado ${response.status}`);
    }

    const data = await response.json();
    const productos = data.products || [];

    cacheCategorias.set(categoryName, productos);
    return productos;
  } catch (error) {
    console.error(`Error obteniendo la categoría "${categoryName}":`, error);
    // Devuelvo un array vacío en vez de dejar que el error se propague,
    // así el resto de la app no se rompe si una sola categoría falla.
    return [];
  }
}

/**
 * Trae UN producto puntual por su id (lo uso en la ficha de detalle).
 * Acá no uso el caché de categorías porque es una consulta distinta,
 * pero sigo la misma lógica de revisar response.ok y nunca lanzar el
 * error hacia afuera sin controlarlo.
 */
export async function fetchProductById(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`La API respondió con estado ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error obteniendo el producto con id "${id}":`, error);
    return null;
  }
}

/**
 * Trae TODAS las categorías que me interesan y las une en un solo array.
 * Uso Promise.all para lanzar las 5 peticiones al mismo tiempo en vez de
 * una por una, así la espera total es la de la petición más lenta y no
 * la suma de las 5.
 */
export async function fetchAllTargetProducts() {
  try {
    const promesas = TARGET_CATEGORIES.map(categoria => fetchCategory(categoria));
    const resultados = await Promise.all(promesas);

    // resultados queda como un array de arrays, por ejemplo:
    // [ [laptops...], [relojes...], [accesorios...], ... ]
    // Con .flat() lo aplano a una sola lista gigante de productos.
    return resultados.flat();
  } catch (error) {
    console.error("Error obteniendo todos los productos:", error);
    return [];
  }
}
