const CART_KEY = "tf_cart";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("No se pudo leer el carrito:", e);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

/**
 * Añade un producto al carrito respetando el stock disponible.
 * Devuelve { ok, message } para que la vista muestre feedback.
 */
function addToCart(productId, qty) {
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

function cartTotalItems() {
  return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

function updateCartBadge() {
  const badges = document.querySelectorAll("[data-cart-count]");
  const total = cartTotalItems();
  badges.forEach(function (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? "inline-flex" : "none";
  });
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
