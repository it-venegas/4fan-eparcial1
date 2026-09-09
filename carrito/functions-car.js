document.addEventListener("DOMContentLoaded", function () {

    const cuerpo = document.getElementById("cuerpoCarrito");
    const resumen = document.getElementById("resumenCarrito");
    const mensajeVacio = document.getElementById("carritoVacio");

    const ENVIO = 2000;

    function dibujar() {
        const lineas = Carrito.detalle();

        /* Carrito vacio: escondemos la tabla y el resumen. */
        if (lineas.length === 0) {
            cuerpo.innerHTML = "";
            resumen.style.display = "none";
            mensajeVacio.style.display = "block";
            return;
        }

        resumen.style.display = "block";
        mensajeVacio.style.display = "none";

        cuerpo.innerHTML = lineas.map(function (linea) {
            const p = linea.producto;
            return "<tr>" +
                '<td><img src="../img/' + p.imagen + '" class="imgCarrito" alt="' + p.nombre + '"> ' + p.nombre + "</td>" +
                "<td>" + formatearPrecio(p.precio) + "</td>" +
                '<td><input type="number" class="form-control cantidad" style="width:80px" ' +
                    'value="' + linea.cantidad + '" min="1" max="' + p.stock + '" data-codigo="' + p.codigo + '"></td>' +
                "<td>" + formatearPrecio(linea.subtotal) + "</td>" +
                '<td><button class="btn botonQuitar" data-codigo="' + p.codigo + '">Quitar</button></td>' +
                "</tr>";
        }).join("");

        /* Subtotal, envio y total. */
        const subtotal = Carrito.total();
        const envio = subtotal >= 20000 ? 0 : ENVIO;

        document.getElementById("valorSubtotal").textContent = "Subtotal: " + formatearPrecio(subtotal);
        document.getElementById("valorEnvio").textContent =
            envio === 0 ? "Envio: gratis" : "Envio: " + formatearPrecio(envio);
        document.getElementById("valorTotal").textContent = "Total: " + formatearPrecio(subtotal + envio);

        conectarBotones();
    }

    function conectarBotones() {
        /* Cambiar la cantidad de una linea. */
        document.querySelectorAll(".cantidad").forEach(function (campo) {
            campo.addEventListener("change", function () {
                Carrito.cambiarCantidad(campo.dataset.codigo, campo.value);
                dibujar();
            });
        });

        /* Quitar un producto. */
        document.querySelectorAll(".botonQuitar").forEach(function (boton) {
            boton.addEventListener("click", function () {
                Carrito.eliminar(boton.dataset.codigo);
                dibujar();
            });
        });
    }

    document.getElementById("botonFinalizar").addEventListener("click", function (evento) {
        evento.preventDefault();
        if (Carrito.detalle().length === 0) {
            return;
        }
        alert("El pago en linea se implementa en la siguiente entrega del proyecto.");
    });

    dibujar();
});
