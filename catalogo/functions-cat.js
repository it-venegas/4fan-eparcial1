/* ============================================================
   Huerto Hogar - Funciones del catalogo

   Que hace este archivo:
   - Lee los datos de cada producto desde la propia tarjeta del HTML
     (titulo, precio, formato e imagen), por lo que no necesita un
     arreglo de productos aparte.
   - Agrega el producto al carrito y lo guarda en localStorage.
   - Actualiza el numero que se muestra junto al enlace Carrito.

   Nota: las funciones del carrito se repiten en functions-car.js y
   en functions-home.js porque el proyecto no usa un archivo JS
   compartido entre paginas.
   ============================================================ */

/* Clave con la que se guarda el carrito en el navegador. */
const CLAVE_CARRITO = "huertohogar.carrito";


/* ---------- Lectura y escritura del carrito ---------- */

/* Devuelve el carrito guardado. Si no hay nada, devuelve una lista vacia. */
function leerCarrito() {
    try {
        const guardado = localStorage.getItem(CLAVE_CARRITO);
        const lista = guardado ? JSON.parse(guardado) : [];
        return Array.isArray(lista) ? lista : [];
    } catch (error) {
        /* Si el dato guardado esta danado, partimos de cero en vez de fallar. */
        console.warn("No se pudo leer el carrito:", error);
        try {
            localStorage.removeItem(CLAVE_CARRITO);
        } catch (otroError) {
            /* El navegador tiene bloqueado el almacenamiento del sitio. */
        }
        return [];
    }
}

/* Guarda el carrito y refresca el contador de la barra de navegacion. */
function guardarCarrito(lista) {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(lista));
    } catch (error) {
        /* Pasa si el navegador tiene bloqueado el almacenamiento del sitio. */
        console.warn("No se pudo guardar el carrito:", error);
        alert("Tu navegador no esta permitiendo guardar el carrito en este sitio.");
    }
    actualizarContadorCarrito();
}


/* ---------- Utilidades ---------- */

/* Convierte el texto del precio a numero: "$1.200" se transforma en 1200. */
function precioANumero(texto) {
    return Number(String(texto).replace(/[^0-9]/g, "")) || 0;
}

/* Muestra la cantidad de productos junto al enlace Carrito del menu. */
function actualizarContadorCarrito() {
    const enlace = document.querySelector(".btn-carrito");
    if (!enlace) {
        return;
    }

    const total = leerCarrito().reduce(function (suma, linea) {
        return suma + linea.cantidad;
    }, 0);

    /* La primera vez creamos el indicador; despues solo cambiamos su numero. */
    let contador = enlace.querySelector(".contadorCarrito");
    if (!contador) {
        contador = document.createElement("span");
        contador.className = "contadorCarrito badge bg-success ms-1";
        enlace.insertAdjacentText("beforeend", " ");
        enlace.appendChild(contador);
    }

    contador.textContent = total;
    contador.style.display = total > 0 ? "" : "none";
}


/* ---------- Agregar al carrito ---------- */

/*
   La llaman los botones del catalogo con onclick="agregar(this)".
   El parametro "boton" es el boton que se presiono, y desde el
   subimos a su tarjeta para leer los datos del producto.
*/
function agregar(boton) {
    const tarjeta = boton.closest(".producto");
    if (!tarjeta) {
        return;
    }

    const producto = {
        nombre: tarjeta.querySelector(".card-title").textContent.trim(),
        precio: precioANumero(tarjeta.querySelector(".precio").textContent),
        formato: tarjeta.querySelector(".card-text").textContent.trim(),
        imagen: tarjeta.querySelector(".card-img-top").getAttribute("src"),
        cantidad: 1
    };

    const lista = leerCarrito();
    const existente = lista.find(function (linea) {
        return linea.nombre === producto.nombre;
    });

    if (existente) {
        /* Regla del equipo: si el producto ya esta, se suma la cantidad
           en lugar de repetir la linea. */
        existente.cantidad = existente.cantidad + 1;
    } else {
        lista.push(producto);
    }

    guardarCarrito(lista);
    confirmarEnBoton(boton);
}

/* Avisa en el mismo boton que el producto quedo agregado. */
function confirmarEnBoton(boton) {
    const textoOriginal = boton.textContent;
    boton.textContent = "Agregado!";
    boton.disabled = true;

    setTimeout(function () {
        boton.textContent = textoOriginal;
        boton.disabled = false;
    }, 1200);
}


/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", function () {
    actualizarContadorCarrito();
});

/* El contador se refresca tambien al volver con el boton Atras o al
   cambiar de pestana, porque el navegador puede guardar la pagina en
   memoria y no cargarla de cero. */
window.addEventListener("pageshow", actualizarContadorCarrito);
window.addEventListener("storage", actualizarContadorCarrito);
