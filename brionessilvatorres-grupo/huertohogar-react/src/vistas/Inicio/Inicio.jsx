/* ============================================================
   Vista Inicio

   Equivale al antiguo inicio/home.html. El contenido es el mismo:
   la presentacion de la tienda y los productos destacados. La
   diferencia es que las tarjetas ya no estan escritas a mano una
   por una, sino que se generan desde los datos.
   ============================================================ */

import { Link } from "react-router-dom";
import TarjetaProducto from "../../componentes/TarjetaProducto/TarjetaProducto";
import { useInicio } from "./useInicio";
import "./Inicio.css";

function Inicio() {
    const { destacados, usuario, agregar } = useInicio();

    return (
        <main className="container mt-5">
            {/* El saludo solo aparece si hay sesion iniciada */}
            {usuario && <p className="alert alert-success">Hola de nuevo, {usuario.nombre}.</p>}

            <section className="row align-items-center mb-5 p-4 seccion-nosotros">
                <div className="col-md-7">
                    <h2 className="mb-3">TIENDA ONLINE</h2>
                    <h4 className="mb-3">Sobre Nosotros!</h4>

                    <p className="lead text-secundario">
                        HuertoHogar es una tienda online dedicada a llevar la frescura y calidad de
                        los productos del campo directamente a la puerta de nuestros clientes en
                        Chile. Con mas de 6 anos de experiencia, operamos en mas de 9 puntos a lo
                        largo del pais, incluyendo ciudades clave como Santiago, Puerto Montt,
                        Villarica, Nacimiento, Vina del Mar, Valparaiso y Concepcion. Nuestra mision
                        es conectar a las familias chilenas con el campo, promoviendo un estilo de
                        vida saludable y sostenible.
                    </p>

                    <Link to="/catalogo" className="btn text-white ver-productos-btn btn-lg mt-2">
                        Ver productos
                    </Link>
                </div>

                <div className="col-md-5 text-center">
                    <img
                        src="/img/logo.png"
                        alt="Imagen representativa de HuertoHogar"
                        className="img-fluid rounded"
                    />
                </div>
            </section>

            <section className="mb-5">
                <h3 className="text-center mb-4">Productos Destacados</h3>

                <div className="row justify-content-center">
                    {/* Cada producto se dibuja con el mismo componente.
                        key le dice a React como identificar cada tarjeta. */}
                    {destacados.map((producto) => (
                        <TarjetaProducto
                            key={producto.codigo}
                            producto={producto}
                            onAgregar={agregar}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Inicio;
