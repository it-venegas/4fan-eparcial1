/* ============================================================
   Vista Carrito

   Equivale al antiguo carrito/carrito.html. Las filas de ejemplo
   que estaban escritas en el HTML desaparecieron: ahora la tabla
   se arma con lo que el usuario agrego realmente.
   ============================================================ */

import { Link } from "react-router-dom";
import FilaCarrito from "../../componentes/FilaCarrito/FilaCarrito";
import { formatearPrecio } from "../../utilidades/validaciones";
import { useCarrito } from "./useCarrito";
import "./Carrito.css";

function Carrito() {
    const { lineas, totales, aviso, cambiarCantidad, eliminar, vaciarCarrito, finalizarCompra } =
        useCarrito();

    return (
        <main className="container">
            <h2 className="txtCarrito mt-5 mb-3">Tu Carrito</h2>

            <section className="sctCarrito">
                {aviso && <div className="alert alert-info">{aviso}</div>}

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr className="filaTitulo">
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {lineas.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center p-4">
                                        Tu carrito esta vacio.{" "}
                                        <Link to="/catalogo">Ir al catalogo</Link>
                                    </td>
                                </tr>
                            ) : (
                                lineas.map((linea) => (
                                    <FilaCarrito
                                        key={linea.codigo}
                                        linea={linea}
                                        onCambiarCantidad={cambiarCantidad}
                                        onEliminar={eliminar}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="resumen">
                    <p>Subtotal: {formatearPrecio(totales.subtotal)}</p>
                    <p>Envio: {totales.envio === 0 ? "gratis" : formatearPrecio(totales.envio)}</p>
                    <p className="total">Total: {formatearPrecio(totales.total)}</p>

                    <button
                        type="button"
                        className="botonFinalizar btn mb-3"
                        onClick={finalizarCompra}
                    >
                        Finalizar compra
                    </button>

                    {lineas.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-outline-danger mb-3 ms-2"
                            onClick={vaciarCarrito}
                        >
                            Vaciar carrito
                        </button>
                    )}

                    <Link className="nav-link text-center btnSeguir" to="/catalogo">
                        Seguir comprando
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default Carrito;
