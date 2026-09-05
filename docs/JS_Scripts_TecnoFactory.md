# TecnoFactory — Guía de todos los archivos y scripts JavaScript

Este documento cubre **los 10 archivos `.js` de la carpeta `js/`** y **los 12 bloques `<script>` inline** que viven dentro de páginas HTML puntuales (no están en ningún `.js` propio, así que si no se documentan quedan "invisibles").

> Recordatorio de por qué esto importa: no hay módulos (`import`/`export`), todo son variables y funciones globales. El orden en que un `<script>` se carga en el HTML define qué funciones ya existen disponibles para el siguiente.

---

## Índice

**A. Archivos en `js/`**
1. [`productos.js`](#1-productosjs)
2. [`carrito.js`](#2-carritojs)
3. [`usuarios.js`](#3-usuariosjs)
4. [`admin-guard.js`](#4-admin-guardjs)
5. [`regiones.js`](#5-regionesjs)
6. [`catalogo.js`](#6-catalogojs)
7. [`detalle.js`](#7-detallejs)
8. [`home.js`](#8-homejs)
9. [`contacto.js`](#9-contactojs)
10. [`main.js`](#10-mainjs)

**B. Scripts inline (dentro de archivos `.html`)**
11. [`pages/tienda/iniciar_sesion.html`](#11-pagestiendainiciar_sesionhtml)
12. [`pages/tienda/registro_usuario.html`](#12-pagestiendaregistro_usuariohtml)
13. [`pages/tienda/carrito.html`](#13-pagestiendacarritohtml)
14. [`pages/admin/home.html`](#14-pagesadminhomehtml)
15. [`pages/admin/producto.html`](#15-pagesadminproductohtml)
16. [`pages/admin/nuevo_producto.html`](#16-pagesadminnuevo_productohtml)
17. [`pages/admin/editar_producto.html`](#17-pagesadmineditar_productohtml)
18. [`pages/admin/mostrar_producto.html`](#18-pagesadminmostrar_productohtml)
19. [`pages/admin/usuario.html`](#19-pagesadminusuariohtml)
20. [`pages/admin/nuevo_usuario.html`](#20-pagesadminnuevo_usuariohtml)
21. [`pages/admin/editar_usuario.html`](#21-pagesadmineditar_usuariohtml)
22. [`pages/admin/mostrar_usuario.html`](#22-pagesadminmostrar_usuariohtml)

**C. [Mapa de dependencias entre todos](#c-mapa-de-dependencias-entre-todos)**

---

## A. Archivos en `js/`

### 1. `productos.js`

**Rol:** fuente de datos del catálogo + funciones de ayuda para pintar productos. Es el archivo más grande e importante del proyecto.

**No depende de ningún otro script.** Debe cargarse antes que cualquiera que lo use (`carrito.js`, `catalogo.js`, `detalle.js`, `home.js`, y las páginas admin de productos).

| Elemento | Qué hace |
|---|---|
| `PRODUCTOS_KEY` | Constante `"tf_productos"`, la clave usada en `localStorage`. |
| `CATEGORIAS` | Arreglo con las 6 categorías posibles (`Notebooks`, `Audio`, `Accesorios`, `Monitores`, `Almacenamiento`, `Smartphones`). |
| `ICONOS_CATEGORIA` | Mapa categoría → emoji, usado como imagen de respaldo. |
| `PRODUCTOS_INICIALES` | Arreglo fijo de productos "de fábrica" (solo Notebooks y Smartphones cargados de ejemplo), cada uno con `codigo`, `nombre`, `categoria`, `descripcion`, `precio`, `stock`, `stockCritico` y `urls` (imágenes desde `cdn.dummyjson.com`). |
| `obtenerProductos()` | Lee `localStorage`; si está vacío, lo llena con `PRODUCTOS_INICIALES` y lo devuelve. |
| `guardarProducto(producto)` | Agrega un producto nuevo al arreglo guardado. |
| `actualizarProducto(codigo, datosNuevos)` | Busca por `codigo` y mezcla (`Object.assign`) los campos nuevos sobre el producto existente. |
| `eliminarProducto(codigo)` | Filtra el producto fuera del arreglo. ⚠️ *Función lista, pero sin ningún botón en la interfaz que la invoque todavía.* |
| `obtenerProductoPorCodigo(codigo)` | Búsqueda puntual, usada en fichas y formularios de edición. |
| `formatCLP(valor)` | `549990` → `"$549.990"` (usa `toLocaleString("es-CL")`). |
| `iconoCategoria(categoria)` | Devuelve el emoji de `ICONOS_CATEGORIA`, o 📦 si la categoría no está mapeada. |
| `escapeAttr(texto)` | Escapa `& " < >` para poder inyectar texto dinámico dentro de atributos HTML sin romper el marcado (protección básica contra HTML roto/XSS accidental al usar `innerHTML`). |
| `imagenesProducto(producto)` | Devuelve el arreglo de imágenes; soporta tanto el campo nuevo `urls` (array) como uno viejo `imagen` (string único), por compatibilidad con datos guardados antes. |
| `handleImgError(img, icono)` | Si una `<img>` no carga, la reemplaza en el DOM por un `<div>` con el emoji de categoría. |
| `mediaProductoHTML(producto)` | Arma el HTML de la imagen (o el emoji, si no hay ninguna) usado en tarjetas de catálogo, home y tabla admin. |
| `crearFilaImagen`, `iniciarCampoImagenes`, `leerCampoImagenes` | Trío de funciones que arman el campo "agregar 1 o más URLs de imagen con vista previa" que usan los formularios de nuevo/editar producto. |

---

### 2. `carrito.js`

**Rol:** toda la lógica del carrito de compras.

**Depende de:** `productos.js` (usa `obtenerProductoPorCodigo`).

| Elemento | Qué hace |
|---|---|
| `CART_KEY` | Constante `"tf_cart"`. |
| `getCart()` | Lee el carrito desde `localStorage`; si no existe o está corrupto, devuelve `[]` (con `try/catch`). |
| `saveCart(cart)` | Guarda el carrito y llama a `updateCartBadge()`. |
| `addToCart(codigo, qty)` | Valida stock disponible (sumando lo que ya había en el carrito) antes de agregar. Devuelve `{ ok, message }`. |
| `removeFromCart(codigo)` | Quita el producto por completo. |
| `updateCartQty(codigo, qty)` | Cambia la cantidad, siempre entre `1` y el stock disponible (`Math.max`/`Math.min`). |
| `cartTotalItems()` | Suma todas las cantidades (para el numerito del header). |
| `cartTotalPrice()` | Suma `precio × cantidad` de cada línea. |
| `updateCartBadge()` | Actualiza todos los elementos `[data-cart-count]` de la página actual. |
| Listener automático | `document.addEventListener("DOMContentLoaded", updateCartBadge)` — se ejecuta solo, en cualquier página que incluya este script. |

---

### 3. `usuarios.js`

**Rol:** usuarios, autenticación, sesión y validación de RUN chileno.

**No depende de ningún otro script.** Es requisito de `admin-guard.js` y de todas las páginas con login/registro/CRUD de usuarios.

| Elemento | Qué hace |
|---|---|
| `USUARIOS_KEY` / `SESION_KEY` | Constantes `"tf_usuarios"` y `"tf_sesion"`. |
| `USUARIO_ADMIN_BASE` | Usuario Administrador de fábrica: `admin@duoc.cl` / `admin123`, para poder entrar al panel la primera vez sin registrar nada a mano. |
| `obtenerUsuarios()` | Si no hay nada guardado, crea `[USUARIO_ADMIN_BASE]`. Además corre una **migración**: si detecta un admin con el correo viejo `@tecnofactory.cl` (de una versión anterior), lo actualiza al dominio válido; y si por algún motivo no queda ningún Administrador, agrega uno de respaldo. |
| `correoYaRegistrado(correo, idExcluir)` | Revisa duplicados sin distinguir mayúsculas/minúsculas; `idExcluir` permite ignorar al propio usuario al editar. |
| `guardarUsuario(usuario)` | Asigna `id = Date.now()` y lo agrega. |
| `actualizarUsuario(id, datosNuevos)` | Si `datosNuevos.contrasena` viene vacío, lo elimina del objeto antes de mezclar (para no borrar la contraseña existente). |
| `eliminarUsuario(id)` | Filtra el usuario fuera del arreglo. ⚠️ *Sin botón conectado en la interfaz todavía.* |
| `iniciarSesion(correo, contrasena)` | Busca coincidencia exacta de correo+contraseña y guarda la sesión (sin la contraseña) en `localStorage`. **Contiene el bug ya reportado**: si no encuentra usuario, igual devuelve un objeto `{}` (verdadero) en vez de `null`, porque `Object.assign({}, undefined)` da `{}`. Ver sección de "Bugs conocidos" más abajo. |
| `obtenerSesion()` | Lee la sesión activa desde `localStorage`. |
| `cerrarSesion()` | Borra `tf_sesion`. |
| `obtenerUsuarioPorId(id)` | Búsqueda puntual por id. |
| `validarRun(run)` | Limpia el RUN (saca puntos/guion), calcula el dígito verificador con el algoritmo módulo 11 chileno, y compara contra el dígito ingresado. |

---

### 4. `admin-guard.js`

**Rol:** "portero" del panel de administración: decide quién entra y qué ve cada rol.

**Depende de:** `usuarios.js` (usa `obtenerSesion`, `cerrarSesion`). **Se carga en el `<head>`** de cada página de `pages/admin/`, justo después de `usuarios.js`, para actuar *antes* de que la página termine de pintarse.

Es una IIFE (`(function () { ... })()`), o sea que todo su código corre inmediatamente al cargarse, no espera ningún evento para la parte de control de acceso.

| Elemento | Qué hace |
|---|---|
| `PAGINA_ACTUAL` | Nombre del archivo HTML actual, sacado de `location.pathname`. |
| `SOLO_ADMIN` | Lista de páginas que un Vendedor no puede abrir ni por URL directa: `usuario.html`, `nuevo_usuario.html`, `editar_usuario.html`, `mostrar_usuario.html`, `nuevo_producto.html`, `editar_producto.html`. |
| Chequeo de sesión | Si no hay sesión, o es de tipo `Cliente`, redirige de inmediato a `../tienda/iniciar_sesion.html` (`location.replace`, para no dejar la página protegida en el historial del navegador). |
| Chequeo de rol Vendedor | Si `sesion.tipo === "Vendedor"` y `PAGINA_ACTUAL` está en `SOLO_ADMIN`, redirige a `producto.html`. Si no, inyecta un `<style>` que oculta con `display:none !important` todo lo marcado `data-admin-only`, y agrega la clase `role-vendedor` al `<html>`. |
| Al terminar de cargar (`DOMContentLoaded`) | Rellena `.admin-nav-bottom` con el nombre/tipo de quien inició sesión y el botón "🚪 Cerrar sesión" (que llama a `cerrarSesion()` y redirige al login). |

---

### 5. `regiones.js`

**Rol:** dataset fijo de regiones/comunas de Chile + función para poblar selects dependientes.

**No depende de nada.** Lo usan los formularios que piden Región/Comuna: `registro_usuario.html`, `nuevo_usuario.html`, `editar_usuario.html`.

| Elemento | Qué hace |
|---|---|
| `REGIONES` | Arreglo de 5 objetos `{ region, comunas: [...] }` (Metropolitana, Valparaíso, Biobío, Coquimbo, Araucanía — es un dataset de ejemplo, no las 16 regiones reales del país). |
| `poblarRegiones(selectRegionId, selectComunaId)` | Llena el `<select>` de región con las 5 opciones; al cambiar la región (evento `change`), repuebla el `<select>` de comuna con las comunas correspondientes. |

---

### 6. `catalogo.js`

**Rol:** pinta la grilla de productos con filtros por categoría, específicamente en `pages/tienda/productos.html`.

**Depende de:** `productos.js` (`obtenerProductos`, `mediaProductoHTML`, `formatCLP`) y `carrito.js` (`addToCart`).

| Elemento | Qué hace |
|---|---|
| Guard inicial | `if (!grid) return;` — si la página no tiene `#grid-productos`, el script no hace nada (por si se incluyera sin querer en otra página). |
| `pintarProductos(categoria)` | Filtra el catálogo (`"todos"` o una categoría puntual), reconstruye las tarjetas del grid, y muestra/oculta `#sin-resultados` según haya o no productos. Cada tarjeta trae un botón "Añadir al carrito" (o "Sin stock" si `stock === 0`). |
| Listener de "Añadir al carrito" | Cada clic llama `addToCart(codigo, 1)`, cambia el texto del botón a "¡Añadido!" o al mensaje de error, y lo restaura después de 1.5s. |
| Listeners de filtro | Cada botón `.filter-btn` marca su propio estado `active` y vuelve a llamar `pintarProductos()` con la categoría de su atributo `data-categoria`. |
| Llamada inicial | `pintarProductos("todos")` al cargar la página. |

---

### 7. `detalle.js`

**Rol:** arma la ficha completa de un producto en `pages/tienda/detalle_productos.html`, leyendo el código desde la URL (`?codigo=TF-NB-001`).

**Depende de:** `productos.js` (varias funciones) y `carrito.js` (`addToCart`).

| Elemento | Qué hace |
|---|---|
| Lectura de la URL | `new URLSearchParams(window.location.search).get("codigo")`. Si no hay producto con ese código, muestra `#producto-error` y corta la ejecución. |
| Datos básicos | Rellena título de la pestaña, categoría, nombre, descripción y precio formateado. |
| Galería de imágenes | Si el producto no tiene imágenes, muestra el emoji de categoría en grande. Si tiene una o más, muestra la primera como imagen principal y, si hay más de una, arma miniaturas clicleables (`.product-thumb`) que cambian la imagen principal al hacer clic. |
| Stock | Si `stock <= 0`: deshabilita cantidad y botón de compra. Si `stock <= stockCritico`: muestra aviso de "quedan solo X unidades". Si no: muestra el stock normal. |
| Especificaciones | Arma dinámicamente filas con Código, Categoría y Stock disponible. |
| Selector de cantidad | Botones `+`/`−` respetan el mínimo `1` y el máximo `stock`. |
| Botón "Agregar al carrito" | Llama `addToCart(codigo, cantidad)` y muestra el mensaje de resultado (verde si `ok`, rojo si no). |

---

### 8. `home.js`

**Rol:** pinta la sección "Productos Más Vendidos" del `index.html`.

**Depende de:** `productos.js` (`obtenerProductos`, `mediaProductoHTML`, `formatCLP`).

| Elemento | Qué hace |
|---|---|
| Guard inicial | `if (!contenedor) return;` sobre `#productos-destacados`. |
| Lógica | Toma los primeros 8 productos del catálogo (`.slice(0, 8)`) — no hay ningún criterio real de "más vendidos", simplemente muestra los primeros del arreglo — y arma una tarjeta Bootstrap (`col`, `card`, `card-body`) por cada uno, con enlace a `detalle_productos.html?codigo=...`. |

---

### 9. `contacto.js`

**Rol:** valida en el navegador el formulario de `pages/tienda/contacto.html` (no hay envío real, no hay backend).

**No depende de ningún otro script.**

| Elemento | Qué hace |
|---|---|
| Guard inicial | `if (!form) return;` sobre `#form-contacto`. |
| `DOMINIOS_PERMITIDOS` | `["duoc.cl", "profesor.duoc.cl", "gmail.com"]`. |
| `setFieldState(fieldId, isValid, hasValue)` | Agrega/quita las clases `.valid`/`.invalid`; si el campo es opcional (correo) y está vacío, no lo marca como error. |
| `validarNombre()` | No vacío, máx. 100 caracteres. |
| `correoTieneDominioValido(valor)` / `validarCorreo()` | Correo **opcional**: vacío no es error; si se llena, debe tener formato básico `algo@dominio.tld` y el dominio debe estar en la lista permitida. |
| `validarComentario()` | No vacío, máx. 500 caracteres; además actualiza un contador de caracteres en vivo. |
| Validación en vivo | Cada campo se revalida en su propio evento `input`, para feedback inmediato mientras se escribe. |
| `submit` | `e.preventDefault()` (no hay backend); si los 3 campos son válidos, muestra mensaje de éxito y resetea el formulario; si no, muestra "Revisa los campos marcados en rojo". |

---

### 10. `main.js`

**Rol:** el script más pequeño y el único que se incluye en **todas** las páginas del sitio sin excepción — controla el menú hamburguesa responsive.

**No depende de nada.**

```js
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
});
```
Al hacer clic en el botón ☰, alterna la clase `.open` sobre `.nav-links` (que el CSS usa para mostrar/ocultar el menú en mobile) y actualiza `aria-expanded` para accesibilidad.

---

## B. Scripts inline (dentro de archivos `.html`)

Estos **no son archivos `.js` separados**: es código JavaScript escrito directamente entre etiquetas `<script>...</script>` en el propio HTML de la página. Cada uno solo existe y corre en esa página puntual.

### 11. `pages/tienda/iniciar_sesion.html`

**Depende de:** `usuarios.js` (cargado antes en la misma página).

Valida formato de correo (dominio permitido) y largo de contraseña (4-10 caracteres) en el propio formulario; si el formato es válido, llama a `iniciarSesion(correo, contrasena)`. Si la sesión resultante es de tipo `Administrador` o `Vendedor`, redirige a `../admin/home.html`; si no, a `../../index.html`. *(Contiene el bug de `iniciarSesion` descrito antes: el chequeo `if (!sesion)` nunca detecta credenciales incorrectas.)*

### 12. `pages/tienda/registro_usuario.html`

**Depende de:** `regiones.js` y `usuarios.js`.

Al cargar, llama a `poblarRegiones("region", "comuna")`. Al enviar, valida: RUN (`validarRun`), nombre, apellidos, correo (formato + dominio + `!correoYaRegistrado`), contraseña + confirmación, región, comuna y dirección. Si todo pasa, llama `guardarUsuario({ ...datos, tipo: "Cliente" })` y redirige a `iniciar_sesion.html`.

### 13. `pages/tienda/carrito.html`

**Depende de:** `productos.js` y `carrito.js`.

Función interna `pintarCarrito()`: si el carrito está vacío muestra `#carrito-vacio`; si no, arma una fila por producto con controles de cantidad (`+`/`−`/input numérico) y botón "Quitar", cada uno conectado a `updateCartQty`/`removeFromCart`, y vuelve a pintar todo tras cada cambio. El botón "Pagar" es una **simulación**: muestra un mensaje de éxito, vacía el carrito (`localStorage.removeItem(CART_KEY)`) y actualiza el badge — no hay pasarela de pago real.

### 14. `pages/admin/home.html`

**Depende de:** `usuarios.js` (cargado en el `<head>`, protegido por `admin-guard.js`).

Es el más simple de todos: solo lee `obtenerSesion()` y, si existe, escribe `"¡Hola, {nombre}!"` en `#saludo-admin`.

### 15. `pages/admin/producto.html`

**Depende de:** `productos.js`.

Lista todos los productos (`obtenerProductos()`) en una tabla, con miniatura (`mediaProductoHTML`), badge de stock (verde/crítico según `stockCritico`), y botones "Ver"/"Editar" (este último marcado `data-admin-only`, oculto para Vendedores por `admin-guard.js`).

### 16. `pages/admin/nuevo_producto.html`

**Depende de:** `productos.js`.

Llena el `<select>` de categoría con `CATEGORIAS` y arma el bloque de imágenes con `iniciarCampoImagenes("lista-imagenes", "btn-agregar-imagen", [])`. Al enviar: valida código (mín. 3 caracteres y que no exista ya, vía `obtenerProductoPorCodigo`), nombre, descripción (máx. 500), precio (≥0), stock (entero ≥0), stock crítico (opcional, entero ≥0) y categoría. Si todo es válido, llama `guardarProducto({...})` y redirige a `producto.html`.

### 17. `pages/admin/editar_producto.html`

**Depende de:** `productos.js`.

Lee `?codigo=` de la URL; si no existe el producto, reemplaza el contenido por un mensaje de error. Si existe, precarga todos los campos del formulario (incluyendo las imágenes ya guardadas, vía `imagenesProducto`) y, al guardar, corre las mismas validaciones que `nuevo_producto.html` (menos la de código, que es de solo lectura aquí) y llama `actualizarProducto(codigo, {...})`.

### 18. `pages/admin/mostrar_producto.html`

**Depende de:** `productos.js`.

Vista de solo lectura: pinta la imagen principal + miniaturas (si hay más de una imagen) y una ficha con Código, Nombre, Descripción, Categoría, Precio y Stock/Stock crítico. El botón "Editar" (marcado `data-admin-only`) apunta a `editar_producto.html?codigo=...`.

### 19. `pages/admin/usuario.html`

**Depende de:** `usuarios.js` (ya cargado antes en el `<head>` de la página).

Lista todos los usuarios (`obtenerUsuarios()`) en una tabla con RUN, nombre completo, correo, un badge de `tipo` (con clase CSS según el rol) y comuna. Botones "Ver"/"Editar" enlazan a `mostrar_usuario.html?id=` y `editar_usuario.html?id=`.

### 20. `pages/admin/nuevo_usuario.html`

**Depende de:** `regiones.js` y `usuarios.js`.

Igual que el registro público, pero agrega un `<select>` de `tipo` (Administrador/Vendedor/Cliente) y no exige "confirmar contraseña". Valida RUN, nombre, apellidos, correo (+ no duplicado), contraseña, tipo, región, comuna y dirección; si es válido llama `guardarUsuario({...})` y redirige a `usuario.html`.

### 21. `pages/admin/editar_usuario.html`

**Depende de:** `regiones.js` y `usuarios.js`.

Lee `?id=` de la URL; si no existe el usuario, muestra error. Si existe, precarga el formulario (incluyendo región/comuna, disparando manualmente el evento `change` de región y usando un `setTimeout(...,0)` para fijar la comuna **después** de que `poblarRegiones` termine de llenar sus opciones). Valida igual que el alta, con dos diferencias: la contraseña es **opcional** (si se deja vacía, no se valida ni se cambia) y la verificación de correo duplicado se hace excluyendo al propio usuario (`correoYaRegistrado(correo, id)`). Llama `actualizarUsuario(id, {...})`.

### 22. `pages/admin/mostrar_usuario.html`

**Depende de:** `usuarios.js`.

Vista de solo lectura: lee `?id=` de la URL, busca con `obtenerUsuarioPorId(id)` y pinta RUN, nombre, apellidos, correo, fecha de nacimiento, tipo, región, comuna y dirección. El botón "Editar" apunta a `editar_usuario.html?id=...`.

---

## C. Mapa de dependencias entre todos

```
productos.js  ─────────┬──> carrito.js ──┬──> catalogo.js
   (sin deps)          │                 ├──> detalle.js
                        │                 └──> (inline) pages/tienda/carrito.html
                        └──> home.js
                        └──> (inline) producto.html / nuevo_producto.html /
                                       editar_producto.html / mostrar_producto.html

usuarios.js  ───────────┬──> admin-guard.js ──> (todas las páginas de pages/admin/)
   (sin deps)           ├──> (inline) iniciar_sesion.html
                        ├──> (inline) registro_usuario.html
                        ├──> (inline) home.html / usuario.html / nuevo_usuario.html /
                        │              editar_usuario.html / mostrar_usuario.html

regiones.js  ───────────┬──> (inline) registro_usuario.html
   (sin deps)           └──> (inline) nuevo_usuario.html / editar_usuario.html

contacto.js  ── (sin deps, autocontenido) ──> solo pages/tienda/contacto.html

main.js      ── (sin deps, autocontenido) ──> todas las páginas del sitio
```

---

## Recordatorio de bugs conocidos (documentados en la conversación anterior)

- **`iniciarSesion()`** (en `usuarios.js`) siempre devuelve un objeto truthy (`{}`) aunque no encuentre coincidencia, por usar `Object.assign({}, usuario)` con `usuario === undefined`. Esto rompe la validación `if (!sesion)` en `pages/tienda/iniciar_sesion.html` y además sobrescribe cualquier sesión válida existente. Fix sugerido: agregar `if (!usuario) return null;` justo antes de construir el objeto `sesion`.
- **`eliminarProducto()`** y **`eliminarUsuario()`** existen en `productos.js`/`usuarios.js` pero ningún botón de la interfaz las invoca todavía.
