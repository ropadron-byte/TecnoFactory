// productos.js
//
// Acá vive el catálogo de la tienda. Empezamos con un arreglo fijo de
// productos escrito directamente en JavaScript (tal como lo pide la
// pauta) y lo guardamos en localStorage para que el panel de
// administración pueda agregar, editar y eliminar productos, y esos
// cambios se reflejen también en la tienda.
//
// Este archivo se carga como script "normal" (sin type="module") para
// que sus funciones queden disponibles en cualquier página que lo
// incluya, sin tener que usar import/export.

const PRODUCTOS_KEY = "tf_productos";

// Categorías disponibles para la tienda. Las uso tanto en los filtros
// del catálogo como en el <select> del formulario de administración.
   const CATEGORIAS = ["Notebooks", "Audio", "Accesorios", "Monitores", "Almacenamiento", "Smartphones"];

// Un ícono simple por categoría, para mostrar algo visual en la tarjeta
// del producto sin depender de imágenes descargadas de internet.
const ICONOS_CATEGORIA = {
  Notebooks: "💻",
  Audio: "🎧",
  Accesorios: "🖱️",
  Monitores: "🖥️",
  Almacenamiento: "💾",
  Smartphones: "📱"
};

// Catálogo inicial. Cada producto tiene un "codigo" que funciona como
// identificador único (lo usamos en vez de un id numérico, porque la
// pauta pide un campo "Código producto" para cada producto).
const PRODUCTOS_INICIALES = [
  {
    codigo: "TF-SP-001",
    nombre: "iPhone 5s",
    categoria: "Smartphones",
    descripcion:
      "The iPhone 5s is a classic smartphone known for its compact design and advanced features during its release. While it's an older model, it still provides a reliable user experience.",
    precio: 189990,
    stock: 25,
    stockCritico: 3,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/3.webp"
    ]
  },
  {
    codigo: "TF-SP-002",
    nombre: "iPhone 6",
    categoria: "Smartphones",
    descripcion:
      "The iPhone 6 is a stylish and capable smartphone with a larger display and improved performance. It introduced new features and design elements, making it a popular choice in its time.",
    precio: 284990,
    stock: 60,
    stockCritico: 7,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/3.webp"
    ]
  },
  {
    codigo: "TF-SP-003",
    nombre: "iPhone 13 Pro",
    categoria: "Smartphones",
    descripcion:
      "The iPhone 13 Pro is a cutting-edge smartphone with a powerful camera system, high-performance chip, and stunning display. It offers advanced features for users who demand top-notch technology.",
    precio: 1044990,
    stock: 56,
    stockCritico: 7,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/3.webp"
    ]
  },
  {
    codigo: "TF-SP-004",
    nombre: "iPhone X",
    categoria: "Smartphones",
    descripcion:
      "The iPhone X is a flagship smartphone featuring a bezel-less OLED display, facial recognition technology (Face ID), and impressive performance. It represents a milestone in iPhone design and innovation.",
    precio: 854990,
    stock: 37,
    stockCritico: 4,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/3.webp"
    ]
  },
  {
    codigo: "TF-SP-005",
    nombre: "Oppo A57",
    categoria: "Smartphones",
    descripcion:
      "The Oppo A57 is a mid-range smartphone known for its sleek design and capable features. It offers a balance of performance and affordability, making it a popular choice.",
    precio: 237490,
    stock: 19,
    stockCritico: 2,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/3.webp"
    ]
  },
  {
    codigo: "TF-SP-006",
    nombre: "Oppo F19 Pro Plus",
    categoria: "Smartphones",
    descripcion:
      "The Oppo F19 Pro Plus is a feature-rich smartphone with a focus on camera capabilities. It boasts advanced photography features and a powerful performance for a premium user experience.",
    precio: 379990,
    stock: 78,
    stockCritico: 9,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/3.webp"
    ]
  },
  {
    codigo: "TF-SP-007",
    nombre: "Oppo K1",
    categoria: "Smartphones",
    descripcion:
      "The Oppo K1 series offers a range of smartphones with various features and specifications. Known for their stylish design and reliable performance, the Oppo K1 series caters to diverse user preferences.",
    precio: 284990,
    stock: 55,
    stockCritico: 7,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/3.webp"
    ]
  },
  {
    codigo: "TF-SP-008",
    nombre: "Realme C35",
    categoria: "Smartphones",
    descripcion:
      "The Realme C35 is a budget-friendly smartphone with a focus on providing essential features for everyday use. It offers a reliable performance and user-friendly experience.",
    precio: 142490,
    stock: 48,
    stockCritico: 6,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/3.webp"
    ]
  },
  {
    codigo: "TF-SP-009",
    nombre: "Realme X",
    categoria: "Smartphones",
    descripcion:
      "The Realme X is a mid-range smartphone known for its sleek design and impressive display. It offers a good balance of performance and camera capabilities for users seeking a quality device.",
    precio: 284990,
    stock: 12,
    stockCritico: 2,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/realme-x/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-x/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-x/3.webp"
    ]
  },
  {
    codigo: "TF-SP-010",
    nombre: "Realme XT",
    categoria: "Smartphones",
    descripcion:
      "The Realme XT is a feature-rich smartphone with a focus on camera technology. It comes equipped with advanced camera sensors, delivering high-quality photos and videos for photography enthusiasts.",
    precio: 332490,
    stock: 80,
    stockCritico: 10,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/3.webp"
    ]
  },
  {
    codigo: "TF-SP-011",
    nombre: "Samsung Galaxy S7",
    categoria: "Smartphones",
    descripcion:
      "The Samsung Galaxy S7 is a flagship smartphone known for its sleek design and advanced features. It features a high-resolution display, powerful camera, and robust performance.",
    precio: 284990,
    stock: 67,
    stockCritico: 8,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/3.webp"
    ]
  },
  {
    codigo: "TF-SP-012",
    nombre: "Samsung Galaxy S8",
    categoria: "Smartphones",
    descripcion:
      "The Samsung Galaxy S8 is a premium smartphone with an Infinity Display, offering a stunning visual experience. It boasts advanced camera capabilities and cutting-edge technology.",
    precio: 474990,
    stock: 0,
    stockCritico: 2,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/3.webp"
    ]
  },
  {
    codigo: "TF-SP-013",
    nombre: "Samsung Galaxy S10",
    categoria: "Smartphones",
    descripcion:
      "The Samsung Galaxy S10 is a flagship device featuring a dynamic AMOLED display, versatile camera system, and powerful performance. It represents innovation and excellence in smartphone technology.",
    precio: 664990,
    stock: 19,
    stockCritico: 2,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/3.webp"
    ]
  },
  {
    codigo: "TF-SP-014",
    nombre: "Vivo S1",
    categoria: "Smartphones",
    descripcion:
      "The Vivo S1 is a stylish and mid-range smartphone offering a blend of design and performance. It features a vibrant display, capable camera system, and reliable functionality.",
    precio: 237490,
    stock: 50,
    stockCritico: 6,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/3.webp"
    ]
  },
  {
    codigo: "TF-SP-015",
    nombre: "Vivo V9",
    categoria: "Smartphones",
    descripcion:
      "The Vivo V9 is a smartphone known for its sleek design and emphasis on capturing high-quality selfies. It features a notch display, dual-camera setup, and a modern design.",
    precio: 284990,
    stock: 82,
    stockCritico: 10,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/3.webp"
    ]
  },
  {
    codigo: "TF-SP-016",
    nombre: "Vivo X21",
    categoria: "Smartphones",
    descripcion:
      "The Vivo X21 is a premium smartphone with a focus on cutting-edge technology. It features an in-display fingerprint sensor, a high-resolution display, and advanced camera capabilities.",
    precio: 474990,
    stock: 7,
    stockCritico: 2,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/3.webp"
    ]
  },
  {
    codigo: "TF-NB-001",
    nombre: "Apple MacBook Pro 14 Inch Space Grey",
    categoria: "Notebooks",
    descripcion:
      "The MacBook Pro 14 Inch in Space Grey is a powerful and sleek laptop, featuring Apple's M1 Pro chip for exceptional performance and a stunning Retina display.",
    precio: 1899990,
    stock: 24,
    stockCritico: 3,
    urls: [
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/3.webp"
    ]
  },
  {
    codigo: "TF-NB-002",
    nombre: "Asus Zenbook Pro Dual Screen Laptop",
    categoria: "Notebooks",
    descripcion:
      "The Asus Zenbook Pro Dual Screen Laptop is a high-performance device with dual screens, providing productivity and versatility for creative professionals.",
    precio: 1709990,
    stock: 45,
    stockCritico: 5,
    urls: [
      "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/3.webp"
    ]
  },
  {
    codigo: "TF-NB-003",
    nombre: "Huawei Matebook X Pro",
    categoria: "Notebooks",
    descripcion:
      "The Huawei Matebook X Pro is a slim and stylish laptop with a high-resolution touchscreen display, offering a premium experience for users on the go.",
    precio: 1329990,
    stock: 75,
    stockCritico: 9,
    urls: [
      "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/3.webp"
    ]
  },
  {
    codigo: "TF-NB-004",
    nombre: "Lenovo Yoga 920",
    categoria: "Notebooks",
    descripcion:
      "The Lenovo Yoga 920 is a 2-in-1 convertible laptop with a flexible hinge, allowing you to use it as a laptop or tablet, offering versatility and portability.",
    precio: 1044990,
    stock: 40,
    stockCritico: 5,
    urls: [
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/3.webp"
    ]
  },
  {
    codigo: "TF-NB-005",
    nombre: "New DELL XPS 13 9300 Laptop",
    categoria: "Notebooks",
    descripcion:
      "The New DELL XPS 13 9300 Laptop is a compact and powerful device, featuring a virtually borderless InfinityEdge display and high-end performance for various tasks.",
    precio: 1424990,
    stock: 74,
    stockCritico: 9,
    urls: [
      "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/3.webp"
    ]
  }
];
/** Devuelve el catálogo actual. Si es la primera vez que se visita el
 * sitio (no hay nada guardado todavía), lo llena con PRODUCTOS_INICIALES. */
function obtenerProductos() {
  const data = localStorage.getItem(PRODUCTOS_KEY);
  if (!data) {
    localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(PRODUCTOS_INICIALES));
    return PRODUCTOS_INICIALES;
  }
  return JSON.parse(data);
}

/** Agrega un producto nuevo al catálogo. */
function guardarProducto(producto) {
  const productos = obtenerProductos();
  productos.push(producto);
  localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
}

/** Actualiza un producto existente, buscándolo por su código. */
function actualizarProducto(codigo, datosNuevos) {
  const productos = obtenerProductos();
  const index = productos.findIndex(function (p) { return p.codigo === codigo; });
  if (index === -1) return;
  productos[index] = Object.assign(productos[index], datosNuevos);
  localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
}

/** Elimina un producto del catálogo por su código. */
function eliminarProducto(codigo) {
  const productos = obtenerProductos().filter(function (p) { return p.codigo !== codigo; });
  localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
}

/** Busca un producto por su código. */
function obtenerProductoPorCodigo(codigo) {
  return obtenerProductos().find(function (p) { return p.codigo === codigo; });
}

/** Formatea un número como precio en pesos chilenos: 549990 -> $549.990 */
function formatCLP(valor) {
  return "$" + Number(valor).toLocaleString("es-CL");
}

/** Devuelve el ícono asociado a una categoría (o uno genérico si no la reconoce). */
function iconoCategoria(categoria) {
  return ICONOS_CATEGORIA[categoria] || "📦";
}

/** Escapa comillas y ángulos para poder meter texto dinámico (nombre de
 * producto, etc.) dentro de un atributo HTML sin romper el marcado. */
function escapeAttr(texto) {
  return String(texto == null ? "" : texto)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Devuelve el arreglo de URLs de imágenes de un producto. Soporta tanto
 * el campo nuevo "urls" (arreglo, uno o más) como el campo antiguo
 * "imagen" (una sola URL) que usaban los formularios de administración
 * antes de permitir varias imágenes, para no romper datos ya guardados. */
function imagenesProducto(producto) {
  if (Array.isArray(producto.urls)) {
    return producto.urls.filter(function (u) { return u && u.trim().length > 0; });
  }
  if (producto.imagen) return [producto.imagen];
  return [];
}

/** Si una imagen no carga (URL rota, por ejemplo), la reemplazamos por
 * el ícono de categoría en vez de dejar el típico ícono roto del
 * navegador. */
function handleImgError(img, icono) {
  const div = document.createElement("div");
  div.style.cssText = "font-size:3rem; width:100%; height:100%; display:flex; align-items:center; justify-content:center;";
  div.textContent = icono;
  img.replaceWith(div);
}

/** Arma el HTML de la imagen (o ícono, si no tiene ninguna cargada) que
 * se usa en las tarjetas del catálogo y del home. Muestra la primera
 * imagen del producto; si no carga, cae de vuelta al ícono de categoría. */
function mediaProductoHTML(producto) {
  const imagenes = imagenesProducto(producto);
  if (imagenes.length === 0) {
    return '<div style="font-size:3rem; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">' +
      iconoCategoria(producto.categoria) + "</div>";
  }
  return '<img src="' + escapeAttr(imagenes[0]) + '" alt="' + escapeAttr(producto.nombre) +
    '" loading="lazy" onerror="handleImgError(this, \'' + iconoCategoria(producto.categoria) + "')\">";
}

/* ---------- Campo de imágenes en los formularios de administración ----------
   Los formularios de nuevo/editar producto usan estas funciones para
   poder cargar 1 o más URLs de imagen, con una vista previa de cada una
   y la posibilidad de agregar o quitar filas. */

/** Crea una fila con: input de URL, vista previa y botón para quitarla. */
function crearFilaImagen(valorInicial) {
  const row = document.createElement("div");
  row.className = "image-input-row";
  row.innerHTML =
    '<input type="text" class="imagen-url" placeholder="https://...">' +
    '<img class="image-preview" alt="Vista previa">' +
    '<button type="button" class="btn ghost small btn-quitar-imagen" aria-label="Quitar esta imagen">✕</button>';

  const input = row.querySelector(".imagen-url");
  const preview = row.querySelector(".image-preview");
  input.value = valorInicial || "";

  function actualizarPreview() {
    const url = input.value.trim();
    if (url) {
      preview.src = url;
      preview.classList.add("show");
    } else {
      preview.classList.remove("show");
      preview.removeAttribute("src");
    }
  }
  preview.addEventListener("error", function () { preview.classList.remove("show"); });
  input.addEventListener("input", actualizarPreview);
  actualizarPreview();

  row.querySelector(".btn-quitar-imagen").addEventListener("click", function () {
    row.remove();
  });

  return row;
}

/** Inicializa el bloque de imágenes de un formulario: agrega una fila
 * por cada URL existente (o una fila vacía si es un producto nuevo) y
 * conecta el botón de "+ Añadir otra imagen". */
function iniciarCampoImagenes(contenedorId, botonAgregarId, urlsIniciales) {
  const contenedor = document.getElementById(contenedorId);
  const urls = (urlsIniciales && urlsIniciales.length > 0) ? urlsIniciales : [""];
  urls.forEach(function (url) { contenedor.appendChild(crearFilaImagen(url)); });

  document.getElementById(botonAgregarId).addEventListener("click", function () {
    contenedor.appendChild(crearFilaImagen(""));
  });
}

/** Recoge las URLs cargadas en el bloque de imágenes de un formulario,
 * ya sin espacios, vacíos ni duplicados. */
function leerCampoImagenes(contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  const urls = [];
  contenedor.querySelectorAll(".imagen-url").forEach(function (input) {
    const valor = input.value.trim();
    if (valor && urls.indexOf(valor) === -1) urls.push(valor);
  });
  return urls;
}
