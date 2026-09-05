# Aprende JavaScript con los ejemplos reales de TecnoFactory

Esta guía no es teoría abstracta: **cada concepto se explica con una línea de código que ya existe en el proyecto** (con el archivo y el propósito real que cumple ahí). La idea es que puedas ir del concepto al código real y entender *por qué* se escribió así.

> 💡 Dato importante antes de empezar: todo el JS de este proyecto está escrito en un estilo **ES5-friendly** a propósito: `function () {}` en vez de arrow functions, concatenación con `+` en vez de template literals, y `var`/`const` en vez de mezclar todo con `let`. Esto es común en proyectos pensados para no depender de un "transpilador" (Babel) ni de un bundler. Lo vas a notar en casi todos los ejemplos.

---

## Índice

1. [Variables: `const`, `let`, `var`](#1-variables-const-let-var)
2. [Tipos de datos primitivos](#2-tipos-de-datos-primitivos)
3. [Objetos literales](#3-objetos-literales)
4. [Arrays y sus métodos más usados](#4-arrays-y-sus-métodos-más-usados)
5. [Funciones: declaración, anónimas y flecha](#5-funciones-declaración-anónimas-y-flecha)
6. [Condicionales y operadores lógicos](#6-condicionales-y-operadores-lógicos)
7. [Operador ternario](#7-operador-ternario)
8. [Concatenación de strings vs. template literals](#8-concatenación-de-strings-vs-template-literals)
9. [Expresiones regulares (regex) básicas](#9-expresiones-regulares-regex-básicas)
10. [`try`/`catch`: manejo de errores](#10-trycatch-manejo-de-errores)
11. [JSON + `localStorage`](#11-json--localstorage)
12. [El DOM (parte 1): seleccionar elementos](#12-el-dom-parte-1-seleccionar-elementos)
13. [El DOM (parte 2): crear y modificar elementos](#13-el-dom-parte-2-crear-y-modificar-elementos)
14. [Eventos](#14-eventos)
15. [`URLSearchParams`: leer la URL](#15-urlsearchparams-leer-la-url)
16. [`Object.assign` y `delete`](#16-objectassign-y-delete)
17. [IIFE y closures](#17-iife-y-closures)
18. [Números: `parseInt`, `parseFloat`, `isNaN`, `Math.min`/`Math.max`](#18-números-parseint-parsefloat-isnan-mathminmathmax)
19. [Funciones como parámetros (callbacks)](#19-funciones-como-parámetros-callbacks)
20. [Ejercicios propuestos](#20-ejercicios-propuestos)

---

## 1. Variables: `const`, `let`, `var`

- **`const`**: la variable no se puede reasignar. Se usa para todo lo que no cambia (claves de `localStorage`, arreglos de configuración, elementos del DOM que no se van a reemplazar).
- **`let`**: variable que sí puede cambiar de valor, con alcance de bloque (`{ }`).
- **`var`**: la forma antigua, con alcance de función (no de bloque). El proyecto casi no la usa.

Ejemplo real (`js/productos.js`):
```js
const PRODUCTOS_KEY = "tf_productos"; // nunca cambia: es el nombre de la clave
```

Ejemplo real con `let` (`js/carrito.js`, dentro de `updateCartQty`):
```js
function updateCartQty(codigo, qty) {
  const product = obtenerProductoPorCodigo(codigo); // no cambia
  const cart = getCart();                            // no cambia (la referencia)
  const item = cart.find(function (i) { return i.codigo === codigo; });
  if (!item || !product) return;

  item.qty = Math.max(1, Math.min(qty, product.stock)); // esto SÍ reasigna una propiedad
  saveCart(cart);
}
```
> Nota: `item.qty = ...` no es reasignar la variable `item` (que es `const`), es **cambiar una propiedad del objeto** al que `item` apunta. Eso está permitido incluso con `const`, porque `const` protege la referencia, no el contenido del objeto.

**Para recordar:** `const` por defecto, `let` solo si de verdad vas a reasignar la variable completa, `var` casi nunca (a menos que necesites soportar navegadores muy viejos).

---

## 2. Tipos de datos primitivos

JavaScript tiene 7 tipos primitivos: `string`, `number`, `boolean`, `undefined`, `null`, `symbol`, `bigint`. Los 4 primeros son los que vas a ver todo el tiempo en este proyecto:

```js
// string
codigo: "TF-SP-001",

// number
precio: 189990,
stock: 25,

// boolean (resultado de una comparación)
const valido = valor.length > 0 && valor.length <= 100;

// undefined (cuando .find() no encuentra nada)
const usuario = obtenerUsuarios().find(function (u) { ... }); // undefined si no matchea
```
(`js/usuarios.js`, dentro de `iniciarSesion` — de hecho, este es exactamente el valor que causaba el bug de login que vimos antes: `usuario` queda `undefined` si no hay match).

**Para recordar:** `typeof undefined === "undefined"`, pero `typeof null === "object"` (una rareza histórica del lenguaje). Por eso el proyecto compara con `!usuario` en vez de `usuario === null`: así cubre tanto `null` como `undefined` en una sola condición.

---

## 3. Objetos literales

Un objeto es una colección de pares `clave: valor`, escrita entre llaves `{ }`. Es la forma más usada en todo el proyecto para representar "una cosa" (un producto, un usuario, un ítem del carrito).

Ejemplo real (`js/productos.js`, dentro de `PRODUCTOS_INICIALES`):
```js
{
  codigo: "TF-SP-001",
  nombre: "iPhone 5s",
  categoria: "Smartphones",
  precio: 189990,
  stock: 25,
  stockCritico: 3,
  urls: [
    "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/1.webp"
  ]
}
```

Para **leer** una propiedad, se usa punto o corchetes:
```js
producto.nombre       // "iPhone 5s"
producto["nombre"]    // exactamente lo mismo, otra sintaxis
```

Para **crear un objeto nuevo combinando datos sueltos**, se usa la misma sintaxis (`js/carrito.js`, dentro de `addToCart`):
```js
cart.push({ codigo: codigo, qty: qty });
```
> Esto es "notación abreviada sin abreviar": como la clave y la variable se llaman igual (`codigo: codigo`), en JS moderno se podría escribir `{ codigo, qty }` (shorthand). El proyecto usa la forma larga a propósito, por consistencia con el estilo ES5 del resto del código.

**Para recordar:** un objeto no tiene orden garantizado como un array, pero en la práctica los navegadores modernos sí respetan el orden de inserción de las claves.

---

## 4. Arrays y sus métodos más usados

Un array es una lista ordenada de valores. Este proyecto usa constantemente 6 métodos de array que **no modifican el original** (devuelven uno nuevo) y 2 que **sí lo modifican**:

| Método | ¿Modifica el original? | Qué hace | Dónde se usa |
|---|---|---|---|
| `.push(x)` | Sí | Agrega un elemento al final | `guardarProducto()` en `productos.js` |
| `.filter(fn)` | No | Devuelve solo los que cumplen la condición | `eliminarProducto()`, `pintarProductos()` |
| `.find(fn)` | No | Devuelve el **primer** elemento que cumple, o `undefined` | `obtenerProductoPorCodigo()` |
| `.findIndex(fn)` | No | Igual que `.find()` pero devuelve la **posición** (o `-1`) | `actualizarProducto()` |
| `.forEach(fn)` | No (pero permite efectos secundarios) | Ejecuta una función por cada elemento, sin devolver nada | Casi todos los `.js` de la carpeta |
| `.some(fn)` | No | Devuelve `true`/`false` si **al menos uno** cumple | `correoYaRegistrado()` |
| `.reduce(fn, inicial)` | No | "Aplasta" el array en un solo valor (una suma, por ejemplo) | `cartTotalItems()`, `cartTotalPrice()` |
| `.slice(inicio, fin)` | No | Devuelve un pedazo del array, sin tocar el original | `home.js` (los primeros 8 productos) |

Ejemplo real de `.find()` (`js/productos.js`):
```js
function obtenerProductoPorCodigo(codigo) {
  return obtenerProductos().find(function (p) { return p.codigo === codigo; });
}
```

Ejemplo real de `.filter()` (`js/productos.js`):
```js
function eliminarProducto(codigo) {
  const productos = obtenerProductos().filter(function (p) { return p.codigo !== codigo; });
  localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
}
```
> Fíjate: en vez de "buscar y borrar", la técnica es **reconstruir el arreglo dejando afuera lo que no queremos**. Es un patrón muy común en JS funcional: no mutar, sino generar una versión nueva.

Ejemplo real de `.reduce()` (`js/carrito.js`):
```js
function cartTotalPrice() {
  return getCart().reduce(function (sum, item) {
    const product = obtenerProductoPorCodigo(item.codigo);
    return sum + (product ? product.precio * item.qty : 0);
  }, 0); // <- el 0 es el valor inicial de "sum"
}
```
`.reduce()` recorre el array acumulando un resultado: en cada vuelta, `sum` es lo acumulado hasta ahora, y lo que devuelve la función pasa a ser el nuevo `sum` en la siguiente vuelta.

Ejemplo real de `.some()` (`js/usuarios.js`):
```js
function correoYaRegistrado(correo, idExcluir) {
  const correoNormalizado = (correo || "").trim().toLowerCase();
  return obtenerUsuarios().some(function (u) {
    return u.correo.trim().toLowerCase() === correoNormalizado && u.id !== idExcluir;
  });
}
```

**Para recordar:** si necesitas **un solo elemento** → `.find()`. Si necesitas **varios** → `.filter()`. Si necesitas **un solo valor resumen** (total, promedio, sí/no) → `.reduce()` o `.some()`/`.every()`.

---

## 5. Funciones: declaración, anónimas y flecha

Este proyecto usa casi exclusivamente **funciones declaradas** (con nombre, para funciones reutilizables) y **funciones anónimas tradicionales** (`function () {}`, para callbacks). Casi no usa **arrow functions** (`() => {}`), que son la forma moderna equivalente.

Función declarada (`js/productos.js`):
```js
function formatCLP(valor) {
  return "$" + Number(valor).toLocaleString("es-CL");
}
```

Función anónima como callback (`js/catalogo.js`):
```js
grid.querySelectorAll("[data-add-codigo]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const resultado = addToCart(btn.getAttribute("data-add-codigo"), 1);
    btn.textContent = resultado.ok ? "¡Añadido!" : resultado.message;
  });
});
```
Acá hay **dos funciones anidadas**: la de afuera recibe cada botón (`btn`), y la de adentro es la que realmente corre cuando se hace clic.

La misma función anónima, escrita como **arrow function** (equivalente, más moderno, no usado en el proyecto pero bueno saberlo):
```js
grid.querySelectorAll("[data-add-codigo]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const resultado = addToCart(btn.getAttribute("data-add-codigo"), 1);
    btn.textContent = resultado.ok ? "¡Añadido!" : resultado.message;
  });
});
```

**Diferencia real (no solo de estilo) entre `function` y arrow function:** dentro de una arrow function, `this` **no cambia** (hereda el `this` de donde fue definida). Dentro de una `function` normal usada como método o callback de evento, `this` puede referirse al elemento del DOM que disparó el evento. Este proyecto evita el problema directamente **no usando `this` casi nunca** — en vez de eso, usa `document.getElementById(...)` explícito en cada función, lo cual es más largo de escribir, pero más fácil de leer para quien recién aprende.

**Para recordar:** función con nombre → para algo que vas a reutilizar en varios lugares. Función anónima → para un callback de un solo uso (un `.forEach`, un evento, un `.find`).

---

## 6. Condicionales y operadores lógicos

`if` / `else if` / `else` de siempre, más los operadores `&&` (Y), `||` (O) y `!` (NO).

Ejemplo real (`js/carrito.js`):
```js
function addToCart(codigo, qty) {
  const product = obtenerProductoPorCodigo(codigo);
  if (!product) {
    return { ok: false, message: "Producto no encontrado." };
  }
  if (product.stock <= 0) {
    return { ok: false, message: "Este producto no tiene stock disponible." };
  }
  // ... sigue el flujo normal si pasó las dos validaciones
}
```
> Patrón "guard clause" (cláusula de guarda): en vez de anidar todo dentro de un gran `if (product) { if (product.stock > 0) { ... } }`, se corta temprano con `return` apenas algo no sirve. El código queda más plano y fácil de leer.

`&&` como "atajo" para no acceder a algo que podría no existir (`js/productos.js`):
```js
function imagenesProducto(producto) {
  if (Array.isArray(producto.urls)) {
    return producto.urls.filter(function (u) { return u && u.trim().length > 0; });
  }
  if (producto.imagen) return [producto.imagen];
  return [];
}
```
Acá `u && u.trim().length > 0` primero comprueba que `u` no sea `""`/`null`/`undefined` (todos son "falsy") **antes** de llamar `.trim()` sobre él — si `u` fuera `undefined` y se llamara `.trim()` directo, el programa lanzaría un error.

`||` para dar un valor por defecto (`js/usuarios.js`):
```js
const correoNormalizado = (correo || "").trim().toLowerCase();
```
Si `correo` es `undefined`/`null`/`""` (todos "falsy"), usa `""` en su lugar; así `.trim()` nunca falla por intentar llamarse sobre algo que no es texto.

**Para recordar:** en JS son "falsy" (se comportan como `false` en un `if`): `false`, `0`, `""`, `null`, `undefined`, `NaN`. Todo lo demás es "truthy" — **incluido un objeto vacío `{}`**, que es justamente la trampa detrás del bug de login que vimos antes.

---

## 7. Operador ternario

`condición ? valorSiVerdadero : valorSiFalso` — un `if/else` de una sola línea que **devuelve un valor**, en vez de solo ejecutar código.

Ejemplo real (`js/catalogo.js`):
```js
(producto.stock > 0
  ? '<button type="button" class="btn accent small" data-add-codigo="' + producto.codigo + '">Añadir al carrito</button>'
  : '<span class="stock-tag">Sin stock</span>')
```

Ejemplo real anidado (dos ternarios seguidos) en `pages/admin/producto.html`:
```js
const stockBadge = p.stock <= 0
  ? "<span class='badge critico'>Sin stock</span>"
  : (p.stock <= p.stockCritico
      ? "<span class='badge critico'>" + p.stock + " (crítico)</span>"
      : "<span class='badge ok'>" + p.stock + "</span>");
```
Se lee como: "si no hay stock, muestra 'Sin stock'; si no, si el stock es crítico, muéstralo en rojo; si no, muéstralo en verde".

**Para recordar:** un ternario está bien para elegir entre **dos valores**. Si necesitas ejecutar varias líneas de lógica, mejor un `if/else` normal — anidar más de 2 ternarios ya empieza a ser difícil de leer.

---

## 8. Concatenación de strings vs. template literals

El proyecto arma HTML dinámico **concatenando strings con `+`**, en vez de usar *template literals* (los strings con backticks `` ` `` y `${...}`) que son el estándar moderno.

Ejemplo real, tal cual está en `js/home.js`:
```js
col.innerHTML =
  '<div class="card h-100 text-center p-3">' +
    '<div class="media" style="height:140px; margin-bottom:.75rem;">' + mediaProductoHTML(producto) + "</div>" +
    '<div class="card-body d-flex flex-column">' +
      '<h6 class="card-title">' + producto.nombre + "</h6>" +
      '<p class="fw-bold mb-3">' + formatCLP(producto.precio) + "</p>" +
      '<a href="pages/tienda/detalle_productos.html?codigo=' + encodeURIComponent(producto.codigo) + '" class="btn btn-outline-primary mt-auto">Ver producto</a>' +
    "</div>" +
  "</div>";
```

Lo **mismo**, escrito con template literals (más legible, forma moderna equivalente):
```js
col.innerHTML = `
  <div class="card h-100 text-center p-3">
    <div class="media" style="height:140px; margin-bottom:.75rem;">${mediaProductoHTML(producto)}</div>
    <div class="card-body d-flex flex-column">
      <h6 class="card-title">${producto.nombre}</h6>
      <p class="fw-bold mb-3">${formatCLP(producto.precio)}</p>
      <a href="pages/tienda/detalle_productos.html?codigo=${encodeURIComponent(producto.codigo)}" class="btn btn-outline-primary mt-auto">Ver producto</a>
    </div>
  </div>
`;
```

**Para recordar:** los template literals (backticks) permiten: (1) meter variables directo con `${variable}` sin cortar el string, y (2) escribir el texto en varias líneas tal cual, sin tener que concatenar `"\n"`. Son estrictamente mejores para este caso de uso — la única razón real para no usarlos es mantener compatibilidad con navegadores muy antiguos (algo que este proyecto parece priorizar, dado el estilo general del código).

---

## 9. Expresiones regulares (regex) básicas

Una regex es un patrón para buscar/validar texto. Se escriben entre barras `/patrón/` y se usan con `.test(texto)` (devuelve `true`/`false`) o `.replace()`.

Ejemplo real de validación de formato de correo (`js/contacto.js`):
```js
const formatoBasico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
```
Desglosado:
- `^` y `$` → inicio y fin del texto completo (para que no valide solo un pedacito).
- `[^\s@]+` → uno o más caracteres que **no** sean espacio ni `@` (la parte antes del `@`).
- `@` → un `@` literal.
- `[^\s@]+` → el dominio, mismo patrón.
- `\.` → un punto literal (con `\` porque `.` solo, en regex, significa "cualquier carácter").
- `[^\s@]+` → la extensión (`.com`, `.cl`, etc).

Ejemplo real de "limpiar" un texto con `.replace()` (`js/usuarios.js`, dentro de `validarRun`):
```js
run = run.replace(/[^0-9kK]/g, "").toUpperCase();
```
`[^0-9kK]` = "cualquier carácter que **no** sea un dígito ni `k`/`K`"; el flag `g` (global) hace que reemplace **todas** las coincidencias, no solo la primera. En la práctica, esta línea le saca los puntos y el guion a un RUN como `19.011.022-8` y lo deja como `190110228`.

**Para recordar:** no necesitas memorizar regex de memoria — lo importante es reconocer el patrón cuando lo veas y saber buscar/probar en una herramienta como [regex101.com](https://regex101.com) cuando necesites escribir una nueva.

---

## 10. `try`/`catch`: manejo de errores

Sirve para "atrapar" un error en tiempo de ejecución y decidir qué hacer, en vez de que el programa entero se rompa.

Ejemplo real (`js/carrito.js`):
```js
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("No se pudo leer el carrito:", e);
    return [];
  }
}
```
`JSON.parse()` lanza un error si el texto guardado no es JSON válido (por ejemplo, si alguien editó `localStorage` a mano y lo dejó corrupto). Sin el `try/catch`, ese error tumbaría toda la página. Con él, el programa sigue funcionando devolviendo un carrito vacío.

**Para recordar:** usa `try/catch` alrededor de cualquier operación que dependa de datos externos que no controlas 100% (leer de `localStorage`, parsear JSON, llamar a una API) — no lo pongas "por si acaso" alrededor de todo tu código, porque esconde errores que sí deberías notar durante el desarrollo.

---

## 11. JSON + `localStorage`

`localStorage` **solo guarda texto** (strings). Para guardar un array/objeto, hay que convertirlo a texto con `JSON.stringify()`, y al leerlo, convertirlo de vuelta con `JSON.parse()`.

Ejemplo real completo del patrón "leer o inicializar" (`js/productos.js`):
```js
function obtenerProductos() {
  const data = localStorage.getItem(PRODUCTOS_KEY);   // 1. leer (texto o null)
  if (!data) {
    localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(PRODUCTOS_INICIALES)); // 2. objeto -> texto
    return PRODUCTOS_INICIALES;
  }
  return JSON.parse(data); // 3. texto -> objeto/array de nuevo
}
```

**Para recordar:** el ciclo siempre es el mismo:
```
guardar:  objeto/array  --JSON.stringify()-->  texto  --localStorage.setItem()-->  disco
leer:     disco  --localStorage.getItem()-->  texto  --JSON.parse()-->  objeto/array de nuevo
```
Y `localStorage.getItem()` devuelve `null` (no `undefined`, no `[]`) cuando la clave no existe — por eso todo el proyecto chequea `if (!data)` antes de intentar parsear.

---

## 12. El DOM (parte 1): seleccionar elementos

| Método | Devuelve | Cuándo usarlo |
|---|---|---|
| `document.getElementById("x")` | Un elemento (o `null`) | Cuando el elemento tiene un `id` único |
| `document.querySelector(".x")` | El **primer** elemento que matchee ese selector CSS | Cuando prefieres un selector tipo CSS |
| `document.querySelectorAll(".x")` | Una `NodeList` de **todos** los que matcheen | Cuando necesitas iterar varios con `.forEach()` |

Ejemplo real de los tres, en `js/main.js` y `js/catalogo.js`:
```js
const toggle = document.querySelector(".nav-toggle");         // uno solo, por clase
const links = document.querySelector(".nav-links");

const botonesFiltro = document.querySelectorAll(".filter-btn"); // varios, por clase
```
```js
const grid = document.getElementById("grid-productos");        // uno solo, por id
```

**Para recordar:** si el elemento es único en la página, usa `id` + `getElementById` (más rápido y explícito). Si vas a repetir el mismo tipo de elemento varias veces (como cada tarjeta de producto o cada botón de filtro), usa una clase + `querySelectorAll`.

---

## 13. El DOM (parte 2): crear y modificar elementos

Dos formas de agregar contenido nuevo a la página:

**A. `innerHTML`** — le pasas un string de HTML y el navegador lo convierte en elementos reales. Rápido de escribir, pero hay que tener cuidado con inyectar texto de usuario sin escapar (por eso existe `escapeAttr()` en `productos.js`).

```js
tr.innerHTML =
  "<td>" + p.codigo + "</td>" +
  "<td>" + p.nombre + "</td>" +
  "<td>" + formatCLP(p.precio) + "</td>";
```

**B. `document.createElement()` + `.appendChild()`** — armas el elemento paso a paso en JavaScript puro. Más código, pero más seguro y más fácil de conectar eventos directamente.

Ejemplo real (`js/productos.js`, dentro de `crearFilaImagen`):
```js
function crearFilaImagen(valorInicial) {
  const row = document.createElement("div");
  row.className = "image-input-row";
  row.innerHTML = '<input type="text" class="imagen-url" placeholder="https://...">' + /* ... */;

  const input = row.querySelector(".imagen-url"); // busca DENTRO del elemento recién creado
  input.value = valorInicial || "";

  row.querySelector(".btn-quitar-imagen").addEventListener("click", function () {
    row.remove(); // saca el elemento del DOM
  });

  return row;
}
```
Y luego, en otra función, ese elemento se agrega de verdad a la página:
```js
function iniciarCampoImagenes(contenedorId, botonAgregarId, urlsIniciales) {
  const contenedor = document.getElementById(contenedorId);
  urls.forEach(function (url) { contenedor.appendChild(crearFilaImagen(url)); });
}
```

**Para recordar:** `innerHTML` para volcar contenido grande de una vez (una tabla entera, una tarjeta). `createElement`/`appendChild` cuando necesitas ir armando algo pieza por pieza y conectándole comportamiento (eventos) antes de mostrarlo.

---

## 14. Eventos

Un evento es "algo que pasó" (un clic, que la página terminó de cargar, que cambió un input) y `addEventListener` es la forma de decirle a JS "cuando pase esto, ejecuta esta función".

| Evento | Cuándo se dispara | Ejemplo real |
|---|---|---|
| `DOMContentLoaded` | Cuando el HTML ya terminó de cargar (antes de imágenes/CSS externo) | Envuelve casi todo el código de cada script |
| `click` | Al hacer clic en un elemento | Botones "Añadir al carrito", "+"/"−" |
| `submit` | Al enviar un formulario | Login, registro, alta de producto/usuario |
| `input` | Cada vez que el usuario escribe algo en un campo | Validación en vivo del formulario de contacto |
| `change` | Cuando un `<select>` cambia de valor (y pierde el foco en inputs) | Región → Comuna |
| `error` | Cuando una imagen (`<img>`) no logra cargar | Reemplazo por el ícono de categoría |

Ejemplo real, el patrón que se repite en **todos** los archivos `.js` del proyecto:
```js
document.addEventListener("DOMContentLoaded", function () {
  // todo el código que necesita que el HTML ya exista va acá adentro
});
```

Ejemplo real de `submit`, con `e.preventDefault()` (`js/contacto.js`):
```js
form.addEventListener("submit", function (e) {
  e.preventDefault(); // evita que el navegador intente recargar la página y "enviar" el form de verdad
  // ... validaciones ...
});
```
`e` es el objeto "evento": trae información sobre qué pasó y métodos para controlar su comportamiento por defecto. `preventDefault()` es clave en formularios sin backend real: sin esa línea, el navegador recargaría la página al enviar.

**Para recordar:** `DOMContentLoaded` es casi siempre lo primero que vas a escribir en un script que toca el DOM — si tu script se carga en el `<head>` y no esperas a este evento, los elementos que buscas todavía no existen y `document.getElementById(...)` te devolvería `null`.

---

## 15. `URLSearchParams`: leer la URL

Sirve para leer los parámetros que vienen después del `?` en una URL, sin tener que escribir un regex a mano.

Ejemplo real (`js/detalle.js`):
```js
const params = new URLSearchParams(window.location.search);
const codigo = params.get("codigo");
```
Si la URL es `detalle_productos.html?codigo=TF-NB-001`, entonces `window.location.search` es `"?codigo=TF-NB-001"`, y `params.get("codigo")` devuelve `"TF-NB-001"`.

El viaje inverso —armar esa URL desde JS— se hace con `encodeURIComponent()` (`js/home.js`):
```js
'<a href="pages/tienda/detalle_productos.html?codigo=' + encodeURIComponent(producto.codigo) + '">'
```
`encodeURIComponent` escapa caracteres especiales (espacios, `&`, `?`, etc.) para que el código de producto no rompa la estructura de la URL si alguna vez tuviera un carácter raro.

**Para recordar:** siempre que vayas a meter una variable dentro de una URL, pásala por `encodeURIComponent()` primero; y siempre que la leas de vuelta, usa `URLSearchParams` en vez de cortar el string a mano con `.split("?")`/`.split("&")`.

---

## 16. `Object.assign` y `delete`

`Object.assign(destino, origen1, origen2, ...)` copia las propiedades de los objetos "origen" hacia el objeto "destino" (y lo devuelve). Se usa muchísimo en este proyecto para **actualizar** o **clonar** objetos sin mutar el original directamente.

Ejemplo real de "clonar y quitar una propiedad" (`js/usuarios.js`):
```js
const sesion = Object.assign({}, usuario); // copia todas las props de "usuario" a un objeto {} nuevo
delete sesion.contrasena;                  // le saca la propiedad "contrasena" a la copia
```
El objeto `{}` vacío como primer argumento es la clave: así el resultado es un objeto **nuevo**, y `usuario` (el original, que sigue en la lista de usuarios) no se toca — si se le hiciera `delete usuario.contrasena` directamente, se perdería la contraseña guardada de ese usuario para siempre.

Ejemplo real de "actualizar campos de un objeto existente" (`js/productos.js`):
```js
function actualizarProducto(codigo, datosNuevos) {
  const productos = obtenerProductos();
  const index = productos.findIndex(function (p) { return p.codigo === codigo; });
  if (index === -1) return;
  productos[index] = Object.assign(productos[index], datosNuevos); // mezcla: lo nuevo pisa lo viejo
  localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
}
```
Acá `Object.assign(productos[index], datosNuevos)` mezcla `datosNuevos` **encima** del producto existente: las claves que vienen en `datosNuevos` reemplazan a las viejas, y las que no vienen quedan intactas.

⚠️ **El recordatorio del bug que ya vimos**: `Object.assign({}, undefined)` no lanza error — simplemente ignora el `undefined` y devuelve `{}`. Por eso hay que comprobar `if (!usuario) return null;` **antes** de llegar a esa línea, si `usuario` puede no existir.

**Para recordar:** `Object.assign({}, algo)` es una forma rápida de "clonar superficialmente" un objeto (solo el primer nivel; si `algo` tiene un objeto anidado, ese anidado se comparte por referencia, no se clona).

---

## 17. IIFE y closures

Una **IIFE** (Immediately Invoked Function Expression = función que se ejecuta apenas se define) sirve para crear un bloque de código que corre una sola vez y no ensucia el espacio global con sus variables internas.

El ejemplo real más claro del proyecto es **todo** `js/admin-guard.js`:
```js
(function () {
  const PAGINA_ACTUAL = location.pathname.split("/").pop();
  // ... toda la lógica de control de acceso ...
})();
```
La sintaxis `(function () { ... })()` envuelve la función entre paréntesis y la llama inmediatamente con `()` al final. `PAGINA_ACTUAL`, `SOLO_ADMIN`, `sesion`, etc. quedan **encerradas** dentro de esa función: ninguna otra parte del código puede verlas ni pisarlas por accidente, aunque el script se cargue en varias páginas distintas.

Un **closure** es cuando una función "recuerda" variables de donde fue creada, aunque esa función se ejecute después, en otro momento. Ejemplo real (`js/detalle.js`):
```js
function mostrarImagenPrincipal(url) {
  imagenPrincipal.src = url;      // "imagenPrincipal" fue definida ANTES, fuera de esta función
  imagenPrincipal.alt = producto.nombre; // "producto" también
}
```
Cuando esta función se llama más tarde (al hacer clic en una miniatura), sigue "recordando" cuáles son `imagenPrincipal` y `producto`, aunque esas variables se hayan definido en otro momento del script — eso es un closure: la función se lleva "una mochila" con las variables de su entorno de creación.

**Para recordar:** no necesitas memorizar la teoría formal de closures — si ves una función definida *dentro* de otra función, y esa función interna usa variables de la función externa, ya estás viendo un closure en acción. Es el comportamiento normal de JS, no algo especial que haya que activar.

---

## 18. Números: `parseInt`, `parseFloat`, `isNaN`, `Math.min`/`Math.max`

Los valores que vienen de un `<input>` HTML **siempre son strings**, aunque el input sea `type="number"`. Por eso hay que convertirlos explícitamente antes de operar con ellos como números.

Ejemplo real (`pages/admin/nuevo_producto.html`, script inline):
```js
const precio = parseFloat(document.getElementById("precio").value); // admite decimales
const stock = parseInt(document.getElementById("stock").value, 10); // entero; el "10" es la base (decimal)

const precioOk = !isNaN(precio) && precio >= 0;
const stockOk = !isNaN(stock) && Number.isInteger(stock) && stock >= 0;
```
- `parseFloat("199.99")` → `199.99`. `parseInt("199.99", 10)` → `199` (corta los decimales).
- `isNaN(x)` comprueba si algo **no** es un número válido (por ejemplo, si el campo quedó vacío, `parseFloat("")` da `NaN`, y `isNaN(NaN)` es `true`).
- `Number.isInteger(x)` es más estricto que solo comprobar que sea número: `Number.isInteger(3.5)` es `false`.

`Math.min`/`Math.max` para "encapsular" un valor dentro de un rango (`js/carrito.js`):
```js
item.qty = Math.max(1, Math.min(qty, product.stock));
```
Se lee de adentro hacia afuera: primero `Math.min(qty, product.stock)` asegura que nunca sea **mayor** al stock; después `Math.max(1, ...)` asegura que el resultado nunca sea **menor** a 1. Es el patrón clásico para "clampear" (acotar) un número entre un mínimo y un máximo.

**Para recordar:** siempre que leas `.value` de un input numérico, pásalo por `parseInt`/`parseFloat` antes de comparar o calcular — si no, `"5" + 1` da `"51"` (concatenación de texto), no `6`.

---

## 19. Funciones como parámetros (callbacks)

En JavaScript, las funciones son "ciudadanos de primera clase": se pueden guardar en variables, pasar como argumento a otra función, o devolver desde otra función. Cuando le pasas una función a otra para que la ejecute en el momento justo, a esa función que pasás se le llama **callback**.

Ya viste varios ejemplos arriba (`.find(function (p) {...})`, `.forEach(function (btn) {...})`, `addEventListener("click", function () {...})`) — en todos esos casos, **tú no llamas a esa función directamente**: se la entregas a otro método/API, y es ese método el que decide cuándo ejecutarla (por cada elemento del array, cuando ocurra el clic, etc).

Ejemplo real bien explícito, donde se ve claro que la función viaja como dato (`js/regiones.js`):
```js
selectRegion.addEventListener("change", function () {
  selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
  const regionSeleccionada = REGIONES.find(function (r) { return r.region === selectRegion.value; });
  if (!regionSeleccionada) return;
  regionSeleccionada.comunas.forEach(function (c) {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    selectComuna.appendChild(opt);
  });
});
```
Hay **tres niveles** de callback anidados acá: la función del evento `change`, adentro la función de `.find()`, y adentro de esa, la función de `.forEach()`. Cada una se ejecuta en un momento distinto y con un propósito distinto.

**Para recordar:** cuando veas `algo(function () { ... })`, pregúntate: "¿quién va a llamar a esta función, y cuándo?" — la respuesta nunca es "yo, ahora mismo": siempre es el método/API al que se la pasaste (el array, el elemento del DOM, el temporizador, etc.).

---

## 20. Ejercicios propuestos

Con el propio código de TecnoFactory como base, para practicar sin salir del proyecto:

1. **Arrays**: escribe una función `productosEnOferta()` que use `.filter()` para devolver solo los productos con `stock > 50` (simulando "mucho stock, hacemos oferta").
2. **Reduce**: escribe una función `stockTotal()` que sume el `stock` de *todos* los productos del catálogo con `.reduce()`.
3. **Template literals**: reescribe `mediaProductoHTML()` (en `productos.js`) usando backticks `` ` `` en vez de concatenación con `+`.
4. **Bug real**: aplica el fix que ya vimos a `iniciarSesion()` en `usuarios.js` (agregar `if (!usuario) return null;`) y prueba en la consola del navegador que ahora si devuelve `null` con credenciales incorrectas.
5. **Regex**: escribe una regex que valide que un `codigo` de producto tenga siempre el formato `TF-XX-000` (2 letras, guion, 3 números) y úsala en el formulario de `nuevo_producto.html`.
6. **DOM**: conecta un botón "Eliminar" en `pages/admin/producto.html` que llame a la función `eliminarProducto(codigo)` (ya existe en `productos.js`, pero no está conectada a ningún botón — ver la documentación de bugs conocidos).
7. **Closures**: en `detalle.js`, agrega una función `siguienteImagen()` que "recuerde" (closure) cuál es el índice de la imagen actual y avance a la siguiente al hacer clic en un botón "→".
