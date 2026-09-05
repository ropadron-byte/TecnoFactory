# Documentación técnica — TecnoFactory

E-commerce de venta de PCs, smartphones y accesorios tecnológicos, construido con **HTML + CSS + JavaScript "vanilla"** (sin frameworks, sin backend). Todo el estado de la aplicación —catálogo, usuarios, sesión y carrito— vive en el `localStorage` del navegador.

---

## 1. Resumen del stack

| Capa | Tecnología |
|---|---|
| Maquetado | HTML5 |
| Estilos | CSS puro + Bootstrap 5.3 (solo en `index.html`) |
| Lógica | JavaScript ES5/ES6 sin módulos (`<script>` normales, sin `import/export`) |
| Persistencia | `localStorage` del navegador (no hay servidor ni base de datos) |
| Iconos | Bootstrap Icons + emojis nativos |
| Tipografías | Google Fonts (Inter, Space Grotesk, JetBrains Mono) |

No hay `package.json`, build step, ni servidor: el sitio se abre directamente como archivos estáticos (o con un servidor estático simple).

---

## 2. Estructura del proyecto tal como llegó comprimida

```
TecnoFactory/
├── README.md
├── index.html                     # Home de la tienda
├── css/
│   ├── estilos.css                # Hoja principal, usada por pages/tienda y pages/admin
│   ├── estilosIndex.css           # Ajustes puntuales solo para index.html
│   └── admin.css                  # Estilos del panel de administración
├── js/
│   ├── productos.js                # Catálogo de productos (fuente de datos + helpers)
│   ├── carrito.js                  # Lógica del carrito de compras
│   ├── usuarios.js                 # Usuarios, sesión, login, validación de RUN
│   ├── admin-guard.js               # Control de acceso por rol al panel admin
│   ├── regiones.js                 # Datos de Región/Comuna para formularios
│   ├── catalogo.js                 # Pinta la grilla de pages/tienda/productos.html
│   ├── detalle.js                  # Pinta la ficha de pages/tienda/detalle_productos.html
│   ├── home.js                     # Pinta los "destacados" del index.html
│   ├── contacto.js                 # Validación del formulario de contacto
│   └── main.js                     # Comportamiento del menú responsive (hamburguesa)
└──  pages/
│    ├── tienda/                     # Sitio público (cliente)
│    │   ├── productos.html
│    │   ├── detalle_productos.html
│    │   ├── carrito.html
│    │   ├── nosotros.html
│    │   ├── blogs.html
│    │   ├── detalle_blog_1.html
│    │   ├── detalle_blog_2.html
│    │   ├── contacto.html
│    │   ├── iniciar_sesion.html
│    │   └── registro_usuario.html
│    └── admin/                      # Panel privado (Administrador / Vendedor)
│        ├── home.html
│        ├── producto.html
│        ├── nuevo_producto.html
│        ├── editar_producto.html
│        ├── mostrar_producto.html
│        ├── usuario.html
│        ├── nuevo_usuario.html
│        ├── editar_usuario.html
│        └── mostrar_usuario.html
└── images/                                              
    ├── banner1.jpeg                    # usada en el carrusel del home (index.html)
    ├── banner2.jpeg                    # usada en el carrusel del home (index.html)
    ├── banner3.jpeg                    # usada en el carrusel del home (index.html)
    ├── blog_apertura_tienda.jpg        # portada del post "Abrimos nuestra tienda online"
    ├── blog_ssd.jpg                    # portada del post "5 datos curiosos sobre el SSD"
    ├── blog_setup.jpg                  # miniatura del 3er post en el listado de blogs
    └── logos/
        └── Falabella-Banco-Logo-PNG-Picture.png   # logo "Banco Falabella" en el footer de TODAS las páginas
```


**Importante:** las fotos de los **productos** (notebooks y smartphones) **no** están afectadas por esta falta, porque `js/productos.js` las trae directamente desde un CDN externo (`https://cdn.dummyjson.com/product-images/...`), no desde una carpeta local. Por eso el catálogo y las fichas de producto muestran imagenes sin que estan esten en Images.

---

## 4. Cómo se relacionan las páginas (mapa de navegación)

```
index.html (home)
 ├─ pages/tienda/productos.html ──> pages/tienda/detalle_productos.html?codigo=XXX
 ├─ pages/tienda/nosotros.html
 ├─ pages/tienda/blogs.html ──> detalle_blog_1.html / detalle_blog_2.html
 ├─ pages/tienda/contacto.html
 ├─ pages/tienda/registro_usuario.html ──> iniciar_sesion.html
 ├─ pages/tienda/iniciar_sesion.html
 │     ├─ si el usuario es Cliente        → vuelve a index.html
 │     └─ si es Administrador o Vendedor  → pages/admin/home.html
 └─ pages/tienda/carrito.html

pages/admin/home.html (requiere sesión)
 ├─ producto.html ──> nuevo_producto.html / editar_producto.html / mostrar_producto.html
 └─ usuario.html  ──> nuevo_usuario.html / editar_usuario.html / mostrar_usuario.html
      (usuario.html y todo lo de "nuevo/editar" de ambos módulos son solo-Administrador)
```

Todas las páginas de `pages/tienda/` y `pages/admin/` usan rutas relativas `../../` para volver a `css/` y `js/` en la raíz, porque están dos niveles por debajo de `index.html`.

---

## 5. Orden de carga de los scripts (por qué importa)

Los `<script>` **no usan módulos** (no hay `import`/`export`), así que el orden en que se cargan en el `<head>`/`<body>` de cada página importa: un script que use una función de otro debe cargarse **después**.

Patrón típico en una página de la tienda:
```html
<script src="../../js/main.js"></script>      <!-- menú hamburguesa, sin dependencias -->
<script src="../../js/productos.js"></script> <!-- define obtenerProductos(), formatCLP(), etc. -->
<script src="../../js/carrito.js"></script>   <!-- usa obtenerProductoPorCodigo() de productos.js -->
<script src="../../js/catalogo.js"></script>  <!-- usa funciones de productos.js y carrito.js -->
```

Patrón típico en una página del panel admin:
```html
<script src="../../js/usuarios.js"></script>      <!-- en el <head>: define obtenerSesion() -->
<script src="../../js/admin-guard.js"></script>   <!-- en el <head>: valida la sesión ANTES de pintar la página -->
...
<script src="../../js/productos.js"></script>     <!-- ya en el <body>, para pintar la tabla -->
```

`admin-guard.js` se carga deliberadamente en el `<head>`, justo después de `usuarios.js`, para poder **redirigir antes de que la página termine de pintarse** si no hay sesión válida.

Resumen de qué depende de qué:

| Script | Depende de | Lo usan |
|---|---|---|
| `productos.js` | — (independiente) | `home.js`, `catalogo.js`, `detalle.js`, `carrito.js`, todas las páginas admin de productos |
| `usuarios.js` | — (independiente) | `admin-guard.js`, login, registro, admin de usuarios |
| `carrito.js` | `productos.js` | `catalogo.js`, `detalle.js`, `carrito.html` |
| `regiones.js` | — (independiente) | `registro_usuario.html`, `nuevo_usuario.html`, `editar_usuario.html` |
| `admin-guard.js` | `usuarios.js` | todas las páginas de `pages/admin/` |
| `home.js` | `productos.js` | solo `index.html` |
| `catalogo.js` | `productos.js`, `carrito.js` | solo `pages/tienda/productos.html` |
| `detalle.js` | `productos.js`, `carrito.js` | solo `pages/tienda/detalle_productos.html` |
| `contacto.js` | — (independiente) | solo `pages/tienda/contacto.html` |
| `main.js` | — (independiente) | todas las páginas (menú responsive) |

---

## 6. Catálogo de productos (`js/productos.js`)

Es el "corazón" de datos del sitio.

- Define un arreglo fijo **`PRODUCTOS_INICIALES`** (notebooks y smartphones, con nombre, categoría, precio en CLP, stock, stock crítico y hasta 3 URLs de imagen tomadas de `cdn.dummyjson.com`).
- La primera vez que se visita el sitio, `obtenerProductos()` copia ese arreglo a `localStorage` bajo la clave **`tf_productos`**. Desde ahí en adelante, todas las lecturas/escrituras (crear, editar, listar) trabajan sobre esa copia en `localStorage`, no sobre el arreglo original.
- Cada producto se identifica por un **`codigo`** único (ej. `TF-NB-001`, `TF-SP-003`), no por un id numérico.
- Categorías disponibles: `Notebooks`, `Audio`, `Accesorios`, `Monitores`, `Almacenamiento`, `Smartphones` (constante `CATEGORIAS`). Nota: el catálogo inicial solo trae productos de `Notebooks` y `Smartphones`; las demás categorías existen en los filtros y formularios pero no tienen productos de ejemplo cargados.
- Funciones principales:
  - `obtenerProductos()` / `guardarProducto()` / `actualizarProducto(codigo, datos)` / `eliminarProducto(codigo)` / `obtenerProductoPorCodigo(codigo)`
  - `formatCLP(valor)` → formatea precios como `$549.990`.
  - `mediaProductoHTML(producto)` → arma el `<img>` o, si no hay imagen, un ícono emoji de categoría como respaldo (`handleImgError`).
  - Un set de funciones (`crearFilaImagen`, `iniciarCampoImagenes`, `leerCampoImagenes`) que arman el campo dinámico "agregar varias URLs de imagen" que se usa en los formularios de nuevo/editar producto.

**Detalle a tener en cuenta:** `eliminarProducto(codigo)` está implementada pero **ningún botón de la interfaz la usa todavía** (ni en `producto.html`, ni en `mostrar_producto.html`, ni en `editar_producto.html`). Es funcionalidad lista para conectar, pero pendiente.

---

## 7. Usuarios y sesión (`js/usuarios.js`)

- Los usuarios se guardan en `localStorage` bajo la clave **`tf_usuarios`**; la sesión activa, bajo **`tf_sesion`**.
- Al pedir la lista de usuarios por primera vez, se crea automáticamente un usuario **Administrador de fábrica**:
  - Correo: `admin@duoc.cl`
  - Contraseña: `admin123`
  - (Esas credenciales de prueba están además impresas en la propia página `iniciar_sesion.html`, como ayuda.)
- Roles del sistema (campo `tipo`): **Administrador**, **Vendedor**, **Cliente**.
- `guardarUsuario()` usa `Date.now()` como `id`. `actualizarUsuario()` no pisa la contraseña guardada si el formulario de edición la deja vacía.
- `validarRun(run)` calcula el dígito verificador del RUN chileno (módulo 11) para validar el campo RUN en los formularios de registro/alta de usuario.
- El login (`iniciarSesion`) solo acepta correos de los dominios `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com` (esa regla vive en el HTML de cada formulario, no en `usuarios.js`).

**Bug detectado:** `iniciarSesion(correo, contrasena)` siempre devuelve un objeto (nunca `null`), incluso cuando no encuentra ningún usuario con esas credenciales, porque hace `Object.assign({}, usuario)` y en JavaScript `Object.assign({}, undefined)` da `{}` (un objeto "verdadero", no `null`/`false`). Como el formulario de login solo revisa `if (!sesion)`, esa validación **nunca se dispara**: con credenciales incorrectas el mensaje de error no aparece y el usuario es redirigido igualmente (al `index.html`, porque `sesion.tipo` queda `undefined`). Para corregirlo, `iniciarSesion` debería devolver `null` explícitamente cuando `usuario` no se encuentra, antes de hacer el `Object.assign`.

---

## 8. Control de acceso al panel (`js/admin-guard.js`)

Se carga en el `<head>` de **todas** las páginas de `pages/admin/`, justo después de `usuarios.js`.

| Rol | Puede entrar al panel | Ve "Usuarios" | Puede crear/editar productos |
|---|---|---|---|
| Administrador | Sí | Sí | Sí |
| Vendedor | Sí | No (oculto y bloqueado por URL) | No (solo puede Ver) |
| Cliente | No → redirigido a `iniciar_sesion.html` | — | — |

Mecanismo:
- Si no hay sesión, o la sesión es de un `Cliente`, redirige de inmediato a `pages/tienda/iniciar_sesion.html`.
- Si es `Vendedor` y trata de entrar por URL directa a una página restringida (lista en `SOLO_ADMIN`: `usuario.html`, `nuevo_usuario.html`, `editar_usuario.html`, `mostrar_usuario.html`, `nuevo_producto.html`, `editar_producto.html`), lo redirige a `producto.html`.
- Además, inyecta una regla CSS (`.role-vendedor [data-admin-only] { display:none }`) para ocultar enlaces y botones marcados con el atributo `data-admin-only` en el HTML (por ejemplo, el link "Usuarios" del menú lateral, o el botón "Editar" en la ficha de producto), evitando que un Vendedor vea opciones que no puede usar.
- Al terminar de cargar la página, agrega en la barra lateral el nombre de quien inició sesión y el botón "Cerrar sesión".

---

## 9. Carrito de compras (`js/carrito.js`)

- Se guarda en `localStorage` bajo la clave **`tf_cart`**, como un arreglo de `{ codigo, qty }`.
- `addToCart(codigo, qty)` valida que exista stock suficiente antes de agregar (respetando lo que ya había en el carrito) y devuelve `{ ok, message }` para mostrarle feedback al usuario.
- `updateCartQty`, `removeFromCart`, `cartTotalItems`, `cartTotalPrice` completan las operaciones típicas de un carrito.
- `updateCartBadge()` actualiza el numerito 🛒 del header en **todas** las páginas que incluyan `carrito.js` (se dispara automáticamente en `DOMContentLoaded`).
- En `pages/tienda/carrito.html`, el botón "Pagar" es una **simulación**: solo muestra un mensaje de éxito y vacía el carrito; no hay pasarela de pago real ni backend.

---

## 10. Formularios y validaciones

Todos los formularios validan **en el propio navegador** (no hay backend), marcando cada campo con las clases `.valid` / `.invalid` definidas en `estilos.css`, y sin dejar enviar el formulario si algo falla:

| Formulario | Página | Reglas destacadas |
|---|---|---|
| Contacto | `pages/tienda/contacto.html` (`contacto.js`) | Nombre y comentario obligatorios; correo opcional pero, si se llena, debe ser de dominio `@duoc.cl`/`@profesor.duoc.cl`/`@gmail.com` |
| Iniciar sesión | `pages/tienda/iniciar_sesion.html` | Correo de dominio permitido + contraseña de 4 a 10 caracteres |
| Registro de cliente | `pages/tienda/registro_usuario.html` | RUN válido (dígito verificador), correo de dominio permitido y no duplicado, contraseña con confirmación, región/comuna dependientes |
| Nuevo/editar producto | `pages/admin/nuevo_producto.html` / `editar_producto.html` | Código único (mín. 3 caracteres, no editable después de creado), precio y stock numéricos ≥ 0, categoría obligatoria, imágenes opcionales (múltiples URLs) |
| Nuevo/editar usuario (admin) | `pages/admin/nuevo_usuario.html` / `editar_usuario.html` | Igual que el registro público, pero además permite elegir el `tipo` (Administrador/Vendedor/Cliente) |

El selector de Región → Comuna (`js/regiones.js`) es un dataset fijo de 5 regiones chilenas con sus comunas; al cambiar la región, se repuebla el `<select>` de comuna.

---

## 11. Estilos (`css/`)

- **`estilos.css`**: hoja principal, usada en casi todo `pages/tienda/` y como base de `pages/admin/`. Define la paleta de colores, tipografías (Space Grotesk + Inter + JetBrains Mono vía Google Fonts), tarjetas de producto, formularios, etc.
- **`estilosIndex.css`**: ajustes exclusivos de `index.html` (que usa Bootstrap como base), para no duplicar toda la hoja principal.
- **`admin.css`**: se carga después de `estilos.css` en todas las páginas del panel, y reutiliza sus variables CSS (`--brand`, `--ink`, `--line`, etc.) para la barra lateral, tablas y badges de stock/rol.

---

## 12. Cómo probar el sitio localmente

Como no hay backend ni build, alcanza con un servidor estático simple (abrir `index.html` directo con doble clic puede fallar por restricciones del navegador con `localStorage`/rutas relativas en algunos casos, así que se recomienda un servidor):

```bash
# Desde la carpeta raíz del proyecto (donde está index.html)
python3 -m http.server 8080
# Abrir http://localhost:8080/ en el navegador
```

Para entrar al panel de administración: ir a **Iniciar sesión** con `admin@duoc.cl` / `admin123`.

> Para ver el sitio "completo" hay que recrear la carpeta `images/` descrita en la sección 3; sin ella, el resto del sitio funciona igual (catálogo, carrito, login, panel admin), solo faltarán esas imágenes puntuales.

---

## 13. Resumen de particularidades y pendientes detectados

- 🐛 **Bug de login**: `iniciarSesion()` nunca devuelve `null`, por lo que el mensaje "Correo o contraseña incorrectos" no llega a mostrarse (sección 7).
- 🔧 **Funciones sin conectar a la UI**: `eliminarProducto()` y `eliminarUsuario()` existen en el código pero ningún botón las invoca todavía.
- 💾 Todo el "backend" es `localStorage`: si se borra la caché/almacenamiento del navegador, se pierden productos agregados, usuarios registrados y el carrito (el catálogo inicial y el admin de fábrica se regeneran solos, pero los datos añadidos manualmente no).
- 🌐 Las imágenes de producto (notebooks/smartphones) dependen de un CDN externo (`cdn.dummyjson.com`); si ese servicio cae o cambia de URL, se pierden esas imágenes (aunque el ícono de categoría queda como respaldo automático gracias a `handleImgError`).
