const USUARIOS_KEY = "tf_usuarios";
const SESION_KEY = "tf_sesion";

// Usuario administrador que viene incluido "de fábrica", para poder
// entrar al panel de administración la primera vez, sin tener que
// registrar una cuenta a mano. Se crea solo una vez, la primera vez
// que se pide la lista de usuarios y todavía no hay ninguno guardado.
//
// Credenciales de acceso:
//   correo:      admin@tecnofactory.cl
//   contraseña:  admin123
const USUARIO_ADMIN_BASE = {
  id: 1,
  run: "123456785",
  nombre: "Admin",
  apellidos: "Tecno Factory",
  correo: "admin@tecnofactory.cl",
  contrasena: "admin123",
  fecha_nacimiento: "",
  tipo: "Administrador",
  region: "Región Metropolitana",
  comuna: "Santiago",
  direccion: "Casa Matriz Tecno Factory"
};

function obtenerUsuarios() {
    const data = localStorage.getItem(USUARIOS_KEY);
    if (!data) {
      // Primera visita: dejamos el usuario administrador base ya creado.
      localStorage.setItem(USUARIOS_KEY, JSON.stringify([USUARIO_ADMIN_BASE]));
      return [USUARIO_ADMIN_BASE];
    }
    const usuarios = JSON.parse(data);
    // Por si alguien ya tenía usuarios guardados de una versión anterior
    // (sin el admin base), nos aseguramos de que siempre exista al menos
    // un usuario Administrador para poder entrar al panel.
    const yaTieneAdmin = usuarios.some(function (u) { return u.tipo === "Administrador"; });
    if (!yaTieneAdmin) {
      usuarios.push(USUARIO_ADMIN_BASE);
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
    }
    return usuarios;
  }

  // Revisa si ya existe un usuario registrado con ese correo (sin
  // importar mayúsculas/minúsculas). Se usa para no permitir correos
  // duplicados al registrarse o al crear un usuario desde el admin.
  // idExcluir permite ignorar al propio usuario cuando se está editando.
  function correoYaRegistrado(correo, idExcluir) {
    const correoNormalizado = (correo || "").trim().toLowerCase();
    return obtenerUsuarios().some(function (u) {
      return u.correo.trim().toLowerCase() === correoNormalizado && u.id !== idExcluir;
    });
  }

  function guardarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuario.id = Date.now();
    usuarios.push(usuario);
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  }
  
  function actualizarUsuario(id, datosNuevos) {
    const usuarios = obtenerUsuarios();
    const index = usuarios.findIndex(function (u) { return u.id === id; });
    if (index === -1) return;
    // Si viene una contraseña vacía (por ejemplo, al editar un usuario sin
    // querer cambiarla), no pisamos la contraseña que ya tenía guardada.
    if (!datosNuevos.contrasena) {
      delete datosNuevos.contrasena;
    }
    usuarios[index] = Object.assign(usuarios[index], datosNuevos);
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  }
  
  function eliminarUsuario(id) {
    const usuarios = obtenerUsuarios().filter(function (u) { return u.id !== id; });
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  }

  // ---------------------------------------------------------------------
  // Sesión (inicio de sesión / cierre de sesión)
  // ---------------------------------------------------------------------

  /**
   * Intenta iniciar sesión con un correo y contraseña. Devuelve el
   * usuario encontrado (sin la contraseña) si las credenciales son
   * correctas, o null si no coinciden con ningún usuario registrado.
   */
  function iniciarSesion(correo, contrasena) {
    const correoNormalizado = (correo || "").trim().toLowerCase();
    const usuario = obtenerUsuarios().find(function (u) {
      return u.correo.trim().toLowerCase() === correoNormalizado && u.contrasena === contrasena;
    });
    if (!usuario) return null;

    const sesion = Object.assign({}, usuario);
    delete sesion.contrasena;
    localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
    return sesion;
  }

  // Devuelve el usuario que tiene la sesión iniciada actualmente, o null
  // si nadie ha iniciado sesión.
  function obtenerSesion() {
    const data = localStorage.getItem(SESION_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Cierra la sesión actual.
  function cerrarSesion() {
    localStorage.removeItem(SESION_KEY);
  }
  
  function obtenerUsuarioPorId(id) {
    return obtenerUsuarios().find(function (u) { return u.id === id; });
  }
  
  function validarRun(run) {
    run = run.replace(/[^0-9kK]/g, "").toUpperCase();
    if (run.length < 7 || run.length > 9) return false;
    const cuerpo = run.slice(0, -1);
    const dv = run.slice(-1);
    let suma = 0, multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += multiplo * parseInt(cuerpo[i], 10);
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    const resto = 11 - (suma % 11);
    const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
    return dv === dvEsperado;
  }