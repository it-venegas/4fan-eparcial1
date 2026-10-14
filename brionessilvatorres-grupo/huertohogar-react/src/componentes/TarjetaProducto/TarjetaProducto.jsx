/* ============================================================
   Componente TarjetaProducto

   Dibuja un producto del catalogo. Antes cada tarjeta estaba
   escrita a mano en el HTML, ocho veces; ahora existe una sola vez
   y recibe por propiedades el producto que tiene que mostrar.

   Propiedades que recibe:
   - producto: objeto con nombre, precio, formato, imagen y stock.
   - onAgregar: funcion que ejecuta la vista cuando se presiona el
     boton. El componente no sabe que pasa con el carrito, solo
     avisa que el usuario presiono.

   Estado propio:
   - agregado: muestra "Agregado!" por un momento tras el clic.
   ============================================================ */

import { useEffect, useState } from "react";
import { formatearPrecio } from "../../utilidades/validaciones";
import "./TarjetaProducto.css";

function TarjetaProducto({ producto, onAgregar }) {
    const [agregado, setAgregado] = useState(false);
    const sinStock = producto.stock <= 0;

    /* Devolvemos el boton a su texto original despues de 1,2 segundos.
       El return limpia el temporizador si el componente desaparece antes. */
    useEffect(() => {
        if (!agregado) {
            return;
        }
        const temporizador = setTimeout(() => setAgregado(false), 1200);
        return () => clearTimeout(temporizador);
    }, [agregado]);

    function manejarClic() {
        onAgregar(producto);
        setAgregado(true);
    }

    return (
        <div className="col-6 col-md-4 col-lg-3 mb-4 producto">
            <article className="card h-100">
                <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />

                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text">{producto.formato}</p>
                    <p className="precio">{formatearPrecio(producto.precio)}</p>

                    <button
                        type="button"
                        className="btn botonAgregar mt-auto"
                        onClick={manejarClic}
                        disabled={sinStock || agregado}
                    >
                        {sinStock ? "Sin stock" : agregado ? "Agregado!" : "Agregar al carrito"}
                    </button>
                </div>
            </article>
        </div>
    );
}

export default TarjetaProducto;
