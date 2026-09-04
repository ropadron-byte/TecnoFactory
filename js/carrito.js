// carrito.js
//
// Este es el "cerebro" del carrito de compras. Lo guardo en localStorage
// para que lo que el usuario agregó no se pierda si cierra la pestaña o
// recarga la página. Lo dejo como script clásico (sin import/export) a
// propósito, porque quiero poder usarlo tanto desde páginas simples
// como desde los módulos de js/ApiDummyJson/ sin complicarme con la
// carga de módulos en todas partes.
//
// Ojo: para poder validar el stock antes de agregar un producto, este
// archivo depende de que exista una función global `getProductById`.
// Esa función la expone js/ApiDummyJson/store.js una vez que ya
// registró los productos que se están mostrando en la página.

const CART_KEY = "tf_cart";

// Leo el carrito guardado en localStorage. Si no hay nada guardado
// todavía, o si el contenido está corrupto por algún motivo, devuelvo
// un array vacío en vez de dejar que la página se rompa.
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("No se pudo leer el carrito:", e);
    return [];
  }
}

// Guardo el carrito en localStorage y de paso actualizo el numerito
// del ícono del carrito en el header, para que siempre quede al día.
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

/**
 * Agrego un producto al carrito, respetando el stock disponible.
 * Devuelvo { ok, message } en vez de solo true/false para que quien
 * llame a esta función pueda mostrarle al usuario un mensaje claro
 * (por ejemplo, "Solo quedan 3 unidades disponibles").
 */
function addToCart(productId, qty) {
  // Busco el producto real (con su stock actualizado) usando la
  // función global que expone store.js. Si por algún motivo esa
  // función no está disponible, prefiero fallar de forma controlada.
  const product = typeof getProductById === "function" ? getProductById(productId) : null;
  if (!product) {
    return { ok: false, message: "Producto no encontrado." };
  }
  if (product.stock <= 0) {
    return { ok: false, message: "Este producto no tiene stock disponible." };
  }

  const cart = getCart();
  const existing = cart.find(function (item) { return item.id === productId; });
  const currentQty = existing ? existing.qty : 0;
  const newQty = currentQty + qty;

  // No dejo que la cantidad total supere el stock que realmente hay.
  if (newQty > product.stock) {
    return {
      ok: false,
      message: "Solo quedan " + product.stock + " unidades disponibles."
    };
  }

  if (existing) {
    existing.qty = newQty;
  } else {
    cart.push({ id: productId, qty: qty });
  }

  saveCart(cart);
  return { ok: true, message: "Producto añadido al carrito." };
}

// Sumo todas las cantidades del carrito para saber cuántos productos
// en total tiene el usuario (lo uso para el numerito del header).
function cartTotalItems() {
  return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

// Busco TODOS los elementos marcados con [data-cart-count] (puede haber
// más de uno si en algún momento repito el header) y les actualizo el
// número. Si el carrito está vacío, escondo el badge en vez de mostrar
// un feo "0".
function updateCartBadge() {
  const badges = document.querySelectorAll("[data-cart-count]");
  const total = cartTotalItems();
  badges.forEach(function (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? "inline-flex" : "none";
  });
}

// Actualizo el badge apenas carga cualquier página que incluya este
// script, así el contador siempre refleja lo que hay guardado en
// localStorage aunque el usuario recién esté llegando a la página.
document.addEventListener("DOMContentLoaded", updateCartBadge);
