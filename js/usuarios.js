function obtenerUsuarios() {
    const data = localStorage.getItem("tf_usuarios");
    return data ? JSON.parse(data) : [];
  }
  
  function guardarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuario.id = Date.now();
    usuarios.push(usuario);
    localStorage.setItem("tf_usuarios", JSON.stringify(usuarios));
  }
  
  function actualizarUsuario(id, datosNuevos) {
    const usuarios = obtenerUsuarios();
    const index = usuarios.findIndex(function (u) { return u.id === id; });
    if (index === -1) return;
    usuarios[index] = Object.assign(usuarios[index], datosNuevos);
    localStorage.setItem("tf_usuarios", JSON.stringify(usuarios));
  }
  
  function eliminarUsuario(id) {
    const usuarios = obtenerUsuarios().filter(function (u) { return u.id !== id; });
    localStorage.setItem("tf_usuarios", JSON.stringify(usuarios));
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