// carrito.js
//
// El "cerebro" del carrito de compras. Se guarda en localStorage para
// que lo que el usuario agregó no se pierda si cierra la pestaña o
// recarga la página. Depende de que productos.js ya se haya cargado
// antes (para poder usar obtenerProductoPorCodigo y validar el stock).

const CART_KEY = "tf_cart";

// Leo el carrito guardado en localStorage. Si no hay nada guardado
// todavía, o si el contenido está corrupto, devuelvo un array vacío.
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("No se pudo leer el carrito:", e);
    return [];
  }
}

// Guardo el carrito en localStorage y actualizo el numerito del ícono
// del carrito en el header.
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

/**
 * Agrego un producto al carrito, respetando el stock disponible.
 * Devuelvo { ok, message } para que quien llame a esta función pueda
 * mostrarle al usuario un mensaje claro.
 */
function addToCart(codigo, qty) {
  const product = obtenerProductoPorCodigo(codigo);
  if (!product) {
    return { ok: false, message: "Producto no encontrado." };
  }
  if (product.stock <= 0) {
    return { ok: false, message: "Este producto no tiene stock disponible." };
  }

  const cart = getCart();
  const existing = cart.find(function (item) { return item.codigo === codigo; });
  const currentQty = existing ? existing.qty : 0;
  const newQty = currentQty + qty;

  if (newQty > product.stock) {
    return { ok: false, message: "Solo quedan " + product.stock + " unidades disponibles." };
  }

  if (existing) {
    existing.qty = newQty;
  } else {
    cart.push({ codigo: codigo, qty: qty });
  }

  saveCart(cart);
  return { ok: true, message: "Producto añadido al carrito." };
}

// Quito por completo un producto del carrito.
function removeFromCart(codigo) {
  const cart = getCart().filter(function (item) { return item.codigo !== codigo; });
  saveCart(cart);
}

// Cambio la cantidad de un producto ya agregado (respetando el stock).
function updateCartQty(codigo, qty) {
  const product = obtenerProductoPorCodigo(codigo);
  const cart = getCart();
  const item = cart.find(function (i) { return i.codigo === codigo; });
  if (!item || !product) return;

  item.qty = Math.max(1, Math.min(qty, product.stock));
  saveCart(cart);
}

// Sumo todas las cantidades del carrito (lo uso para el numerito del header).
function cartTotalItems() {
  return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

// Sumo el precio total del carrito (cantidad x precio de cada producto).
function cartTotalPrice() {
  return getCart().reduce(function (sum, item) {
    const product = obtenerProductoPorCodigo(item.codigo);
    return sum + (product ? product.precio * item.qty : 0);
  }, 0);
}

// Actualizo todos los elementos [data-cart-count] con el total actual.
function updateCartBadge() {
  const badges = document.querySelectorAll("[data-cart-count]");
  const total = cartTotalItems();
  badges.forEach(function (badge) {
    badge.textContent = total;
  });
}

// Actualizo el badge apenas carga cualquier página que incluya este script.
document.addEventListener("DOMContentLoaded", updateCartBadge);
