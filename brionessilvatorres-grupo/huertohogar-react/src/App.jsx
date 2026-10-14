/* ============================================================
   Componente App

   Define la navegacion de la aplicacion. Cada direccion muestra una
   vista distinta sin recargar la pagina, que es la diferencia
   principal con la version anterior, donde cada vista era un
   archivo HTML separado.

   La barra de navegacion queda fuera de las rutas porque se ve en
   todas las paginas.
   ============================================================ */

import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./componentes/Navbar/Navbar";
import Inicio from "./vistas/Inicio/Inicio";
import Catalogo from "./vistas/Catalogo/Catalogo";
import Carrito from "./vistas/Carrito/Carrito";
import Login from "./vistas/Login/Login";
import Registro from "./vistas/Registro/Registro";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />

                {/* Cualquier direccion que no exista vuelve al inicio */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;
