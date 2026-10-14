# Huerto Hogar — Tienda online en React

Proyecto de la **Evaluación Parcial 2** de DSY1104 (Duoc UC). Es la migración a React del
sitio que en la Evaluación 1 estaba hecho con HTML, CSS, JavaScript y Bootstrap.

## Cómo ejecutarlo

Necesitas Node.js 18 o superior.

```bash
npm install     # instala las dependencias (solo la primera vez)
npm run dev     # levanta el servidor de desarrollo
```

Se abre en `http://localhost:5173`.

Otros comandos:

```bash
npm run build     # genera la versión de producción en dist/
npm run preview   # revisa esa versión compilada
npm run test      # ejecuta las pruebas unitarias con Vitest
npm run coverage  # ejecuta las pruebas y reporta la cobertura
```

## Cuentas de prueba

| Correo | Contraseña | Perfil |
|---|---|---|
| admin@duoc.cl | admin123 | Administrador |
| vendedor@duoc.cl | venta123 | Vendedor |
| cliente@gmail.com | cliente1 | Cliente |

También puedes crear una cuenta en la página de registro e iniciar sesión con ella.

## Estructura

Cada vista mantiene sus **tres archivos separados**: el marcado, los estilos y la lógica.

```
src/
├── main.jsx                  Punto de entrada: monta React y carga Bootstrap
├── App.jsx                   Rutas de la aplicación
├── estilos/global.css        Paleta, tipografías y estilos compartidos
│
├── vistas/                   Una carpeta por vista, con 3 archivos cada una
│   ├── Inicio/
│   │   ├── Inicio.jsx            marcado      (antes home.html)
│   │   ├── Inicio.css            estilos      (antes style-home.css)
│   │   └── useInicio.js          lógica       (antes functions-home.js)
│   ├── Catalogo/     Catalogo.jsx   + Catalogo.css   + useCatalogo.js
│   ├── Carrito/      Carrito.jsx    + Carrito.css    + useCarrito.js
│   ├── Login/        Login.jsx      + Login.css      + useLogin.js
│   └── Registro/     Registro.jsx   + Registro.css   + useRegistro.js
│
├── componentes/              Piezas reutilizables, con su jsx y su css
│   ├── Navbar/               La barra que antes se copiaba en las 5 páginas
│   ├── TarjetaProducto/      Una tarjeta del catálogo
│   ├── CampoTexto/           Un campo de formulario con su error
│   └── FilaCarrito/          Una fila de la tabla del carrito
│
├── contexto/                 Estado compartido por toda la aplicación
│   ├── CarritoContext.jsx    Carrito, totales y persistencia
│   └── SesionContext.jsx     Usuario conectado y cuentas registradas
│
├── datos/productos.js        Catálogo, cuentas de prueba y reglas de envío
├── utilidades/
│   ├── validaciones.js       Reglas de validación (funciones puras)
│   └── useFormulario.js      Hook propio que maneja cualquier formulario
└── pruebas/configuracion.js  Entorno de pruebas, listo para Vitest
```

## Qué corresponde a qué

| Versión anterior | Versión React |
|---|---|
| `inicio/home.html` | `vistas/Inicio/Inicio.jsx` |
| `inicio/style-home.css` | `vistas/Inicio/Inicio.css` |
| `inicio/functions-home.js` | `vistas/Inicio/useInicio.js` |
| `catalogo/catalogo.html` + sus 8 tarjetas escritas a mano | `vistas/Catalogo/Catalogo.jsx` + `componentes/TarjetaProducto` |
| `carrito/carrito.html` + filas de ejemplo | `vistas/Carrito/Carrito.jsx` + `componentes/FilaCarrito` |
| `login/functions-login.js` y `register/functions-regis.js` | `useLogin.js`, `useRegistro.js` y `utilidades/validaciones.js` |
| El `<header>` repetido en las 5 páginas | `componentes/Navbar` |
| Las funciones del carrito repetidas en 3 archivos | `contexto/CarritoContext.jsx` |

## Cómo se gestionan propiedades y estado

Esto es lo que evalúa el indicador IE2.1.2, conviene tenerlo claro para la presentación.

**Propiedades (props).** Un componente recibe datos de quien lo usa y no sabe nada del resto
de la aplicación. `TarjetaProducto` recibe `producto` y `onAgregar`: dibuja lo que le pasen y
avisa cuando el usuario presiona, sin saber qué es un carrito. `CampoTexto` recibe `valor`,
`error`, `tocado` y las funciones `onChange` y `onBlur`. `FilaCarrito` recibe `linea`,
`onCambiarCantidad` y `onEliminar`.

**Estado local (useState).** Cada componente guarda lo que solo a él le importa. `Navbar`
guarda si el menú está desplegado, lo que antes hacía el JavaScript de Bootstrap.
`TarjetaProducto` guarda si acaba de mostrarse el mensaje "Agregado!". `Catalogo` guarda la
categoría elegida y el texto buscado.

**Estado compartido (Context).** El carrito lo usan la barra de navegación, el catálogo y la
vista del carrito. En vez de que cada página lea `localStorage` por su cuenta, como pasaba
antes, vive en un solo lugar y todos ven lo mismo al instante.

**Efectos (useEffect).** `CarritoContext` guarda el carrito en el navegador cada vez que
cambia. `TarjetaProducto` usa un temporizador y lo limpia cuando el componente desaparece.

**Cálculos memorizados (useMemo).** Los totales del carrito y la lista filtrada del catálogo
se recalculan solo cuando cambian sus datos, no en cada redibujado.

## Diseño responsivo

Bootstrap 5 se importa una sola vez en `main.jsx`. Se usa su sistema de columnas
(`col-6 col-md-4 col-lg-3` en las tarjetas: dos por fila en teléfono, tres en tablet y cuatro
en escritorio), la barra de navegación que se colapsa bajo 992 px, `table-responsive` en el
carrito y `row` / `col-md-6` en los formularios. Sobre esa base, cada archivo CSS propio
aplica la paleta y las tipografías del caso.

## Pruebas unitarias

El entorno queda configurado en `vite.config.js` (Vitest + jsdom + cobertura v8) y en
`src/pruebas/configuracion.js`. **Todavía no hay pruebas escritas**: se desarrollan en la
siguiente etapa.

El código quedó preparado para que sean fáciles de escribir: las reglas de
`utilidades/validaciones.js` son funciones puras que se prueban sin montar nada, y los
componentes reciben sus datos por propiedades, así que se pueden montar aislados con
Testing Library.

## Cambios respecto a la versión anterior

**Corregido en la migración**

- Los dos campos del registro que compartían el mismo `id` ahora son componentes
  independientes, así que ambos se validan.
- Las etiquetas quedaron asociadas a sus campos mediante `htmlFor`.
- El `<body>` que aparecía anidado dentro de otro `<body>` desapareció: ahora hay un solo
  `index.html`.
- Las cajas de login y registro ya no usan `position: absolute`, que las sacaba del flujo de
  la página.
- El carrito dejó de depender de que las páginas compartan el mismo origen: al ser una sola
  aplicación, el problema de "agrego en el catálogo y el carrito aparece vacío" no existe.

**Agregado**

- Filtro por categoría y buscador en el catálogo. Las categorías ya estaban en el HTML
  anterior como atributo `data-cat`, pero no había botones que las usaran.
- Botón para vaciar el carrito y para cerrar sesión desde la barra.

**Pendiente**

- Footer en las páginas.
- Vista de detalle de producto, blogs, sección Nosotros y contacto.
- Módulo administrador.
- Las pruebas unitarias.
