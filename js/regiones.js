const REGIONES = [
    { region: "Región Metropolitana", comunas: ["Santiago", "Puente Alto", "Maipú", "La Florida", "Ñuñoa"] },
    { region: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"] },
    { region: "Biobío", comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Chillán"] },
    { region: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle"] },
    { region: "Araucanía", comunas: ["Temuco", "Villarrica", "Angol"] }
  ];
  
  function poblarRegiones(selectRegionId, selectComunaId) {
    const selectRegion = document.getElementById(selectRegionId);
    const selectComuna = document.getElementById(selectComunaId);
    if (!selectRegion || !selectComuna) return;
  
    REGIONES.forEach(function (r) {
      const opt = document.createElement("option");
      opt.value = r.region;
      opt.textContent = r.region;
      selectRegion.appendChild(opt);
    });
  
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
  }