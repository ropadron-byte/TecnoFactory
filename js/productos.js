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
const CATEGORIAS = ["Notebooks", "Audio", "Accesorios", "Monitores", "Almacenamiento"];

// Un ícono simple por categoría, para mostrar algo visual en la tarjeta
// del producto sin depender de imágenes descargadas de internet.
const ICONOS_CATEGORIA = {
  Notebooks: "💻",
  Audio: "🎧",
  Accesorios: "🖱️",
  Monitores: "🖥️",
  Almacenamiento: "💾"
};

// Catálogo inicial. Cada producto tiene un "codigo" que funciona como
// identificador único (lo usamos en vez de un id numérico, porque la
// pauta pide un campo "Código producto" para cada producto).
const PRODUCTOS_INICIALES = [
  {
    codigo: "TF-NB-001",
    nombre: "Notebook Factory X14",
    categoria: "Notebooks",
    descripcion:
      "Notebook de 14\" liviano y potente, pensado para trabajo, estudio y clases online. " +
      "Pantalla antirreflejo y batería de larga duración.",
    precio: 549990,
    stock: 12,
    stockCritico: 3
  },
  {
    codigo: "TF-AU-014",
    nombre: "Audífonos NoiseCancel Pro",
    categoria: "Audio",
    descripcion:
      "Audífonos inalámbricos con cancelación activa de ruido, controles táctiles y hasta " +
      "30 horas de batería con su estuche de carga.",
    precio: 79990,
    stock: 40,
    stockCritico: 8
  },
  {
    codigo: "TF-MO-027",
    nombre: "Mouse Ergonómico Wireless",
    categoria: "Accesorios",
    descripcion:
      "Mouse inalámbrico ergonómico, ideal para largas jornadas de trabajo. Sensor óptico " +
      "de alta precisión y conexión estable mediante receptor USB.",
    precio: 17990,
    stock: 2,
    stockCritico: 5
  },
  {
    codigo: "TF-MN-009",
    nombre: "Monitor Curvo 27\" 144Hz",
    categoria: "Monitores",
    descripcion:
      "Pantalla curva de 27 pulgadas con 144Hz de tasa de refresco, pensada tanto para " +
      "productividad como para uso gamer.",
    precio: 249990,
    stock: 7,
    stockCritico: 2
  },
  {
    codigo: "TF-TC-033",
    nombre: "Teclado Mecánico Compacto",
    categoria: "Accesorios",
    descripcion:
      "Formato compacto 75% que ahorra espacio en el escritorio. Switches mecánicos " +
      "táctiles y retroiluminación RGB personalizable.",
    precio: 44990,
    stock: 15,
    stockCritico: 4
  },
  {
    codigo: "TF-SS-041",
    nombre: "SSD Externo 1TB",
    categoria: "Almacenamiento",
    descripcion:
      "Almacenamiento portátil de 1TB con velocidades de lectura de hasta 1050MB/s. " +
      "Carcasa resistente a golpes.",
    precio: 59990,
    stock: 0,
    stockCritico: 3
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
