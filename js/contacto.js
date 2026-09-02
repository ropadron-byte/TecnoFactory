document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-contacto");
  if (!form) return;

  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const comentario = document.getElementById("comentario");
  const contadorComentario = document.getElementById("contador-comentario");
  const status = document.getElementById("form-status");

  const DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

  function setFieldState(fieldId, isValid, hasValue) {
    const field = document.getElementById(fieldId);
    field.classList.remove("invalid", "valid");
    if (!hasValue && fieldId !== "field-nombre" && fieldId !== "field-comentario") {
      return; // campo opcional vacío: sin marcar error
    }
    field.classList.add(isValid ? "valid" : "invalid");
  }

  function validarNombre() {
    const valor = nombre.value.trim();
    const valido = valor.length > 0 && valor.length <= 100;
    setFieldState("field-nombre", valido, true);
    return valido;
  }

  function correoTieneDominioValido(valor) {
    const partes = valor.split("@");
    if (partes.length !== 2) return false;
    const dominio = partes[1].toLowerCase();
    return DOMINIOS_PERMITIDOS.indexOf(dominio) !== -1;
  }

  function validarCorreo() {
    const valor = correo.value.trim();
    if (valor.length === 0) {
      // El correo es opcional: no se marca como inválido si está vacío
      correo.closest(".field").classList.remove("invalid", "valid");
      return true;
    }
    const formatoBasico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    const valido = formatoBasico && valor.length <= 100 && correoTieneDominioValido(valor);
    setFieldState("field-correo", valido, true);
    return valido;
  }

  function validarComentario() {
    const valor = comentario.value.trim();
    const valido = valor.length > 0 && valor.length <= 500;
    setFieldState("field-comentario", valido, true);
    return valido;
  }

  nombre.addEventListener("input", validarNombre);
  correo.addEventListener("input", validarCorreo);
  comentario.addEventListener("input", function () {
    contadorComentario.textContent = comentario.value.length;
    validarComentario();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreOk = validarNombre();
    const correoOk = validarCorreo();
    const comentarioOk = validarComentario();

    status.classList.remove("show", "success", "error");

    if (nombreOk && correoOk && comentarioOk) {
      status.textContent = "¡Gracias, " + nombre.value.trim() + "! Tu mensaje fue enviado correctamente.";
      status.classList.add("show", "success");
      form.reset();
      contadorComentario.textContent = "0";
      [nombre, correo, comentario].forEach(function (input) {
        input.closest(".field").classList.remove("valid", "invalid");
      });
    } else {
      status.textContent = "Revisa los campos marcados en rojo antes de enviar el formulario.";
      status.classList.add("show", "error");
    }
  });
});
