/* ============================================================
   Componente FilaCarrito

   Una fila de la tabla del carrito. Antes las filas estaban
   escritas a mano en el HTML con productos de ejemplo; ahora cada
   fila se dibuja a partir de la linea que recibe.

   Propiedades que recibe:
   - linea: producto del carrito con su cantidad.
   - onCambiarCantidad: avisa a la vista la nueva cantidad.
   - onEliminar: avisa a la vista que hay que quitar el producto.
   ============================================================ */

import { formatearPrecio } from "../../utilidades/validaciones";
import "./FilaCarrito.css";

function FilaCarrito({ linea, onCambiarCantidad, onEliminar }) {
    const subtotal = linea.precio * linea.cantidad;

    /*
       En React el evento onChange se dispara con cada tecla. Si el
       usuario borra el campo para escribir otro numero, el valor
       queda vacio por un instante; en ese caso no avisamos nada,
       porque un valor vacio se interpretaria como cero y quitaria
       el producto del carrito sin que el usuario lo pidiera.
    */
    function manejarCambio(evento) {
        const valor = evento.target.value;

        if (valor === "") {
            return;
        }
        onCambiarCantidad(linea.codigo, valor);
    }

    return (
        <tr className="filaCarrito">
            <td>
                <img src={linea.imagen} className="imgCarrito" alt={linea.nombre} />
                <span className="ms-2">{linea.nombre}</span>
            </td>

            <td>{formatearPrecio(linea.precio)}</td>

            <td>
                <input
                    type="number"
                    className="form-control cantidadCarrito"
                    min="1"
                    max={linea.stock}
                    value={linea.cantidad}
                    aria-label={`Cantidad de ${linea.nombre}`}
                    onChange={manejarCambio}
                />
            </td>

            <td>{formatearPrecio(subtotal)}</td>

            <td>
                <button
                    type="button"
                    className="btn botonQuitar"
                    onClick={() => onEliminar(linea.codigo)}
                >
                    Quitar
                </button>
            </td>
        </tr>
    );
}

export default FilaCarrito;
