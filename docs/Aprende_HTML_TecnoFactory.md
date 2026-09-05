# Aprende HTML con los ejemplos reales de TecnoFactory

Misma lógica que las otras dos guías (CSS y JavaScript): **cada concepto se explica con una línea que ya existe en alguna página del proyecto** (`pages/tienda/*.html` o `pages/admin/*.html`), con el archivo y el motivo real por el que está escrita así.

> 💡 Dato importante antes de empezar: casi todas las páginas de la tienda y del panel de administración están escritas en **HTML "cascarón"**: el `<body>` trae la estructura, los textos fijos y algunos elementos vacíos con `id`, pero el **contenido que varía** (productos, filas de tabla, mensajes de error) lo llena el JavaScript en tiempo de ejecución. Vas a ver muchos `<div id="algo"></div>` vacíos a propósito — eso es normal en este proyecto, no un HTML incompleto.

---

## Índice

1. [Estructura mínima de un documento HTML](#1-estructura-mínima-de-un-documento-html)
2. [`<meta charset>` y `<meta viewport>`](#2-meta-charset-y-meta-viewport)
3. [`<link>` y `<script>`: orden de carga](#3-link-y-script-orden-de-carga)
4. [Etiquetas semánticas: `header`, `nav`, `main`, `footer`, `section`](#4-etiquetas-semánticas-header-nav-main-footer-section)
5. [Enlaces (`<a>`) y rutas relativas](#5-enlaces-a-y-rutas-relativas)
6. [Listas (`<ul>`/`<li>`) para menús](#6-listas-ulli-para-menús)
7. [Atributos ARIA y accesibilidad](#7-atributos-aria-y-accesibilidad)
8. [Atributos `data-*` personalizados](#8-atributos-data--personalizados)
9. [Formularios: `<label>`, `<input>` y sus `type`](#9-formularios-label-input-y-sus-type)
10. [Validación nativa vs. `novalidate` + JS propio](#10-validación-nativa-vs-novalidate--js-propio)
11. [El patrón "campo + hint + mensaje de error"](#11-el-patrón-campo--hint--mensaje-de-error)
12. [`<select>` y `<option>`](#12-select-y-option)
13. [Tablas: `<table>`, `<thead>`, `<tbody>`, `colspan`](#13-tablas-table-thead-tbody-colspan)
14. [Imágenes: `<img>`, `alt`, y `src` vacío a propósito](#14-imágenes-img-alt-y-src-vacío-a-propósito)
15. [`<button>` vs. `<a>`: cuándo usar cada uno](#15-button-vs-a-cuándo-usar-cada-uno)
16. [`id` vs. `class`: dos propósitos distintos](#16-id-vs-class-dos-propósitos-distintos)
17. [El patrón "cascarón vacío + JS lo llena"](#17-el-patrón-cascarón-vacío--js-lo-llena)
18. [Comentarios HTML](#18-comentarios-html)
19. [Emojis como íconos, sin librerías](#19-emojis-como-íconos-sin-librerías)
20. [Errores reales a evitar](#20-errores-reales-a-evitar)
21. [Ejercicios propuestos](#21-ejercicios-propuestos)

---

## 1. Estructura mínima de un documento HTML

Todo documento HTML5 válido empieza igual: la declaración de tipo de documento, la etiqueta raíz con su idioma, una cabeza (`<head>`, metadatos que no se ven) y un cuerpo (`<body>`, lo que sí se ve).

Ejemplo real, tal cual empieza `productos.html`:
```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Productos — Tecno Factory</title>
<link rel="stylesheet" href="../../css/estilos.css">
</head>
<body>
...
</body>
</html>
```

`lang="es"` no es decorativo: le dice al navegador (y a lectores de pantalla) en qué idioma está el contenido, lo cual afecta cosas como la pronunciación de un lector de pantalla o las sugerencias de corrección ortográfica.

**Para recordar:** `<!DOCTYPE html>` (sin nada más) es la forma moderna de decir "esto es HTML5" — versiones viejas de HTML tenían declaraciones mucho más largas y complicadas.

---

## 2. `<meta charset>` y `<meta viewport>`

Dos `<meta>` que aparecen en **todas** las páginas del proyecto, siempre como las dos primeras líneas del `<head>`:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- `charset="UTF-8"` le dice al navegador qué codificación de caracteres usar para interpretar el archivo. Sin esto (o con la codificación equivocada), las tildes y la `ñ` de textos como "Región" o "Dirección" se verían como símbolos raros.
- `viewport` es la que hace que el sitio sea usable en celular: `width=device-width` iguala el ancho de la página al ancho real de la pantalla del dispositivo (en vez de simular una pantalla de escritorio y luego achicarla), e `initial-scale=1.0` arranca sin zoom aplicado.

**Para recordar:** `charset` debe ir **lo antes posible** dentro del `<head>` (idealmente la primera línea), porque el navegador necesita saber la codificación antes de terminar de leer el resto del archivo.

---

## 3. `<link>` y `<script>`: orden de carga

El orden en que aparecen los `<link>` (hojas de estilo) y `<script>` (JavaScript) dentro del `<head>` **importa**, porque el navegador los procesa en ese mismo orden.

Ejemplo real — una página del panel de admin carga primero la hoja de estilos base y **después** la del admin, para que esta última pueda reusar las variables de la primera (ver la guía de CSS, sección 1):
```html
<!-- admin/producto.html -->
<link rel="stylesheet" href="../../css/estilos.css">
<link rel="stylesheet" href="../../css/admin.css">
<script src="../../js/usuarios.js"></script>
<script src="../../js/admin-guard.js"></script>
```

`admin-guard.js` se carga **después** de `usuarios.js` a propósito, porque seguramente necesita funciones que `usuarios.js` ya definió (por ejemplo, para revisar si hay una sesión de administrador activa antes de dejar ver la página) — si el orden fuera al revés, esas funciones todavía no existirían cuando `admin-guard.js` las necesita.

**Para recordar:** un `<script>` puesto en el `<head>` (sin `defer` ni `async`) **bloquea** el resto de la carga de la página hasta que termina de descargarse y ejecutarse — por eso en proyectos más grandes es común mover los scripts al final del `<body>`, aunque este proyecto los deja en el `<head>` por simplicidad.

---

## 4. Etiquetas semánticas: `header`, `nav`, `main`, `footer`, `section`

Las etiquetas semánticas describen **qué es** cada parte de la página (no solo cómo se ve), lo cual ayuda tanto a la accesibilidad (lectores de pantalla pueden "saltar" directo al `<main>` o al `<nav>`) como a la lectura del propio código.

Ejemplo real, la estructura completa de casi cualquier página de la tienda (`detalle_productos.html`):
```html
<header class="site-header">
  <div class="wrap nav">
    ...
  </div>
</header>

<main>
  <section class="page-head wrap">
    ...
  </section>
  <section class="section wrap">
    ...
  </section>
</main>

<footer class="site-footer">
  ...
</footer>
```

Notá que `.nav` es una **clase** para darle estilo de flexbox (ver guía de CSS), mientras que `<nav>` sería la etiqueta semántica — en este proyecto, el `<div class="wrap nav">` está dentro de un `<header>`, y no se usa la etiqueta `<nav>` como tal para el contenedor principal del menú; sí se usa, en cambio, para la barra lateral del panel de admin:
```html
<!-- admin/home.html -->
<nav class="admin-sidebar">
  <div class="admin-nav-top">...</div>
  <div class="admin-nav-bottom">...</div>
</nav>
```

**Para recordar:** `<main>` debería aparecer **una sola vez** por página, y agrupa el contenido principal (todo lo que no es header/footer repetido en cada página). `<section>` agrupa un bloque temático dentro de esa página (acá se usa para el encabezado de página `.page-head` y para cada bloque de contenido `.section`).

---

## 5. Enlaces (`<a>`) y rutas relativas

Un enlace (`<a href="...">`) puede apuntar a otra página del mismo sitio con una **ruta relativa** (relativa a dónde está el archivo actual), en vez de escribir la URL completa.

Ejemplo real — desde cualquier página de `pages/tienda/`, el logo vuelve al home subiendo dos niveles de carpetas (`../../`), y el resto de los links del menú se quedan en la misma carpeta (`tienda/`), así que no necesitan ningún prefijo:
```html
<!-- tienda/productos.html -->
<a href="../../index.html" class="logo">...</a>
<ul class="nav-links">
  <li><a href="../../index.html">Inicio</a></li>
  <li><a href="productos.html" aria-current="page">Productos</a></li>
  <li><a href="nosotros.html">Nosotros</a></li>
</ul>
```
`../../` significa "subí dos carpetas desde donde está este archivo" (de `pages/tienda/` a la raíz del proyecto), y desde ahí entra a `index.html`.

En la ficha de producto también se usa un link para "volver atrás" dentro del mismo `eyebrow` (`detalle_productos.html`):
```html
<span class="eyebrow"><a href="productos.html">← Volver al catálogo</a></span>
```

**Para recordar:** las rutas relativas dependen de **dónde vive el archivo que las escribe**, no de dónde vive el archivo al que apuntan. Por eso todas las páginas de `pages/tienda/` usan `../../index.html` (2 niveles hacia arriba), y las de `pages/admin/` también, porque están a la misma profundidad de carpetas.

---

## 6. Listas (`<ul>`/`<li>`) para menús

Un menú de navegación es, semánticamente, una **lista** de enlaces — aunque visualmente (por CSS) no se vea como viñetas, sigue siendo la etiqueta correcta porque *es* una colección de ítems relacionados.

Ejemplo real (`estilos.css` le quita el estilo de lista por defecto con `list-style:none`, pero el HTML sigue usando `<ul>`/`<li>`):
```html
<ul class="nav-links">
  <li><a href="../../index.html">Inicio</a></li>
  <li><a href="productos.html" aria-current="page">Productos</a></li>
  <li><a href="nosotros.html">Nosotros</a></li>
  <li><a href="blogs.html">Blogs</a></li>
  <li><a href="contacto.html">Contacto</a></li>
</ul>
```

Otro uso real, esta vez para datos de contacto en el footer (no son enlaces, solo texto agrupado):
```html
<ul>
  <li>hola@tecnofactory.cl</li>
  <li>+56 9 1234 5678</li>
  <li>Santiago, Chile</li>
</ul>
```

**Para recordar:** usar `<ul>`/`<li>` para un menú (en vez de, por ejemplo, una fila de `<div>` o `<a>` sueltos) es lo que le permite a un lector de pantalla anunciar "lista de 5 elementos" antes de leerla, dándole al usuario una idea de qué esperar.

---

## 7. Atributos ARIA y accesibilidad

ARIA (*Accessible Rich Internet Applications*) es un conjunto de atributos que agregan información de accesibilidad que el HTML normal no puede expresar por sí solo — muy usados en este proyecto.

Ejemplos reales, todos de `productos.html`:
```html
<!-- Oculta un elemento puramente decorativo de los lectores de pantalla -->
<span class="logo-mark" aria-hidden="true"></span>

<!-- Le da un nombre accesible a un botón que solo tiene un ícono/emoji -->
<button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false">☰</button>

<!-- Marca cuál es la página actual dentro de un menú -->
<a href="productos.html" aria-current="page">Productos</a>

<!-- Describe qué hace un enlace que visualmente solo muestra un carrito y un número -->
<a href="carrito.html" class="cart-btn" aria-label="Ver carrito de compras">
  🛒 Carrito <span class="cart-count" data-cart-count>0</span>
</a>
```

`aria-expanded="false"` en el botón `☰` es particularmente importante: le informa a un lector de pantalla si el menú que ese botón controla está actualmente desplegado o no (el JS del menú debería cambiarlo a `"true"` al abrirlo, aunque conviene revisar que efectivamente lo haga).

**Para recordar:** `aria-hidden="true"` es para elementos **puramente visuales** que no aportan información (como el logo-mark, que es solo una forma geométrica); `aria-label` es para darle un nombre accesible a algo que no tiene texto propio suficientemente descriptivo (un botón con solo un ícono).

---

## 8. Atributos `data-*` personalizados

Un atributo `data-algo="valor"` es la forma estándar de guardar información **propia** en una etiqueta HTML, para que JavaScript (o CSS) la pueda leer, sin inventar atributos que no existen en el estándar HTML.

Ejemplo real — cada botón de filtro de categoría lleva su propia categoría en un atributo `data-*`, y `catalogo.js` lee ese valor para saber qué mostrar (`productos.html`):
```html
<div class="category-filters" id="filtros-categoria">
  <button class="filter-btn active" type="button" data-categoria="todos">Todos</button>
  <button class="filter-btn" type="button" data-categoria="Notebooks">Notebooks</button>
  <button class="filter-btn" type="button" data-categoria="Audio">Audio</button>
</div>
```
Desde JavaScript, ese valor se lee con `boton.dataset.categoria` (que convierte automáticamente `data-categoria` en la propiedad `categoria` del objeto `dataset`).

Otro ejemplo real, un contador que el JS del carrito actualiza cada vez que cambia algo (`carrito.html`):
```html
<span class="cart-count" data-cart-count>0</span>
```
Acá `data-cart-count` no tiene ni siquiera un valor (es un atributo "booleano" personalizado) — solo sirve como un **gancho** para que `carrito.js` pueda encontrar ese `<span>` con `document.querySelector("[data-cart-count]")` sin depender de una clase que también tenga fines de estilo.

Y en el panel de admin, un link que solo debería verse si el usuario es administrador (`admin/home.html`):
```html
<a href="usuario.html" data-admin-only><span class="icon">👤</span> Usuarios</a>
```

**Para recordar:** los atributos `data-*` son la forma "oficial" de HTML5 de adjuntar datos personalizados a un elemento — a diferencia de usar una clase con fines dobles (estilo + lógica), o de inventar un atributo que no es válido en HTML.

---

## 9. Formularios: `<label>`, `<input>` y sus `type`

Cada campo de un formulario real de este proyecto sigue el mismo patrón: un `<label>` conectado al `<input>` por el atributo `for`/`id`, y un `type` de input que coincide con el tipo de dato esperado (esto le da al navegador — sobre todo en celular — pistas sobre qué teclado mostrar y qué validar).

Ejemplo real, con varios `type` distintos usados a propósito (`registro_usuario.html`):
```html
<div class="field" id="field-run">
  <label for="run">RUN</label>
  <span class="hint">Sin puntos ni guion. Ej: 190110228</span>
  <input type="text" id="run" name="run" maxlength="9" required>
  <span class="error-msg">RUN inválido, revisa el dígito verificador.</span>
</div>

<div class="field" id="field-correo">
  <label for="correo">Correo</label>
  <input type="email" id="correo" name="correo" maxlength="100" required>
</div>

<div class="field" id="field-contrasena">
  <label for="contrasena">Contraseña</label>
  <input type="password" id="contrasena" name="contrasena" maxlength="10" required>
</div>

<div class="field" id="field-telefono">
  <label for="telefono">Teléfono</label>
  <input type="tel" id="telefono" name="telefono" maxlength="15">
</div>

<div class="field" id="field-fecha">
  <label for="fecha_nacimiento">Fecha de nacimiento</label>
  <input type="date" id="fecha_nacimiento" name="fecha_nacimiento">
</div>
```

`for="run"` en el `<label>` debe coincidir **exactamente** con el `id="run"` del `<input>` — esa conexión es lo que permite que, al hacer clic en el texto del label, el foco salte directo al campo (y es obligatoria para que un lector de pantalla anuncie qué campo es cuál).

**Para recordar:** `type="email"`, `type="tel"`, `type="date"` no son solo una convención visual: activan validación y teclados específicos del navegador (por ejemplo, `type="email"` muestra el `@` en el teclado numérico de un celular), algo que `type="text"` no hace.

---

## 10. Validación nativa vs. `novalidate` + JS propio

HTML puede validar formularios solo (con `required`, `type="email"`, `maxlength`, etc.), pero este proyecto **desactiva** esa validación nativa a propósito y la reemplaza por su propia lógica en JavaScript, para tener control total sobre los mensajes y el momento en que aparecen.

Ejemplo real (`registro_usuario.html`):
```html
<form class="form" id="form-registro" novalidate style="max-width:560px; margin:0 auto;">
```
El atributo `novalidate` le dice al navegador: "no muestres tus propios globos de error nativos al enviar este formulario, yo me encargo". El proyecto sigue usando `required`, `maxlength`, `type="email"`, etc. en cada input (son útiles como documentación y como respaldo), pero el navegador no los usa para bloquear el envío — eso lo hace el JS de validación (`registro.js`), que agrega o quita las clases `.invalid`/`.valid` que vimos en la guía de CSS.

**Para recordar:** `novalidate` va en el `<form>`, no en cada `<input>` — apaga la validación automática del navegador para **todo** el formulario de una sola vez.

---

## 11. El patrón "campo + hint + mensaje de error"

Un mismo bloque de 3-4 etiquetas se repite para **cada** campo de cada formulario del proyecto, siempre en el mismo orden: `label` → (opcional) `hint` → `input` → `error-msg`.

Ejemplo real completo (`registro_usuario.html`):
```html
<div class="field" id="field-correo">
  <label for="correo">Correo</label>
  <span class="hint">Solo dominios @duoc.cl, @profesor.duoc.cl o @gmail.com</span>
  <input type="email" id="correo" name="correo" maxlength="100" required>
  <span class="error-msg">Correo inválido, dominio no permitido, o ya está registrado.</span>
</div>
```
- `.hint` explica **antes** de escribir qué formato se espera (para prevenir el error).
- `.error-msg` explica **después** de un intento fallido qué salió mal (para corregir el error) — y, como vimos en la guía de CSS, solo se hace visible cuando el `.field` padre tiene la clase `.invalid`.

Este patrón repetido es lo que hace que el CSS pueda apuntar siempre a `.field .error-msg` y `.field.invalid` sin importar de qué campo se trate — la consistencia en el HTML es lo que permite tener reglas de CSS genéricas en vez de una por campo.

**Para recordar:** repetir la misma estructura de HTML para cada campo (en vez de variarla "un poco" campo a campo) es lo que hace posible reutilizar el mismo CSS y el mismo JS de validación para todos.

---

## 12. `<select>` y `<option>`

Un `<select>` agrupa varias `<option>`; el usuario elige una y el valor seleccionado es el que se envía (o el que lee el JS).

Ejemplo real — el `<select>` de región empieza con una opción vacía a propósito, para forzar a que el usuario elija activamente una región en vez de que quede una preseleccionada por accidente (`registro_usuario.html`):
```html
<div class="field" id="field-region">
  <label for="region">Región</label>
  <select id="region" name="region" required>
    <option value="">Selecciona una región</option>
  </select>
  <span class="error-msg">Selecciona una región.</span>
</div>
```
Notá que el `<select>` de región solo trae **esa** opción vacía en el HTML — el resto de las regiones seguramente las agrega un script (`ubicaciones.js` o similar) en tiempo de ejecución, otra vez el patrón de "cascarón + JS lo llena" (sección 17).

**Para recordar:** `<option value="">texto</option>` como primera opción, combinado con `required` en el `<select>`, es la forma estándar de decir "el usuario tiene que elegir algo, no vale dejarlo en el valor por defecto".

---

## 13. Tablas: `<table>`, `<thead>`, `<tbody>`, `colspan`

Una tabla HTML separa el **encabezado** (`<thead>`) del **cuerpo** (`<tbody>`), incluso aunque visualmente ambos sean parte de la misma tabla — esto le permite a un lector de pantalla (o a un usuario) distinguir "esto es un título de columna" de "esto es un dato".

Ejemplo real, el listado de productos del panel de admin (`admin/producto.html`):
```html
<table class="admin-table">
  <thead>
    <tr>
      <th></th>
      <th>Código</th>
      <th>Nombre</th>
      <th>Categoría</th>
      <th>Precio</th>
      <th>Stock</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody id="tabla-productos">
  </tbody>
</table>
```
El `<tbody>` está **vacío en el HTML** y trae un `id` — de nuevo el patrón "cascarón": `productos.js` construye cada `<tr>` con JavaScript y los inserta ahí adentro.

Ejemplo real de `colspan`, usado para un mensaje que debe ocupar **todas** las columnas de la tabla cuando no hay datos (visto en el propio script inline de `admin/producto.html`):
```html
<tr><td colspan="7">Aún no hay productos cargados.</td></tr>
```
`colspan="7"` le dice a esa única celda que ocupe el ancho de 7 columnas (las mismas 7 que tiene el `<thead>`), en vez de dejar 6 celdas vacías al lado.

**Para recordar:** una tabla bien armada siempre tiene la misma cantidad de columnas en el `<thead>` y en cada `<tr>` del `<tbody>` — si una fila necesita ocupar menos celdas de las que hay columnas (como el mensaje de "no hay datos"), `colspan` es la forma correcta de resolverlo, no dejar celdas faltantes.

---

## 14. Imágenes: `<img>`, `alt`, y `src` vacío a propósito

El atributo `alt` describe la imagen en texto — es lo que lee un lector de pantalla, lo que se muestra si la imagen no carga, y lo que usan los buscadores para entender qué hay en la imagen.

Ejemplo real con `alt` descriptivo (footer, `productos.html`):
```html
<img src="https://e7.pngegg.com/pngimages/882/375/png-clipart-wikipedia-logo-visa-graphics-credit-card-the-african-grassland-blue-text.png" alt="Visa">
```

Ejemplo real con `src` y `alt` **vacíos a propósito**, porque el JS los completa después de saber qué producto se está mostrando (`detalle_productos.html`):
```html
<div class="media media--square">
  <img id="producto-imagen" src="" alt="">
</div>
```
`detalle.js` hace algo como `img.src = producto.urls[0]` y `img.alt = producto.nombre` una vez que sabe qué producto cargar desde la URL de la página. Dejar `src=""` (en vez de omitir el atributo) evita que el navegador intente cargar una imagen rota mientras tanto.

**Para recordar:** un `<img>` **siempre** debería llevar el atributo `alt`, aunque esté vacío (`alt=""`) — la única vez que `alt=""` es correcto es cuando la imagen es puramente decorativa y no aporta información (en ese caso, además, conviene sumarle `aria-hidden="true"`).

---

## 15. `<button>` vs. `<a>`: cuándo usar cada uno

Ambos se pueden hacer clic, pero significan cosas distintas: `<a href="...">` **navega** a otra URL (o ancla); `<button>` **ejecuta una acción** en la página actual, sin cambiar de URL.

Ejemplo real de `<a>` para navegación real, aunque tenga clase de botón (`admin/producto.html`):
```html
<a class="btn accent small" href="nuevo_producto.html" data-admin-only>+ Nuevo producto</a>
```
Aunque tiene la clase `.btn` (que lo hace *ver* como un botón), sigue siendo un `<a>` porque su función es llevar a otra página.

Ejemplo real de `<button type="button">` para acciones que **no** envían un formulario ni navegan (`detalle_productos.html`):
```html
<div class="qty" id="selector-cantidad">
  <button type="button" id="btn-restar" aria-label="Restar unidad">−</button>
  <input type="number" id="input-cantidad" value="1" min="1">
  <button type="button" id="btn-sumar" aria-label="Sumar unidad">+</button>
</div>
```
`type="button"` es importante: sin él, un `<button>` dentro de un `<form>` por defecto es `type="submit"` y **enviaría el formulario** al hacer clic — algo que claramente no se quiere para un botón de "sumar cantidad".

Y el botón real de envío de un formulario, que sí es `type="submit"` a propósito (`registro_usuario.html`):
```html
<button type="submit" class="btn accent">Crear cuenta</button>
```

**Para recordar:** si el clic cambia de página → `<a>`. Si el clic hace algo en la misma página (sumar, restar, abrir un menú) → `<button type="button">`. Si el clic envía un formulario → `<button type="submit">` (o directamente sin `type`, dentro de un `<form>`).

---

## 16. `id` vs. `class`: dos propósitos distintos

Un `id` debe ser **único** en toda la página, y en este proyecto se usa casi siempre como **gancho para JavaScript** (`document.getElementById(...)`), no para darle estilo. Una `class` se puede repetir cuantas veces haga falta, y es la que casi siempre lleva el diseño (CSS).

Ejemplo real donde se ve la diferencia bien clara, en el mismo elemento (`detalle_productos.html`):
```html
<button class="btn accent" id="btn-agregar-carrito" style="margin-top:16px;">
  Agregar al carrito
</button>
```
- `class="btn accent"` → le da el estilo visual (fondo, color, padding — definidos en `estilos.css`).
- `id="btn-agregar-carrito"` → es lo que `detalle.js` usa para encontrar **este botón específico** y agregarle un `addEventListener("click", ...)`.

Otro ejemplo real, donde varios elementos comparten clase pero cada uno tiene su propio `id` para que el JS los distinga entre sí (`registro_usuario.html`):
```html
<div class="field" id="field-run">...</div>
<div class="field" id="field-nombre">...</div>
<div class="field" id="field-correo">...</div>
```
Todos comparten `class="field"` (mismo estilo para los tres), pero cada `id` es único, porque `registro.js` necesita poder decir "marcá como inválido específicamente el campo de correo", no "todos los `.field`".

**Para recordar:** si necesitás **estilo repetible** → `class`. Si necesitás **encontrar un elemento único desde JavaScript** → `id`. Muchos elementos de este proyecto llevan ambos a la vez, cada uno cumpliendo su propio rol.

---

## 17. El patrón "cascarón vacío + JS lo llena"

Ya apareció varias veces en esta guía, pero merece su propia sección porque es, probablemente, el patrón más repetido en todo el HTML del proyecto: dejar un contenedor **vacío** en el HTML, identificado con un `id`, y que un script externo lo llene después con `innerHTML` o creando elementos.

Ejemplo real, la grilla completa del catálogo (`productos.html`):
```html
<p id="estado-carga" class="text-center" style="color:var(--ink-soft); padding-block:40px;">
  Cargando productos...
</p>
<p id="sin-resultados" class="text-center" style="display:none; padding-block:40px;">
  No encontramos productos para esta categoría.
</p>
<div id="grid-productos" class="grid grid-3" style="display:none;"></div>
```
Notá los 3 estados posibles ya preparados en el HTML: "cargando" (visible al principio), "sin resultados" (oculto, `catalogo.js` lo muestra si el filtro no encuentra nada) y la grilla real (oculta hasta que hay datos, para no mostrar un contenedor vacío mientras carga).

Mismo patrón, más simple, en la ficha de producto (`detalle_productos.html`):
```html
<p id="estado-carga" style="color:var(--ink-soft); padding-block:20px;">
  Cargando ficha del producto...
</p>
<p id="producto-error" style="color:var(--danger); display:none; padding-block:20px;">
  No encontramos este producto. <a href="productos.html">Vuelve al catálogo</a>.
</p>
<div id="producto-detalle" class="product-detail" style="display:none;">
  ...
</div>
```

**Para recordar:** cuando el contenido depende de datos que solo se conocen en tiempo de ejecución (una API, `localStorage`, la URL actual), el patrón correcto en HTML plano es dejar el "molde" vacío con un `id`, más los mensajes de carga/error/vacío ya escritos y ocultos con `display:none`, listos para que el JS los muestre cuando corresponda.

---

## 18. Comentarios HTML

Un comentario (`<!-- texto -->`) no se muestra en la página, pero queda visible en el código fuente — el proyecto los usa para explicar **por qué** algo está escrito de cierta forma, no solo qué es.

Ejemplo real (`productos.html`):
```html
<!--
  Filtros de categoría. Quedan escritos a mano en el HTML porque son
  fijos: catalogo.js solo escucha los clics y decide qué productos
  mostrar según la categoría elegida.
-->
<div class="category-filters" id="filtros-categoria">
  ...
</div>

<!-- Como el catálogo es local, este mensaje casi no alcanza a verse -->
<p id="estado-carga" ...>Cargando productos...</p>

<!-- Mensaje si un filtro no tiene productos -->
<p id="sin-resultados" ...>No encontramos productos para esta categoría.</p>
```

**Para recordar:** un buen comentario en HTML explica la **intención** detrás de un bloque (por qué está oculto, por qué es fijo, qué script lo va a llenar), no describe obviedades que ya se ven leyendo la etiqueta.

---

## 19. Emojis como íconos, sin librerías

En vez de traer una librería de íconos (Font Awesome, Material Icons, etc.), el proyecto usa **emojis directo en el HTML** como si fueran íconos — una solución liviana, sin dependencias externas ni archivos que cargar.

Ejemplos reales:
```html
<button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false">☰</button>
<a href="carrito.html" class="cart-btn" aria-label="Ver carrito de compras">🛒 Carrito</a>
<span class="icon">🏠</span> Inicio
<span class="icon">👤</span> Usuarios
<span class="icon">📦</span> Productos
<span class="admin-bell" aria-hidden="true">🔔</span>
```

Notá el detalle de accesibilidad: cuando el emoji **es** el único contenido de un control interactivo (como el botón `☰`), el elemento lleva `aria-label` para describir su función en palabras, porque un lector de pantalla no necesariamente interpreta bien el significado de un emoji aislado. Cuando el emoji es puramente decorativo junto a texto que ya explica de qué se trata (como la campanita 🔔 al lado de un `<h1>`), en cambio, se usa `aria-hidden="true"` para que el lector de pantalla lo ignore.

**Para recordar:** usar emojis como íconos es válido y liviano para proyectos chicos o de aprendizaje, pero conviene acompañarlos siempre de `aria-label` (si son el único contenido de un control) o `aria-hidden="true"` (si son decorativos), según corresponda.

---

## 20. Errores reales a evitar

Igual que en la guía de CSS, vale la pena mirar los problemas reales del HTML del proyecto (documentados en `DOCUMENTACION_TecnoFactory.md`):

- **Estilos inline mezclados con clases:** varias páginas (`productos.html`, `registro_usuario.html`, entre otras) tienen `style="..."` puesto directo en el HTML, además de sus clases:
  ```html
  <div class="wrap footer-grid" style="
      border-top-width: 5px;
      border-bottom-width: 10px;
      padding-bottom: 5px;
      padding-top: 10px;">
  ```
  Esto funciona, pero desparrama el diseño entre dos lugares (el CSS y el HTML): si mañana hay que ajustar ese padding, hay que acordarse de que no está en `estilos.css` sino escrito a mano en cada página que lo repite.
- **Falta la carpeta `images/` con las imágenes propias del sitio** (documentado en `DOCUMENTACION_TecnoFactory.md`), por lo que algunas rutas de imagen locales (como `../../images/logos/Falabella-Banco-Logo-PNG-Picture.png`) no van a cargar hasta que esa carpeta se agregue al proyecto.

**Para recordar:** revisar la documentación existente del proyecto (`DOCUMENTACION_TecnoFactory.md`, `CSS_TecnoFactory.md`, `JS_Scripts_TecnoFactory.md`) antes de asumir que un HTML "raro" es un error tuyo — a veces es un problema ya conocido y documentado del propio proyecto.

---

## 21. Ejercicios propuestos

1. Elegí una página de `pages/tienda/` y sacá todos los `style="..."` inline que tenga, moviendo esos valores a una clase nueva en `estilos.css`.
2. Agregale un atributo `data-producto` a cada fila de un listado (por ejemplo, en el `<tbody id="tabla-productos">` de `admin/producto.html`) para guardar el código del producto sin depender de leerlo de una celda de texto.
3. En `registro_usuario.html`, agregale un nuevo campo siguiendo el patrón de la sección 11 (label + hint opcional + input + error-msg), por ejemplo un campo "Nombre de usuario".
4. Cambiá uno de los `<a class="btn ...">` que en realidad ejecuta una acción de JS (si encontrás alguno) por un `<button type="button">`, y explicá por qué el cambio es más correcto semánticamente.
5. Agregale `aria-label` a algún botón o enlace del proyecto que solo tenga un emoji como contenido y todavía no lo tenga.
6. Armá una tabla nueva desde cero (con `<thead>`/`<tbody>`) para mostrar una lista de "pedidos", dejando el `<tbody>` vacío con un `id`, lista para que un futuro script la llene.
