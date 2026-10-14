/* ============================================================
   Logica de la vista Inicio

   Reemplaza a functions-home.js. Entrega a la vista los productos
   destacados, el usuario con sesion iniciada y la funcion para
   agregar al carrito. La vista solo se preocupa de dibujar.
   ============================================================ */

import { useMemo } from "react";
import { PRODUCTOS } from "../../datos/productos";
import { useCarritoContexto } from "../../contexto/CarritoContext";
import { useSesion } from "../../contexto/SesionContext";

export function useInicio() {
    const { agregar } = useCarritoContexto();
    const { usuario } = useSesion();

    /* Los cuatro primeros productos del catalogo. useMemo evita
       recalcular la lista en cada redibujado. */
    const destacados = useMemo(() => PRODUCTOS.slice(0, 4), []);

    return { destacados, usuario, agregar };
}
