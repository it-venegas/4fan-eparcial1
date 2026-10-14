/* ============================================================
   Huerto Hogar - Datos del catalogo

   Estos arreglos reemplazan a los productos que antes estaban
   escritos directamente en el HTML del catalogo. Al tenerlos aqui,
   las vistas los reciben como datos y los componentes los dibujan
   a partir de sus propiedades.

   En la siguiente entrega del proyecto estos datos vendran de una
   base de datos a traves del backend.
   ============================================================ */

/* Categorias que se muestran como botones de filtro en el catalogo. */
export const CATEGORIAS = [
    { valor: "todas", nombre: "Todas" },
    { valor: "frutas", nombre: "Frutas Frescas" },
    { valor: "verduras", nombre: "Verduras Organicas" },
    { valor: "organicos", nombre: "Productos Organicos" }
];

export const PRODUCTOS = [
    {
        codigo: "FR001",
        nombre: "Manzanas Fuji",
        categoria: "frutas",
        precio: 1200,
        formato: "malla de 1 kilo",
        stock: 150,
        imagen: "/img/manzana.jpg"
    },
    {
        codigo: "FR002",
        nombre: "Platanos Cavendish",
        categoria: "frutas",
        precio: 800,
        formato: "kilo",
        stock: 250,
        imagen: "/img/platano.jpg"
    },
    {
        codigo: "FR003",
        nombre: "Naranjas Valencia",
        categoria: "frutas",
        precio: 1000,
        formato: "malla de 2 kilos",
        stock: 200,
        imagen: "/img/naranja.jpg"
    },
    {
        codigo: "VR001",
        nombre: "Zanahorias organicas",
        categoria: "verduras",
        precio: 900,
        formato: "malla de 1 kilo",
        stock: 100,
        imagen: "/img/zanahorias.jpg"
    },
    {
        codigo: "VR002",
        nombre: "Lechuga organica",
        categoria: "verduras",
        precio: 790,
        formato: "unidad",
        stock: 80,
        imagen: "/img/lechuga.jpg"
    },
    {
        codigo: "VR003",
        nombre: "Papas",
        categoria: "verduras",
        precio: 1590,
        formato: "malla de 2 kilos",
        stock: 120,
        imagen: "/img/papa.jpg"
    },
    {
        codigo: "PO001",
        nombre: "Tomates organicos",
        categoria: "organicos",
        precio: 2490,
        formato: "kilo",
        stock: 60,
        imagen: "/img/tomate.jpg"
    },
    {
        codigo: "PO002",
        nombre: "Palta Hass",
        categoria: "organicos",
        precio: 3290,
        formato: "malla de 1 kilo",
        stock: 45,
        imagen: "/img/palta.jpg"
    }
];

/* Cuentas de prueba para el inicio de sesion. */
export const USUARIOS = [
    {
        correo: "admin@duoc.cl",
        contrasena: "admin123",
        nombre: "Isabel Torres",
        tipo: "Administrador"
    },
    {
        correo: "vendedor@duoc.cl",
        contrasena: "venta123",
        nombre: "Francisca Silva",
        tipo: "Vendedor"
    },
    {
        correo: "cliente@gmail.com",
        contrasena: "cliente1",
        nombre: "Josefa Munoz",
        tipo: "Cliente"
    }
];

/* Reglas de negocio del despacho. */
export const COSTO_ENVIO = 2000;
export const MONTO_ENVIO_GRATIS = 20000;
