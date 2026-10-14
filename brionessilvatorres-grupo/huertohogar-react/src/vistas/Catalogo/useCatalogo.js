/* ============================================================
   Logica de la vista Catalogo

   Reemplaza a functions-cat.js. Guarda en el estado la categoria
   elegida y lo que el usuario escribe en el buscador, y entrega ya
   filtrada la lista de productos que la vista debe mostrar.

   El atributo data-cat que la version anterior tenia en el HTML
   ahora es el campo "categoria" de cada producto.
   ============================================================ */

import { useMemo, useState } from "react";
import { PRODUCTOS } from "../../datos/productos";
import { useCarritoContexto } from "../../contexto/CarritoContext";

export function useCatalogo() {
    const { agregar } = useCarritoContexto();

    /* Estado de la vista: filtro de categoria y texto buscado. */
    const [categoria, setCategoria] = useState("todas");
    const [busqueda, setBusqueda] = useState("");

    /*
       La lista filtrada se recalcula solo cuando cambia la categoria
       o la busqueda, no en cada redibujado.
    */
    const productosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        return PRODUCTOS.filter((producto) => {
            const pasaCategoria = categoria === "todas" || producto.categoria === categoria;
            const pasaBusqueda = producto.nombre.toLowerCase().includes(texto);
            return pasaCategoria && pasaBusqueda;
        });
    }, [categoria, busqueda]);

    return {
        categoria,
        setCategoria,
        busqueda,
        setBusqueda,
        productosFiltrados,
        agregar
    };
}
