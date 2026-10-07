/* ============================================================
   Huerto Hogar - Funciones del carrito

   Que hace este archivo:
   - Dibuja las filas de la tabla con los productos que el usuario
     agrego desde el catalogo y que estan guardados en localStorage.
     Las filas de ejemplo que trae el HTML se reemplazan al cargar.
   - Permite cambiar la cantidad y quitar productos.
   - Calcula el subtotal, el envio y el total.

   Reglas del carrito definidas por el equipo:
   1. Si el producto ya esta en el carrito no se repite la linea:
      se suma la cantidad (esa parte ocurre en el catalogo).
   2. La cantidad minima es 1. Si se baja de ahi, se quita el producto.
   3. Subtotal de la linea = precio por cantidad.
   4. El envio cuesta $2.000 y es gratis desde $20.000 de compra.

   Nota: las funciones de lectura del carrito se repiten en
   functions-cat.js porque el proyecto no usa un archivo JS compartido.
   ============================================================ */

const CLAVE_CARRITO = "huertohogar.carrito";
const COSTO_ENVIO = 2000;
const MONTO_ENVIO_GRATIS = 20000;


/* ---------- Lectura y escritura del carrito ---------- */

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

/* Formatea un numero como precio chileno: 1200 se muestra como $1.200 */
function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(valor);
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


/* ---------- Dibujo de la tabla ---------- */

/*
   Marca si la tabla se esta dibujando en este momento.
   Al borrar la fila que tiene el cursor dentro, el navegador vuelve a
   disparar el evento change del campo de cantidad, lo que llamaria de
   nuevo a esta funcion mientras todavia no termina la primera vez.
   Con esta marca la segunda llamada se ignora.
*/
let dibujando = false;

function dibujarCarrito() {
    if (dibujando) {
        return;
    }

    dibujando = true;
    try {
        pintarFilas();
    } finally {
        dibujando = false;
    }
}

function pintarFilas() {
    const tabla = document.querySelector(".sctCarrito table");
    if (!tabla) {
        return;
    }

    /* El navegador crea el tbody aunque el HTML no lo escriba. */
    const cuerpo = tabla.querySelector("tbody") || tabla;

    /* Vaciamos la tabla de una sola vez y devolvemos la fila de titulos. */
    const filaTitulo = cuerpo.querySelector(".filaTitulo");
    cuerpo.innerHTML = "";
    if (filaTitulo) {
        cuerpo.appendChild(filaTitulo);
    }

    const lista = leerCarrito();

    if (lista.length === 0) {
        /*
           Si las paginas se abren con doble clic (direcciones que
           empiezan con file://) algunos navegadores le dan a cada
           archivo un espacio de almacenamiento distinto, y entonces el
           carrito que se guardo en el catalogo no se puede leer aqui.
           Por eso avisamos en vez de mostrar solo "carrito vacio".
        */
        const abiertoComoArchivo = window.location.protocol === "file:";

        const fila = document.createElement("tr");
        fila.innerHTML =
            '<td colspan="5" class="text-center p-4">' +
                "Tu carrito esta vacio. " +
                '<a href="../catalogo/catalogo.html">Ir al catalogo</a>' +
                (abiertoComoArchivo
                    ? '<br><small class="text-muted">Si agregaste productos y no aparecen, ' +
                      "abre el proyecto con Live Server en vez de hacer doble clic en el archivo.</small>"
                    : "") +
            "</td>";
        cuerpo.appendChild(fila);
        actualizarResumen(0);
        return;
    }

    lista.forEach(function (linea, posicion) {
        const subtotal = linea.precio * linea.cantidad;
        const fila = document.createElement("tr");

        fila.innerHTML =
            '<td><img src="' + linea.imagen + '" class="imgCarrito" alt="' + linea.nombre + '"> ' +
                linea.nombre + "</td>" +
            "<td>" + formatearPrecio(linea.precio) + "</td>" +
            '<td><input type="number" class="form-control cantidadCarrito" ' +
                'style="width:80px" min="1" value="' + linea.cantidad + '" ' +
                'data-posicion="' + posicion + '"></td>' +
            "<td>" + formatearPrecio(subtotal) + "</td>" +
            '<td><a href="#" class="btn botonQuitar" data-posicion="' + posicion + '">Quitar</a></td>';

        cuerpo.appendChild(fila);
    });

    const subtotalGeneral = lista.reduce(function (suma, linea) {
        return suma + linea.precio * linea.cantidad;
    }, 0);

    actualizarResumen(subtotalGeneral);
    conectarBotonesDeLaTabla();
}

/* Escribe los montos en el bloque de resumen que ya trae el HTML. */
function actualizarResumen(subtotal) {
    const parrafos = document.querySelectorAll(".resumen p");
    if (parrafos.length < 3) {
        return;
    }

    const envio = subtotal === 0 || subtotal >= MONTO_ENVIO_GRATIS ? 0 : COSTO_ENVIO;

    parrafos[0].textContent = "Subtotal: " + formatearPrecio(subtotal);
    parrafos[1].textContent = envio === 0 ? "Envio: gratis" : "Envio: " + formatearPrecio(envio);
    parrafos[2].textContent = "Total: " + formatearPrecio(subtotal + envio);
}


/* ---------- Botones de cada fila ---------- */

function conectarBotonesDeLaTabla() {
    /* Cambiar la cantidad de un producto. */
    document.querySelectorAll(".cantidadCarrito").forEach(function (campo) {
        campo.addEventListener("change", function () {
            const lista = leerCarrito();
            const posicion = Number(campo.dataset.posicion);
            const cantidad = Number(campo.value);

            if (!Number.isInteger(cantidad) || cantidad < 1) {
                /* Regla 2: bajo una unidad se quita el producto. */
                if (confirm("Quieres quitar " + lista[posicion].nombre + " del carrito?")) {
                    lista.splice(posicion, 1);
                }
            } else {
                lista[posicion].cantidad = cantidad;
            }

            guardarCarrito(lista);
            dibujarCarrito();
        });
    });

    /* Quitar un producto. */
    document.querySelectorAll(".botonQuitar").forEach(function (boton) {
        boton.addEventListener("click", function (evento) {
            evento.preventDefault();

            const lista = leerCarrito();
            const posicion = Number(boton.dataset.posicion);

            lista.splice(posicion, 1);
            guardarCarrito(lista);
            dibujarCarrito();
        });
    });
}


/* ---------- Arranque ---------- */

/*
   Volvemos a dibujar la tabla cuando la pagina se muestra de nuevo.
   Esto cubre tres casos en los que el carrito se veria desactualizado:
   - El usuario agrego productos en otra pestana (evento storage).
   - Volvio con el boton Atras y el navegador tenia la pagina guardada
     en memoria, por lo que no la carga de cero (evento pageshow).
   - Cambio a otra pestana y despues volvio (evento visibilitychange).
*/
function refrescarCarrito() {
    actualizarContadorCarrito();
    dibujarCarrito();
}

window.addEventListener("storage", refrescarCarrito);
window.addEventListener("pageshow", refrescarCarrito);

document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
        refrescarCarrito();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    actualizarContadorCarrito();
    dibujarCarrito();

    const botonFinalizar = document.querySelector(".botonFinalizar");
    if (botonFinalizar) {
        botonFinalizar.addEventListener("click", function (evento) {
            evento.preventDefault();

            if (leerCarrito().length === 0) {
                alert("Tu carrito esta vacio. Agrega productos desde el catalogo.");
                return;
            }
            alert("El pago en linea se implementa en la siguiente entrega del proyecto.");
        });
    }
});
