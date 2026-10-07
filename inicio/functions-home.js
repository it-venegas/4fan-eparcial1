/* ============================================================
   Huerto Hogar - Funciones de la pagina de inicio

   Que hace este archivo:
   - Muestra un saludo cuando hay una sesion iniciada desde la
     pagina de login, con un enlace para cerrarla.
   - Actualiza el numero de productos junto al enlace Carrito.

   El saludo se crea desde JavaScript, por eso no aparece escrito
   en el HTML.

   Nota: las funciones del carrito se repiten en functions-cat.js y
   functions-car.js porque el proyecto no usa un archivo JS
   compartido entre paginas.
   ============================================================ */

const CLAVE_CARRITO = "huertohogar.carrito";
const CLAVE_SESION = "huertohogar.sesion";


/* ---------- Contador del carrito ---------- */

function leerCarrito() {
    try {
        const guardado = localStorage.getItem(CLAVE_CARRITO);
        const lista = guardado ? JSON.parse(guardado) : [];
        return Array.isArray(lista) ? lista : [];
    } catch (error) {
        console.warn("No se pudo leer el carrito:", error);
        try {
            localStorage.removeItem(CLAVE_CARRITO);
        } catch (otroError) {
            /* El navegador tiene bloqueado el almacenamiento del sitio. */
        }
        return [];
    }
}

function actualizarContadorCarrito() {
    const enlace = document.querySelector(".btn-carrito");
    if (!enlace) {
        return;
    }

    const total = leerCarrito().reduce(function (suma, linea) {
        return suma + linea.cantidad;
    }, 0);

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


/* ---------- Saludo al usuario con sesion iniciada ---------- */

function mostrarSaludo() {
    let sesion = null;

    try {
        sesion = JSON.parse(localStorage.getItem(CLAVE_SESION));
    } catch (error) {
        console.warn("No se pudo leer la sesion:", error);
    }

    if (!sesion) {
        return;
    }

    const contenedor = document.querySelector("main");
    if (!contenedor) {
        return;
    }

    const saludo = document.createElement("p");
    saludo.className = "alert alert-success";
    saludo.textContent = "Hola de nuevo, " + sesion.nombre + ". ";

    const salir = document.createElement("a");
    salir.href = "#";
    salir.textContent = "Cerrar sesion";

    salir.addEventListener("click", function (evento) {
        evento.preventDefault();
        localStorage.removeItem(CLAVE_SESION);
        window.location.reload();
    });

    saludo.appendChild(salir);
    contenedor.insertAdjacentElement("afterbegin", saludo);
}


/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", function () {
    actualizarContadorCarrito();
    mostrarSaludo();
});

/* El contador se refresca tambien al volver con el boton Atras o al
   cambiar de pestana, porque el navegador puede guardar la pagina en
   memoria y no cargarla de cero. */
window.addEventListener("pageshow", actualizarContadorCarrito);
window.addEventListener("storage", actualizarContadorCarrito);
