/* ============================================================
   Componente Navbar

   Reemplaza al <header> con el <nav> que antes estaba copiado en
   las cinco paginas HTML. Ahora existe una sola vez y se reutiliza
   en toda la aplicacion.

   Estado propio: "abierto" controla si el menu desplegable se ve o
   no en pantallas pequenas. Antes de eso lo hacia el JavaScript de
   Bootstrap; aqui lo maneja React.

   Lee del contexto la cantidad de productos del carrito y el
   usuario con sesion iniciada.
   ============================================================ */

import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useCarritoContexto } from "../../contexto/CarritoContext";
import { useSesion } from "../../contexto/SesionContext";
import "./Navbar.css";

/* Enlaces del menu. Al tenerlos en un arreglo se dibujan con map
   y agregar una pagina nueva es agregar una linea aqui. */
const ENLACES = [
    { ruta: "/", texto: "Home" },
    { ruta: "/catalogo", texto: "Catalogo" },
    { ruta: "/carrito", texto: "Carrito" },
    { ruta: "/login", texto: "Login" },
    { ruta: "/registro", texto: "Registrate" }
];

function Navbar() {
    const [abierto, setAbierto] = useState(false);
    const { totales } = useCarritoContexto();
    const { usuario, cerrarSesion } = useSesion();

    function cerrarMenu() {
        setAbierto(false);
    }

    return (
        <header>
            <nav className="navbar navbar-expand-lg barraNav">
                <div className="container-fluid">
                    <Link
                        className="navbar-brand d-flex align-items-center gap-2"
                        to="/"
                        onClick={cerrarMenu}
                    >
                        <img src="/img/logo.png" alt="Logo de Huerto Hogar" height="60" />
                        Huerto Hogar
                    </Link>

                    {/* El boton muestra u oculta el menu en pantallas chicas */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-expanded={abierto}
                        aria-label="Abrir el menu"
                        onClick={() => setAbierto((valor) => !valor)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`collapse navbar-collapse ${abierto ? "show" : ""}`}>
                        <div className="navbar-nav">
                            {ENLACES.map((enlace) => (
                                <NavLink
                                    key={enlace.ruta}
                                    to={enlace.ruta}
                                    end={enlace.ruta === "/"}
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? "active" : ""}`
                                    }
                                    onClick={cerrarMenu}
                                >
                                    {enlace.texto}
                                    {/* El contador solo aparece en el enlace del carrito */}
                                    {enlace.ruta === "/carrito" && totales.cantidadTotal > 0 && (
                                        <span className="contadorCarrito badge bg-success ms-1">
                                            {totales.cantidadTotal}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </div>

                        {/* Si hay sesion iniciada mostramos el nombre y el boton de salir */}
                        {usuario && (
                            <div className="ms-lg-auto d-flex align-items-center gap-2 datosSesion">
                                <span className="nombreUsuario">{usuario.nombre}</span>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => {
                                        cerrarSesion();
                                        cerrarMenu();
                                    }}
                                >
                                    Cerrar sesion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
