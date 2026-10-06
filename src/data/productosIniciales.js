// Catálogo inicial de la tienda (se copia a localStorage la primera vez).
// Cada producto tiene un "codigo" único que se usa como identificador.
// "descuento" es un porcentaje (0 = sin oferta); los productos con descuento
// aparecen en la vista Ofertas.
export const PRODUCTOS_INICIALES = [
  {
    codigo: "TF-SP-001",
    nombre: "iPhone 5s",
    categoria: "Smartphones",
    descripcion:
      "The iPhone 5s is a classic smartphone known for its compact design and advanced features during its release. While it's an older model, it still provides a reliable user experience.",
    precio: 189990,
    stock: 25,
    stockCritico: 3,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/3.webp"
    ]
  },
  {
    codigo: "TF-SP-002",
    nombre: "iPhone 6",
    categoria: "Smartphones",
    descripcion:
      "The iPhone 6 is a stylish and capable smartphone with a larger display and improved performance. It introduced new features and design elements, making it a popular choice in its time.",
    precio: 284990,
    stock: 60,
    stockCritico: 7,
    descuento: 10,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/3.webp"
    ]
  },
  {
    codigo: "TF-SP-003",
    nombre: "iPhone 13 Pro",
    categoria: "Smartphones",
    descripcion:
      "The iPhone 13 Pro is a cutting-edge smartphone with a powerful camera system, high-performance chip, and stunning display. It offers advanced features for users who demand top-notch technology.",
    precio: 1044990,
    stock: 56,
    stockCritico: 7,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/3.webp"
    ]
  },
  {
    codigo: "TF-SP-004",
    nombre: "iPhone X",
    categoria: "Smartphones",
    descripcion:
      "The iPhone X is a flagship smartphone featuring a bezel-less OLED display, facial recognition technology (Face ID), and impressive performance. It represents a milestone in iPhone design and innovation.",
    precio: 854990,
    stock: 37,
    stockCritico: 4,
    descuento: 15,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/3.webp"
    ]
  },
  {
    codigo: "TF-SP-005",
    nombre: "Oppo A57",
    categoria: "Smartphones",
    descripcion:
      "The Oppo A57 is a mid-range smartphone known for its sleek design and capable features. It offers a balance of performance and affordability, making it a popular choice.",
    precio: 237490,
    stock: 19,
    stockCritico: 2,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/3.webp"
    ]
  },
  {
    codigo: "TF-SP-006",
    nombre: "Oppo F19 Pro Plus",
    categoria: "Smartphones",
    descripcion:
      "The Oppo F19 Pro Plus is a feature-rich smartphone with a focus on camera capabilities. It boasts advanced photography features and a powerful performance for a premium user experience.",
    precio: 379990,
    stock: 78,
    stockCritico: 9,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/3.webp"
    ]
  },
  {
    codigo: "TF-SP-007",
    nombre: "Oppo K1",
    categoria: "Smartphones",
    descripcion:
      "The Oppo K1 series offers a range of smartphones with various features and specifications. Known for their stylish design and reliable performance, the Oppo K1 series caters to diverse user preferences.",
    precio: 284990,
    stock: 55,
    stockCritico: 7,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/3.webp"
    ]
  },
  {
    codigo: "TF-SP-008",
    nombre: "Realme C35",
    categoria: "Smartphones",
    descripcion:
      "The Realme C35 is a budget-friendly smartphone with a focus on providing essential features for everyday use. It offers a reliable performance and user-friendly experience.",
    precio: 142490,
    stock: 48,
    stockCritico: 6,
    descuento: 20,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/3.webp"
    ]
  },
  {
    codigo: "TF-SP-009",
    nombre: "Realme X",
    categoria: "Smartphones",
    descripcion:
      "The Realme X is a mid-range smartphone known for its sleek design and impressive display. It offers a good balance of performance and camera capabilities for users seeking a quality device.",
    precio: 284990,
    stock: 12,
    stockCritico: 2,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/realme-x/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-x/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-x/3.webp"
    ]
  },
  {
    codigo: "TF-SP-010",
    nombre: "Realme XT",
    categoria: "Smartphones",
    descripcion:
      "The Realme XT is a feature-rich smartphone with a focus on camera technology. It comes equipped with advanced camera sensors, delivering high-quality photos and videos for photography enthusiasts.",
    precio: 332490,
    stock: 80,
    stockCritico: 10,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/3.webp"
    ]
  },
  {
    codigo: "TF-SP-011",
    nombre: "Samsung Galaxy S7",
    categoria: "Smartphones",
    descripcion:
      "The Samsung Galaxy S7 is a flagship smartphone known for its sleek design and advanced features. It features a high-resolution display, powerful camera, and robust performance.",
    precio: 284990,
    stock: 67,
    stockCritico: 8,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/3.webp"
    ]
  },
  {
    codigo: "TF-SP-012",
    nombre: "Samsung Galaxy S8",
    categoria: "Smartphones",
    descripcion:
      "The Samsung Galaxy S8 is a premium smartphone with an Infinity Display, offering a stunning visual experience. It boasts advanced camera capabilities and cutting-edge technology.",
    precio: 474990,
    stock: 0,
    stockCritico: 2,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/3.webp"
    ]
  },
  {
    codigo: "TF-SP-013",
    nombre: "Samsung Galaxy S10",
    categoria: "Smartphones",
    descripcion:
      "The Samsung Galaxy S10 is a flagship device featuring a dynamic AMOLED display, versatile camera system, and powerful performance. It represents innovation and excellence in smartphone technology.",
    precio: 664990,
    stock: 19,
    stockCritico: 2,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/3.webp"
    ]
  },
  {
    codigo: "TF-SP-014",
    nombre: "Vivo S1",
    categoria: "Smartphones",
    descripcion:
      "The Vivo S1 is a stylish and mid-range smartphone offering a blend of design and performance. It features a vibrant display, capable camera system, and reliable functionality.",
    precio: 237490,
    stock: 50,
    stockCritico: 6,
    descuento: 10,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/3.webp"
    ]
  },
  {
    codigo: "TF-SP-015",
    nombre: "Vivo V9",
    categoria: "Smartphones",
    descripcion:
      "The Vivo V9 is a smartphone known for its sleek design and emphasis on capturing high-quality selfies. It features a notch display, dual-camera setup, and a modern design.",
    precio: 284990,
    stock: 82,
    stockCritico: 10,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/3.webp"
    ]
  },
  {
    codigo: "TF-SP-016",
    nombre: "Vivo X21",
    categoria: "Smartphones",
    descripcion:
      "The Vivo X21 is a premium smartphone with a focus on cutting-edge technology. It features an in-display fingerprint sensor, a high-resolution display, and advanced camera capabilities.",
    precio: 474990,
    stock: 7,
    stockCritico: 2,
    descuento: 25,
    urls: [
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/3.webp"
    ]
  },
  {
    codigo: "TF-NB-001",
    nombre: "Apple MacBook Pro 14 Inch Space Grey",
    categoria: "Notebooks",
    descripcion:
      "The MacBook Pro 14 Inch in Space Grey is a powerful and sleek laptop, featuring Apple's M1 Pro chip for exceptional performance and a stunning Retina display.",
    precio: 1899990,
    stock: 24,
    stockCritico: 3,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/3.webp"
    ]
  },
  {
    codigo: "TF-NB-002",
    nombre: "Asus Zenbook Pro Dual Screen Laptop",
    categoria: "Notebooks",
    descripcion:
      "The Asus Zenbook Pro Dual Screen Laptop is a high-performance device with dual screens, providing productivity and versatility for creative professionals.",
    precio: 1709990,
    stock: 45,
    stockCritico: 5,
    descuento: 12,
    urls: [
      "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/3.webp"
    ]
  },
  {
    codigo: "TF-NB-003",
    nombre: "Huawei Matebook X Pro",
    categoria: "Notebooks",
    descripcion:
      "The Huawei Matebook X Pro is a slim and stylish laptop with a high-resolution touchscreen display, offering a premium experience for users on the go.",
    precio: 1329990,
    stock: 75,
    stockCritico: 9,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/3.webp"
    ]
  },
  {
    codigo: "TF-NB-004",
    nombre: "Lenovo Yoga 920",
    categoria: "Notebooks",
    descripcion:
      "The Lenovo Yoga 920 is a 2-in-1 convertible laptop with a flexible hinge, allowing you to use it as a laptop or tablet, offering versatility and portability.",
    precio: 1044990,
    stock: 40,
    stockCritico: 5,
    descuento: 0,
    urls: [
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/3.webp"
    ]
  },
  {
    codigo: "TF-NB-005",
    nombre: "New DELL XPS 13 9300 Laptop",
    categoria: "Notebooks",
    descripcion:
      "The New DELL XPS 13 9300 Laptop is a compact and powerful device, featuring a virtually borderless InfinityEdge display and high-end performance for various tasks.",
    precio: 1424990,
    stock: 74,
    stockCritico: 9,
    descuento: 15,
    urls: [
      "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/3.webp"
    ]
  }
];
