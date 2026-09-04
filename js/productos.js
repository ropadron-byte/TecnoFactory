const PRODUCTS = [
    {
      id: "p001",
      code: "TF-NB-001",
      name: "Notebook Factory X14",
      category: "Notebooks",
      price: 549990,
      oldPrice: 619990,
      stock: 12,
      stockCritico: 3,
      image: "notebook",
      shortDesc: "Notebook 14\" para trabajo y estudio, liviano y potente.",
      description:
        "El Notebook Factory X14 combina un chasis liviano de aluminio con un procesador " +
        "pensado para el día a día: navegación, oficina, clases online y trabajo remoto. " +
        "Su batería de larga duración y su pantalla antirreflejo lo hacen ideal para " +
        "moverse entre la casa, la oficina y la universidad.",
      specs: [
        { label: "Pantalla", value: "14\" FHD antirreflejo" },
        { label: "Procesador", value: "8 núcleos, 3.2GHz" },
        { label: "RAM", value: "16GB" },
        { label: "Almacenamiento", value: "512GB SSD" },
        { label: "Batería", value: "hasta 10 horas" },
        { label: "Peso", value: "1.3 kg" }
      ]
    },
    {
      id: "p002",
      code: "TF-AU-014",
      name: "Audífonos NoiseCancel Pro",
      category: "Audio",
      price: 79990,
      oldPrice: null,
      stock: 40,
      stockCritico: 8,
      image: "audifonos",
      shortDesc: "Audífonos inalámbricos con cancelación activa de ruido.",
      description:
        "Diseñados para largas jornadas de estudio o trabajo, estos audífonos " +
        "inalámbricos incorporan cancelación activa de ruido, controles táctiles " +
        "y hasta 30 horas de batería con su estuche de carga.",
      specs: [
        { label: "Tipo", value: "Over-ear inalámbrico" },
        { label: "Cancelación de ruido", value: "Activa (ANC)" },
        { label: "Autonomía", value: "30 h con estuche" },
        { label: "Conectividad", value: "Bluetooth 5.3" },
        { label: "Peso", value: "250 g" }
      ]
    },
    {
      id: "p003",
      code: "TF-MO-027",
      name: "Mouse Ergonómico Wireless",
      category: "Accesorios",
      price: 17990,
      oldPrice: 21990,
      stock: 2,
      stockCritico: 5,
      image: "mouse",
      shortDesc: "Mouse inalámbrico ergonómico, ideal para largas jornadas.",
      description:
        "Su forma ergonómica reduce la fatiga de la muñeca durante sesiones " +
        "largas de trabajo. Sensor óptico de alta precisión y conexión " +
        "inalámbrica estable mediante receptor USB.",
      specs: [
        { label: "Conectividad", value: "Wireless 2.4GHz" },
        { label: "Sensor", value: "Óptico, 1600 DPI" },
        { label: "Botones", value: "6 programables" },
        { label: "Batería", value: "AA (incluida)" }
      ]
    },
    {
      id: "p004",
      code: "TF-MN-009",
      name: "Monitor Curvo 27\" 144Hz",
      category: "Monitores",
      price: 249990,
      oldPrice: null,
      stock: 7,
      stockCritico: 2,
      image: "monitor",
      shortDesc: "Monitor curvo de 27\" con 144Hz para trabajo y gaming.",
      description:
        "Pantalla curva de 27 pulgadas con 144Hz de tasa de refresco, pensada " +
        "tanto para productividad como para uso gamer. Colores calibrados y " +
        "soporte ajustable en altura incluido.",
      specs: [
        { label: "Tamaño", value: "27\" curvo" },
        { label: "Resolución", value: "2560x1440" },
        { label: "Tasa de refresco", value: "144Hz" },
        { label: "Panel", value: "VA" },
        { label: "Puertos", value: "HDMI x2, DisplayPort" }
      ]
    },
    {
      id: "p005",
      code: "TF-TC-033",
      name: "Teclado Mecánico Compacto",
      category: "Accesorios",
      price: 44990,
      oldPrice: null,
      stock: 15,
      stockCritico: 4,
      image: "teclado",
      shortDesc: "Teclado mecánico compacto con retroiluminación RGB.",
      description:
        "Formato compacto 75% que ahorra espacio en el escritorio sin " +
        "sacrificar teclas de función. Switches mecánicos táctiles y " +
        "retroiluminación RGB personalizable.",
      specs: [
        { label: "Formato", value: "75% compacto" },
        { label: "Switches", value: "Mecánicos táctiles" },
        { label: "Retroiluminación", value: "RGB" },
        { label: "Conexión", value: "USB-C / Bluetooth" }
      ]
    },
    {
      id: "p006",
      code: "TF-SS-041",
      name: "SSD Externo 1TB",
      category: "Almacenamiento",
      price: 59990,
      oldPrice: 68990,
      stock: 0,
      stockCritico: 3,
      image: "ssd",
      shortDesc: "Disco SSD externo de 1TB, compacto y de alta velocidad.",
      description:
        "Almacenamiento portátil de 1TB con velocidades de lectura de hasta " +
        "1050MB/s. Carcasa resistente a golpes, ideal para respaldar " +
        "proyectos y transportar archivos pesados.",
      specs: [
        { label: "Capacidad", value: "1TB" },
        { label: "Velocidad lectura", value: "hasta 1050MB/s" },
        { label: "Interfaz", value: "USB-C 3.2" },
        { label: "Resistencia", value: "Golpes y caídas" }
      ]
    }
  ];
  
  /** Formatea un número como precio CLP */
  function formatCLP(value) {
    return "$" + value.toLocaleString("es-CL");
  }
  
  /** Busca un producto por id */
  function getProductById(id) {
    return PRODUCTS.find(function (p) { return p.id === id; });
  }
  