/* ============================================================
   Vista Catalogo

   Equivale al antiguo catalogo/catalogo.html. Las ocho tarjetas que
   antes estaban escritas a mano ahora salen del arreglo de
   productos, y los botones de categoria y el buscador trabajan
   sobre el estado de la vista.
   ============================================================ */

import TarjetaProducto from "../../componentes/TarjetaProducto/TarjetaProducto";
import { CATEGORIAS } from "../../datos/productos";
import { useCatalogo } from "./useCatalogo";
import "./Catalogo.css";

function Catalogo() {
    const { categoria, setCategoria, busqueda, setBusqueda, productosFiltrados, agregar } =
        useCatalogo();

    return (
        <main className="container">
            <h2 className="txtCat mt-5 mb-3">Catalogo de Productos</h2>

            <section className="filtrosCatalogo mb-4">
                <div className="d-flex flex-wrap gap-2 mb-3">
                    {CATEGORIAS.map((item) => (
                        <button
                            key={item.valor}
                            type="button"
                            className={`btn btn-outline-success filtro ${
                                categoria === item.valor ? "activo" : ""
                            }`}
                            onClick={() => setCategoria(item.valor)}
                        >
                            {item.nombre}
                        </button>
                    ))}
                </div>

                <div className="row align-items-center">
                    <div className="col-md-6">
                        <label htmlFor="buscador" className="form-label">
                            Buscar producto
                        </label>
                        <input
                            id="buscador"
                            type="search"
                            className="form-control"
                            placeholder="Escribe el nombre del producto"
                            value={busqueda}
                            onChange={(evento) => setBusqueda(evento.target.value)}
                        />
                    </div>

                    <div className="col-md-6 text-md-end">
                        <p className="mb-0 mt-md-4 conteoResultados">
                            {productosFiltrados.length}
                            {productosFiltrados.length === 1 ? " producto" : " productos"}
                        </p>
                    </div>
                </div>
            </section>

            <section className="sctCat">
                <div className="row">
                    {productosFiltrados.length === 0 ? (
                        <div className="col-12">
                            <div className="alert alert-warning">
                                No encontramos productos con esa busqueda.
                            </div>
                        </div>
                    ) : (
                        productosFiltrados.map((producto) => (
                            <TarjetaProducto
                                key={producto.codigo}
                                producto={producto}
                                onAgregar={agregar}
                            />
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}

export default Catalogo;
