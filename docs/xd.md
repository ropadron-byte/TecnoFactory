# Ficha del documento

**Fecha:** 06-09-2026
**Revisión:** 1.0
**Autor:** Román Padrón, Benjamín González
**Modificación:** Versión inicial del documento ERS del proyecto TecnoFactory, correspondiente a la propuesta previa de la Entrega 1 (desarrollo del frontend de la tienda y del panel de administración).

**Documento validado por las partes en fecha:** Pendiente de validación formal – documento en versión de trabajo correspondiente a la Entrega 1.

---

## 1. Introducción

Este documento corresponde a la Especificación de Requisitos de Software (ERS) del proyecto TecnoFactory, una tienda en línea de productos tecnológicos (notebooks, smartphones, audio, monitores, accesorios y almacenamiento) desarrollada en el marco de la asignatura DSY1104. Esta primera versión del documento describe el propósito, el alcance, los usuarios, las restricciones y los requisitos funcionales y no funcionales identificados para la Entrega 1 del proyecto, correspondiente al desarrollo del frontend (HTML, CSS y JavaScript) de la tienda y del panel de administración.

### 1.1 Propósito

El propósito de este documento es especificar de manera clara, ordenada y verificable los requisitos funcionales y no funcionales del sitio web TecnoFactory, de modo que sirvan de guía para el equipo de desarrollo durante la implementación y como criterio de referencia para la evaluación del proyecto. Este documento está dirigido a: el equipo de desarrollo, responsable de implementar y mantener el sistema; el docente evaluador de la asignatura DSY1104, quien actúa como representante del cliente; y cualquier persona que se incorpore al proyecto en etapas posteriores y necesite comprender su alcance y funcionamiento.

### 1.2 Ámbito del Sistema

El sistema se denomina **TecnoFactory** y corresponde a una tienda en línea (e-commerce) de productos tecnológicos.

En esta primera entrega, el sistema **SÍ** contempla: la navegación pública de la tienda (catálogo de productos, detalle de producto, carrito de compras, blog, formulario de contacto, registro e inicio de sesión de usuarios) y un panel de administración protegido por roles para gestionar productos y usuarios.

En esta primera entrega, el sistema **NO** contempla: pasarela de pago real, envío de correos electrónicos, ni una base de datos o backend propiamente tal; los datos se guardan en el navegador mediante localStorage, a la espera de conectar una base de datos en una entrega posterior.

Con este sistema se espera lograr los siguientes beneficios, objetivos y metas: ofrecer a los clientes una experiencia de compra simple e intuitiva desde cualquier dispositivo; entregar al equipo administrador una herramienta para mantener actualizado el catálogo de productos y la base de usuarios; y sentar una base de código ordenada, documentada y versionada en GitHub que permita continuar el desarrollo (backend, base de datos, pagos) en las siguientes entregas de la asignatura.

### 1.3 Definiciones, Acrónimos y Abreviaturas

- **ERS:** Especificación de Requerimientos de Software.
- **RUN:** Rol Único Nacional, identificador de una persona natural en Chile.
- **SKU / Código de producto:** identificador único de cada producto en el catálogo (ej. TF-SP-001).
- **Stock crítico:** cantidad mínima de unidades de un producto a partir de la cual el sistema debe advertir al administrador que el inventario está por agotarse.
- **Carrito de compras:** conjunto de productos y cantidades que un cliente ha seleccionado para comprar, antes de confirmar el pago.
- **LocalStorage:** mecanismo del navegador que permite almacenar información de forma persistente en el equipo del usuario, sin necesidad de un servidor.
- **CRUD:** acrónimo de Crear, Leer, Actualizar y Eliminar (Create, Read, Update, Delete), operaciones básicas sobre los datos de productos y usuarios.
- **Rol:** perfil que determina qué funcionalidades del sistema puede utilizar un usuario (Administrador, Vendedor o Cliente).
- **Responsive Design (diseño adaptable):** técnica de diseño web que permite que el sitio se visualice correctamente en distintos tamaños de pantalla.
- **Repositorio:** espacio en GitHub donde se almacena y versiona el código fuente del proyecto.
- **Commit:** registro de un cambio guardado en el historial del repositorio, acompañado de un mensaje descriptivo.

### 1.4 Referencias

Este documento hace referencia a los siguientes documentos y recursos:

- DSY1104 Evaluación Parcial 1 – Anexo 1: Instrucciones para el desarrollo de la Evaluación 1 (30%).
- DSY1104 Evaluación Parcial 1 – Planilla de Requerimientos (Excel).
- DSY1104 Evaluación Parcial 1 – Anexo 4: Especificación de Requisitos del Software (este documento).
- Mockups y diagramas de flujo de navegación de la propuesta de Entrega 1 (Figuras 1 a 15 del Anexo 1).
- Repositorio del proyecto en GitHub: https://github.com/ropadron-byte/TecnoFactory
- Sitio publicado en GitHub Pages: https://ropadron-byte.github.io/TecnoFactory/
- Documentación de la API Window.localStorage – MDN Web Docs: https://developer.mozilla.org/es/docs/Web/API/Window/localStorage

### 1.5 Visión General del Documento

Este documento se organiza en tres grandes secciones. La sección 1 (Introducción) presenta el propósito, alcance, definiciones y referencias del proyecto. La sección 2 (Descripción General) describe el contexto del producto, sus funciones principales, los tipos de usuario, las restricciones y los supuestos considerados. La sección 3 (Requisitos Específicos) detalla los requisitos de interfaz, los requisitos funcionales (numerados como RF) y los requisitos no funcionales (rendimiento, seguridad, fiabilidad, disponibilidad, mantenibilidad y portabilidad) que debe cumplir el sistema.

Este documento se irá actualizando en las siguientes entregas de la asignatura, incorporando nuevas versiones a medida que evolucione el proyecto.

---

## 2. Descripción General

### 2.1 Perspectiva del Producto

TecnoFactory es un producto de software independiente; en esta primera entrega no se integra con ningún sistema externo ya existente, dado que corresponde al desarrollo inicial del frontend del proyecto. El sistema se organiza en dos módulos principales, tal como se definió en la propuesta de Entrega 1 (ver Figura 1 del Anexo 1 de instrucciones):

- **Módulo Tienda:** de acceso público, permite a cualquier visitante navegar el catálogo, ver el detalle de productos, agregarlos al carrito, registrarse, iniciar sesión, revisar el blog y enviar mensajes de contacto.
- **Módulo Administrador:** de acceso restringido mediante inicio de sesión y control de roles, permite gestionar (crear, editar, listar y visualizar) los productos y los usuarios del sistema.

Ambos módulos comparten el mismo código base (HTML, CSS y JavaScript) y, en esta entrega, persisten su información en el almacenamiento local del navegador (localStorage), ya que aún no existe un servidor ni una base de datos. Se espera que, en entregas posteriores, este frontend se conecte a un backend y a una base de datos relacional que reemplace el uso de localStorage.

*(Diagrama de bloques sugerido: Navegador del usuario → Frontend TecnoFactory [Módulo Tienda | Módulo Administrador] → localStorage)*

### 2.2 Funciones del Producto

**Tienda (acceso público):**
- Mostrar productos destacados y un carrusel de imágenes en la página de inicio.
- Listar el catálogo completo de productos, con filtro por categoría.
- Mostrar el detalle de un producto (imágenes, descripción, precio, stock) y permitir añadirlo al carrito.
- Gestionar un carrito de compras (agregar, quitar y modificar cantidades), respetando el stock disponible.
- Registrar nuevos usuarios (clientes) e iniciar sesión.
- Mostrar la página "Nosotros", con información de la empresa.
- Mostrar un blog de noticias con el detalle de cada publicación.
- Recibir mensajes desde un formulario de contacto.

**Administrador (acceso privado, según rol):**
- Autenticar al usuario y redirigirlo al panel según su rol.
- Mostrar una página de inicio (home) del panel con menú lateral de navegación.
- Listar, crear, editar y visualizar productos (Administrador y Vendedor pueden listar y ver; solo Administrador puede crear y editar).
- Listar, crear, editar y visualizar usuarios, incluyendo su rol dentro del sistema (solo Administrador).
- Restringir el acceso a las páginas del panel según el rol del usuario autenticado (Administrador, Vendedor o Cliente).

### 2.3 Características de los Usuarios

El sistema está pensado para ser utilizado por personas sin conocimientos técnicos avanzados, ya que su interfaz sigue patrones habituales de un sitio de comercio electrónico (menú superior, tarjetas de producto, formularios simples). Existen tres tipos de perfiles de usuario en el sistema: Cliente, Vendedor y Administrador.

- **Cliente:** cualquier persona que visita el sitio para explorar el catálogo y comprar productos. No requiere conocimientos técnicos; basta con experiencia básica navegando sitios web o aplicaciones de compra en línea.
- **Vendedor:** usuario interno de la tienda, con conocimientos de uso de PC a nivel de usuario. Puede revisar el listado y detalle de productos (y, en el futuro, de órdenes de compra), pero no puede crear ni editar productos ni usuarios.
- **Administrador:** usuario con acceso total al sistema, con conocimientos de uso de PC a nivel medio (equivalente al manejo básico de planillas de cálculo y a la navegación por paneles de administración). Es responsable de mantener actualizado el catálogo de productos y la base de usuarios, incluyendo la asignación de roles.

### 2.4 Restricciones

El desarrollo del sistema está sujeto a las siguientes restricciones:

- **Políticas de la empresa:** el proyecto debe cumplir con los requisitos definidos por la asignatura DSY1104 y el Anexo 1 de instrucciones de la Evaluación 1.
- **Limitaciones del hardware:** el sistema debe funcionar en computadores, tablets y smartphones con navegador web moderno y conexión a internet; no se contemplan requisitos de hardware especiales.
- **Interfaces con otras aplicaciones:** en esta entrega no se integra con sistemas externos, salvo el uso puntual de imágenes de referencia; toda la lógica del sitio se ejecuta en el navegador.
- **Operaciones paralelas:** no aplica en esta etapa, ya que no existe un servidor que deba atender solicitudes concurrentes; toda la información se guarda de forma local en cada navegador.
- **Funciones de auditoría:** no se contemplan en esta primera entrega; se evaluará incorporar un registro de actividad (logs) cuando el sistema cuente con backend.
- **Funciones de control:** el control de acceso se realiza mediante el módulo js/admin-guard.js, que valida la sesión y el rol del usuario antes de mostrar cada página del panel de administración.
- **Lenguaje(s) de programación:** HTML5, CSS3 y JavaScript (ES6), sin frameworks de backend en esta entrega.
- **Protocolos de comunicación:** HTTP/HTTPS, propios de la publicación del sitio como página web estática (GitHub Pages).
- **Requisitos de habilidad:** el equipo de desarrollo debe manejar HTML, CSS, JavaScript y control de versiones con Git y GitHub.
- **Criticidad de la aplicación:** media; se trata de un proyecto académico, por lo que no maneja datos financieros ni información sensible real de clientes.
- **Consideraciones acerca de la seguridad:** las contraseñas y datos de usuario se almacenan en el navegador (localStorage) sin cifrado en esta entrega, por lo que el sistema no debe utilizarse con datos reales de personas; el acceso al panel de administración está restringido por sesión y rol.

### 2.5 Suposiciones y Dependencias

Los requisitos definidos en este documento asumen que: el usuario final utilizará un navegador web moderno y actualizado (Chrome, Edge, Firefox o similar) con JavaScript y localStorage habilitados; el equipo de desarrollo mantendrá disponible el repositorio en GitHub y el servicio de GitHub Pages para la publicación del sitio; las librerías externas utilizadas (Bootstrap 5.3, Bootstrap Icons y la fuente Inter de Google Fonts) seguirán disponibles públicamente mediante sus CDN; y el listado de regiones y comunas seguirá cargándose desde el arreglo definido en js/regiones.js. Si alguno de estos supuestos cambia (por ejemplo, si se reemplaza localStorage por una base de datos real, o si cambia el proveedor de hosting), varios de los requisitos aquí descritos deberán revisarse.

### 2.6 Requisitos Futuros

Se identifican las siguientes mejoras que podrán analizarse e implementarse en entregas posteriores del proyecto:

- Incorporar un backend y una base de datos relacional que reemplacen el uso de localStorage.
- Integrar una pasarela de pago real (por ejemplo, WebPay) para completar el proceso de compra.
- Agregar recuperación de contraseña y verificación de correo electrónico.
- Implementar la gestión de órdenes/pedidos (creación, listado y seguimiento de compras).
- Agregar reportes y estadísticas de ventas para el panel de administración.
- Incorporar pruebas automatizadas (unitarias y de interfaz) para el frontend.
- Mejorar la seguridad del almacenamiento de contraseñas (cifrado/hash) una vez exista backend.

---

## 3. Requisitos Específicos

### 3.1 Requisitos comunes de las interfaces

A continuación se describen los requisitos de interfaz identificados para TecnoFactory: interfaz de usuario, de hardware, de software y de comunicación.

#### 3.1.1 Interfaces de usuario

El sitio utiliza un diseño propio construido sobre Bootstrap 5.3, con tipografía Inter (Google Fonts) y una paleta de colores corporativa (azul #22406B como color principal, naranjo #F2A93B como color de acento). Todas las páginas siguen la misma estructura visual, definida en las hojas de estilo css/estilos.css, css/estilosIndex.css y css/admin.css.

Las interfaces de usuario de la tienda están compuestas por un menú superior (header) con el logo, los enlaces de navegación y el ícono del carrito de compras, un área de contenido central para cada vista, y un pie de página (footer) común a todas las páginas. El panel de administración utiliza, en cambio, un menú lateral (sidebar) fijo con el listado de secciones disponibles y un área de contenido a la derecha, que se convierte en un menú desplegable (off-canvas) en pantallas pequeñas.

#### 3.1.2 Interfaces de hardware

El sistema no requiere hardware específico adicional al de un computador, tablet o smartphone estándar.

El sistema debe poder utilizarse tanto con mouse y teclado como mediante pantalla táctil (dispositivo touch móvil), ya que el diseño es responsivo y se adapta a distintos tamaños de pantalla (celular, tablet y escritorio).

#### 3.1.3 Interfaces de software

El proyecto integra los siguientes productos de software de terceros:

- **Bootstrap 5.3** (CSS y componentes) — Propósito: entregar una grilla responsiva y componentes de interfaz (carrusel, botones, formularios) — Se incorpora mediante CDN en cada página HTML.
- **Bootstrap Icons** — Propósito: iconografía utilizada en el menú, botones y panel de administración — Se incorpora mediante CDN.
- **Google Fonts (familia Inter)** — Propósito: tipografía del sitio — Se incorpora mediante un enlace `<link>` en el `<head>` de cada página.
- **API Window.localStorage del navegador** — Propósito: almacenar de forma persistente el catálogo de productos, los usuarios registrados, la sesión activa y el carrito de compras mientras el proyecto no cuenta con backend — Formato: pares clave/valor en formato JSON (claves `tf_productos`, `tf_usuarios`, `tf_sesion` y `tf_cart`).
- **GitHub / GitHub Pages** — Propósito: control de versiones del código fuente y publicación del sitio como página web estática — Repositorio: https://github.com/ropadron-byte/TecnoFactory

#### 3.1.4 Interfaces de comunicación

En esta entrega el sistema no se comunica con ningún servidor propio, ya que toda la información se procesa y almacena en el navegador del usuario (localStorage). El sitio se sirve mediante el protocolo HTTPS a través de GitHub Pages. En entregas futuras, cuando se incorpore un backend, se documentará en esta sección el protocolo (por ejemplo, HTTPS/REST) y el formato de los mensajes (JSON) utilizados para la comunicación entre el frontend y el servidor.

### 3.2 Requisitos funcionales

A continuación se detallan los requisitos funcionales identificados para la Entrega 1 del proyecto TecnoFactory, numerados de forma correlativa (RF-01 a RF-14).

#### 3.2.1 Requisito funcional 1

**Requerimiento funcional 1:** Registro de usuario (cliente)
**Actores:** Visitante, Cliente
**Descripción:** Un visitante debe poder crear una cuenta de tipo Cliente ingresando sus datos personales desde la página pages/tienda/registro_usuario.html.

**Criterios de aceptación:**
- Todos los campos obligatorios deben validarse antes de guardar el usuario.
- El sistema no debe permitir dos cuentas registradas con el mismo correo.
- Al registrarse correctamente, el usuario es redirigido a la página de inicio de sesión.

**Reglas de validación de los campos:**
- RUN: obligatorio, sin puntos ni guion (ej. 19011022K), entre 7 y 9 caracteres, validado con el algoritmo del dígito verificador.
- Nombre: obligatorio, máximo 50 caracteres.
- Apellidos: obligatorio, máximo 100 caracteres.
- Correo: obligatorio, máximo 100 caracteres, solo dominios @duoc.cl, @profesor.duoc.cl y @gmail.com.
- Contraseña: obligatoria, entre 4 y 10 caracteres.
- Confirmar contraseña: obligatoria, debe coincidir con la contraseña.
- Teléfono: opcional.
- Fecha de nacimiento: opcional.
- Región y comuna: obligatorias, seleccionadas desde listas dependientes.
- Dirección: obligatoria, máximo 300 caracteres.

#### 3.2.2 Requisito funcional 2

**Requerimiento funcional 2:** Inicio de sesión
**Actores:** Cliente, Vendedor, Administrador
**Descripción:** Un usuario registrado debe poder autenticarse ingresando su correo y contraseña desde pages/tienda/iniciar_sesion.html.

**Criterios de aceptación:**
- Si las credenciales son correctas, se crea una sesión y el usuario es redirigido: Administrador y Vendedor al panel de administración, Cliente a la página de inicio de la tienda.
- Si las credenciales son incorrectas, se muestra un mensaje de error sin indicar cuál dato falló.

**Reglas de validación:**
- Correo: obligatorio, máximo 100 caracteres, dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.
- Contraseña: obligatoria, entre 4 y 10 caracteres.

#### 3.2.3 Requisito funcional 3

**Requerimiento funcional 3:** Cierre de sesión
**Actores:** Cliente, Vendedor, Administrador
**Descripción:** Un usuario con sesión iniciada debe poder cerrarla desde el panel de administración, eliminando la sesión guardada y volviendo a la página de inicio de sesión.

#### 3.2.4 Requisito funcional 4

**Requerimiento funcional 4:** Listado y filtrado del catálogo de productos
**Actores:** Visitante, Cliente
**Descripción:** Cualquier visitante debe poder ver el listado completo de productos en pages/tienda/productos.html, con la posibilidad de filtrar por categoría (Notebooks, Audio, Accesorios, Monitores, Almacenamiento, Smartphones).

**Criterios de aceptación:**
- Cada producto debe mostrar imagen, nombre, precio y un botón para añadir al carrito (o la etiqueta "Sin stock" si no hay unidades disponibles).
- Al seleccionar una categoría, el listado debe actualizarse mostrando solo los productos de esa categoría.

#### 3.2.5 Requisito funcional 5

**Requerimiento funcional 5:** Detalle de producto
**Actores:** Visitante, Cliente
**Descripción:** Al seleccionar un producto, el sistema debe mostrar su ficha completa (galería de imágenes, nombre, descripción, precio y stock disponible) en pages/tienda/detalle_productos.html, identificando el producto mediante su código en la URL (?codigo=).

**Criterios de aceptación:**
- Si el stock es menor o igual al stock crítico, se debe mostrar una advertencia ("¡Quedan solo N unidades!").
- Si el stock es 0, el botón para añadir al carrito debe deshabilitarse.

#### 3.2.6 Requisito funcional 6

**Requerimiento funcional 6:** Carrito de compras
**Actores:** Cliente
**Descripción:** El sistema debe permitir agregar productos al carrito, modificar la cantidad de cada producto y eliminarlo del carrito, respetando siempre el stock disponible.

**Criterios de aceptación:**
- No se puede agregar una cantidad mayor al stock disponible del producto.
- El total del carrito se debe recalcular automáticamente al modificar cantidades.
- El número de productos en el carrito debe reflejarse en el ícono del carrito en el menú superior.

#### 3.2.7 Requisito funcional 7

**Requerimiento funcional 7:** Persistencia del carrito
**Actores:** Cliente
**Descripción:** El contenido del carrito de compras debe guardarse en el almacenamiento local del navegador (localStorage, clave tf_cart), de manera que se mantenga disponible si el usuario cierra la pestaña o recarga la página.

#### 3.2.8 Requisito funcional 8

**Requerimiento funcional 8:** Formulario de contacto
**Actores:** Visitante, Cliente
**Descripción:** El sistema debe permitir enviar un mensaje desde pages/tienda/contacto.html.

**Criterios de aceptación:**
- Al enviar el formulario con todos los campos válidos, se muestra un mensaje de confirmación y el formulario se limpia.

**Reglas de validación del formulario de contacto:**
- Nombre: obligatorio, máximo 100 caracteres.
- Correo: opcional; si se ingresa, máximo 100 caracteres y dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.
- Comentario: obligatorio, máximo 500 caracteres, con contador de caracteres visible mientras se escribe.

#### 3.2.9 Requisito funcional 9

**Requerimiento funcional 9:** Blog de noticias
**Actores:** Visitante, Cliente
**Descripción:** El sistema debe mostrar un listado de publicaciones del blog (imagen, título y descripción corta) en pages/tienda/blogs.html, y el detalle completo de cada publicación (imagen, título y descripción larga) en una página independiente por cada blog.

#### 3.2.10 Requisito funcional 10

**Requerimiento funcional 10:** Gestión de productos (crear, editar y visualizar)
**Actores:** Administrador, Vendedor
**Descripción:** El panel de administración debe permitir listar y visualizar el detalle de cada producto; el rol Administrador además debe poder crear nuevos productos y editar los existentes.

**Reglas de validación del formulario de producto:**
- Código de producto: obligatorio, texto, mínimo 3 caracteres, sin límite máximo, único en el catálogo.
- Nombre: obligatorio, máximo 100 caracteres.
- Descripción: opcional, máximo 500 caracteres.
- Precio: obligatorio, numérico, mínimo 0 (un precio 0 se considera producto gratuito), sin límite máximo, admite decimales.
- Stock: obligatorio, número entero, mínimo 0, sin límite máximo.
- Stock crítico: opcional, número entero, mínimo 0.
- Categoría: obligatoria, seleccionada desde una lista predefinida.
- Imagen(es): opcional.

#### 3.2.11 Requisito funcional 11

**Requerimiento funcional 11:** Gestión de usuarios (crear, editar y visualizar)
**Actores:** Administrador
**Descripción:** El panel de administración debe permitir al Administrador listar, visualizar, crear y editar usuarios del sistema, incluyendo la asignación de su tipo de perfil.

**Reglas de validación del formulario de usuario:**
- Se aplican las mismas reglas de RUN, nombre, apellidos, correo, contraseña, región, comuna y dirección definidas en el Requerimiento funcional 1 (Registro de usuario).
- Tipo de usuario: obligatorio, seleccionado entre Administrador, Vendedor o Cliente; este campo solo se muestra y se puede editar desde el panel de administración.

#### 3.2.12 Requisito funcional 12

**Requerimiento funcional 12:** Control de acceso por roles
**Actores:** Administrador, Vendedor, Cliente
**Descripción:** El sistema debe restringir el acceso a las páginas del panel de administración según el rol del usuario autenticado.

**Criterios de aceptación:**
- Un usuario sin sesión iniciada, o con rol Cliente, no puede acceder a ninguna página del panel de administración y es redirigido a iniciar sesión.
- Un usuario con rol Vendedor solo puede acceder a las páginas de productos (listado y detalle); si intenta ingresar directamente a una página exclusiva de Administrador (usuarios, nuevo/editar producto), es redirigido al listado de productos y las opciones no disponibles se ocultan del menú.
- Un usuario con rol Administrador tiene acceso a todas las secciones del panel.

#### 3.2.13 Requisito funcional 13

**Requerimiento funcional 13:** Selección dinámica de región y comuna
**Actores:** Cliente, Administrador
**Descripción:** En los formularios de registro de usuario y de gestión de usuarios, al seleccionar una región el sistema debe actualizar automáticamente el listado de comunas disponibles para esa región, a partir del arreglo definido en js/regiones.js.

#### 3.2.14 Requisito funcional 14

**Requerimiento funcional 14:** Panel principal del administrador
**Actores:** Administrador, Vendedor
**Descripción:** Al ingresar al panel de administración, el sistema debe mostrar una página de inicio (home) con un menú lateral de navegación visible y un área de contenido central, además de indicar el nombre y el rol del usuario que inició sesión.

### 3.3 Requisitos no funcionales

#### 3.3.1 Requisitos de rendimiento

Al no depender de un servidor propio ni de una base de datos externa en esta entrega, se espera que las páginas del sitio carguen en menos de 2 segundos con una conexión a internet estándar.

El catálogo de productos, al estar precargado en localStorage, debe mostrarse de forma inmediata (sin tiempos de espera perceptibles) al filtrar por categoría o al abrir el detalle de un producto. En entregas futuras, al incorporar un backend, se definirán métricas de rendimiento adicionales (por ejemplo, tiempo de respuesta de las consultas a la base de datos).

#### 3.3.2 Seguridad

En esta primera entrega, orientada al desarrollo del frontend, se contemplan las siguientes consideraciones de seguridad:

- **Empleo de técnicas criptográficas:** no se implementa cifrado de contraseñas en esta entrega, ya que los datos se guardan localmente en el navegador; se documenta como una limitación a resolver cuando exista backend (ver sección 2.6, Requisitos Futuros).
- **Registro de ficheros con "logs" de actividad:** no se implementa en esta entrega.
- **Asignación de determinadas funcionalidades a determinados módulos:** el control de acceso al panel de administración se concentra en el archivo js/admin-guard.js, que se ejecuta antes de mostrar cada página del panel.
- **Restricciones de comunicación entre determinados módulos:** las páginas del panel de administración no son accesibles sin una sesión activa; las páginas exclusivas de Administrador no son accesibles para el rol Vendedor.
- **Comprobaciones de integridad de información crítica:** antes de guardar un producto o un usuario, el sistema valida en el navegador que los campos obligatorios cumplan el formato y los rangos definidos en la sección 3.2 (por ejemplo, unicidad del código de producto y del correo electrónico).

#### 3.3.3 Fiabilidad

Al tratarse de una aplicación 100% en el lado del cliente (sin servidor propio), no se contemplan caídas de servicio asociadas al backend en esta entrega. El principal riesgo de fiabilidad es la pérdida de datos si el usuario borra los datos de navegación (localStorage) de su navegador; este riesgo se documenta como una limitación de la solución actual, que se resolverá al incorporar una base de datos persistente en el servidor.

#### 3.3.4 Disponibilidad

El sitio se publica como página estática en GitHub Pages, servicio que declara una disponibilidad cercana al 99,9% del tiempo. No se contemplan ventanas de mantenimiento programado en esta entrega.

#### 3.3.5 Mantenibilidad

El código se mantiene separado por responsabilidad (HTML para estructura, CSS para estilos y JavaScript para comportamiento), organizado en las carpetas css/, js/, pages/tienda/ y pages/admin/, lo que facilita que un desarrollador nuevo pueda ubicar y modificar cada parte del sistema.

El mantenimiento del sistema debe ser realizado por el equipo de desarrollo del proyecto, utilizando el repositorio de GitHub como fuente única del código.

Los cambios se documentan mediante mensajes de commit claros y descriptivos en el historial de Git, y se organizan en ramas de trabajo (por ejemplo, dev/ropadron) que se integran a la rama principal (main) mediante pull requests.

#### 3.3.6 Portabilidad

El sistema se desarrolló utilizando exclusivamente tecnologías estándar del navegador, por lo que su portabilidad es alta:

- **Porcentaje de componentes dependientes del servidor:** 0% en esta entrega; toda la lógica se ejecuta en el navegador del cliente.
- **Porcentaje de código dependiente del servidor:** 0% en esta entrega.
- **Uso de un determinado lenguaje por su portabilidad:** se utilizó HTML5, CSS3 y JavaScript (ES6) estándar, sin dependencias de un lenguaje de backend específico, precisamente para facilitar su portabilidad entre distintos entornos de hosting.
- **Uso de un determinado compilador o plataforma de desarrollo:** no se requiere compilación; el código se ejecuta directamente en cualquier navegador moderno.
- **Uso de un determinado sistema operativo:** ninguno; al ser una aplicación web, funciona en cualquier sistema operativo que cuente con un navegador compatible (Windows, macOS, Linux, Android, iOS).

### 3.4 Otros Requisitos

A la fecha de esta versión del documento no se han identificado requisitos adicionales fuera de las categorías anteriores. Este apartado se actualizará en las siguientes entregas de la asignatura si surgen nuevos requisitos (por ejemplo, de accesibilidad o de posicionamiento en buscadores) durante el desarrollo del backend y la base de datos.
