/* ============================================================
   Logica de la vista Carrito

   Reemplaza a functions-car.js. Toma del contexto las lineas y los
   totales, y agrega el mensaje que aparece al presionar Finalizar
   compra, que es un estado que solo le interesa a esta vista.
   ============================================================ */

import { useState } from "react";
import { useCarritoContexto } from "../../contexto/CarritoContext";

export function useCarrito() {
    const { lineas, totales, cambiarCantidad, eliminar, vaciar } = useCarritoContexto();
    const [aviso, setAviso] = useState("");

    function finalizarCompra() {
        if (lineas.length === 0) {
            setAviso("Tu carrito esta vacio. Agrega productos desde el catalogo.");
            return;
        }
        setAviso("El pago en linea se implementa en la siguiente entrega del proyecto.");
    }

    function vaciarCarrito() {
        vaciar();
        setAviso("");
    }

    return {
        lineas,
        totales,
        aviso,
        cambiarCantidad,
        eliminar,
        vaciarCarrito,
        finalizarCompra
    };
}
