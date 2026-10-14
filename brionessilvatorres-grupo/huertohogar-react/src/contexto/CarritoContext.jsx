/* ============================================================
   Huerto Hogar - Estado global del carrito

   En la version anterior cada pagina repetia las funciones del
   carrito y las leia de localStorage por su cuenta. Aqui el carrito
   vive en un solo estado de React que se comparte con toda la
   aplicacion mediante Context, asi que la barra de navegacion, el
   catalogo y la vista del carrito siempre ven lo mismo.

   El estado se guarda en localStorage cada vez que cambia, para que
   el carrito siga ahi cuando el usuario vuelva a entrar.

   Reglas del carrito definidas por el equipo:
   1. Si el producto ya esta en el carrito no se repite la linea:
      se suma la cantidad.
   2. La cantidad minima es 1. Si se baja de ahi, se quita el producto.
   3. La cantidad maxima es el stock disponible del producto.
   4. Subtotal de la linea = precio por cantidad.
   5. El envio cuesta $2.000 y es gratis desde $20.000 de compra.
   ============================================================ */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { COSTO_ENVIO, MONTO_ENVIO_GRATIS } from "../datos/productos";

const CLAVE_CARRITO = "huertohogar.carrito";

const CarritoContext = createContext(null);

/* Lee el carrito guardado. Si no hay nada o el dato esta danado,
   parte con una lista vacia en vez de fallar. */
function leerCarritoGuardado() {
    try {
        const guardado = localStorage.getItem(CLAVE_CARRITO);
        const lista = guardado ? JSON.parse(guardado) : [];
        return Array.isArray(lista) ? lista : [];
    } catch (error) {
        console.warn("No se pudo leer el carrito guardado:", error);
        return [];
    }
}

export function CarritoProvider({ children }) {
    /* El valor inicial se calcula una sola vez, al montar la aplicacion. */
    const [lineas, setLineas] = useState(leerCarritoGuardado);

    /* Cada vez que cambia el carrito lo guardamos en el navegador. */
    useEffect(() => {
        try {
            localStorage.setItem(CLAVE_CARRITO, JSON.stringify(lineas));
        } catch (error) {
            console.warn("No se pudo guardar el carrito:", error);
        }
    }, [lineas]);

    /* Regla 1 y 3: se suma la cantidad sin pasar del stock. */
    function agregar(producto, cantidad = 1) {
        setLineas((actuales) => {
            const existente = actuales.find((linea) => linea.codigo === producto.codigo);

            if (existente) {
                return actuales.map((linea) =>
                    linea.codigo === producto.codigo
                        ? {
                              ...linea,
                              cantidad: Math.min(linea.cantidad + cantidad, producto.stock)
                          }
                        : linea
                );
            }

            return [
                ...actuales,
                {
                    codigo: producto.codigo,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    formato: producto.formato,
                    imagen: producto.imagen,
                    stock: producto.stock,
                    cantidad: Math.min(cantidad, producto.stock)
                }
            ];
        });
    }

    /* Regla 2: bajo una unidad se quita el producto. */
    function cambiarCantidad(codigo, cantidad) {
        const numero = Number(cantidad);

        if (!Number.isInteger(numero) || numero < 1) {
            eliminar(codigo);
            return;
        }

        setLineas((actuales) =>
            actuales.map((linea) =>
                linea.codigo === codigo
                    ? { ...linea, cantidad: Math.min(numero, linea.stock) }
                    : linea
            )
        );
    }

    function eliminar(codigo) {
        setLineas((actuales) => actuales.filter((linea) => linea.codigo !== codigo));
    }

    function vaciar() {
        setLineas([]);
    }

    /*
     Los totales se recalculan solo cuando cambian las lineas.
     useMemo evita rehacer la cuenta en cada redibujado de la pantalla.
  */
    const totales = useMemo(() => {
        const subtotal = lineas.reduce((suma, linea) => suma + linea.precio * linea.cantidad, 0);
        const envio = subtotal === 0 || subtotal >= MONTO_ENVIO_GRATIS ? 0 : COSTO_ENVIO;
        const cantidadTotal = lineas.reduce((suma, linea) => suma + linea.cantidad, 0);

        return { subtotal, envio, total: subtotal + envio, cantidadTotal };
    }, [lineas]);

    const valor = {
        lineas,
        totales,
        agregar,
        cambiarCantidad,
        eliminar,
        vaciar
    };

    return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

/*
   Atajo para que cualquier componente use el carrito sin importar
   el Context directamente.
*/
export function useCarritoContexto() {
    const contexto = useContext(CarritoContext);

    if (!contexto) {
        throw new Error("useCarritoContexto debe usarse dentro de CarritoProvider.");
    }
    return contexto;
}
