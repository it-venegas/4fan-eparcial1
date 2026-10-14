/* ============================================================
   Punto de entrada de la aplicacion

   Aqui React toma el <div id="root"> del index.html y monta dentro
   toda la aplicacion. Tambien se cargan, en orden, el CSS de
   Bootstrap y despues el CSS propio, para que nuestros estilos
   puedan sobrescribir los del framework cuando sea necesario.

   Los dos Provider dejan disponibles la sesion y el carrito para
   cualquier componente de la aplicacion.
   ============================================================ */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./estilos/global.css";

import App from "./App";
import { CarritoProvider } from "./contexto/CarritoContext";
import { SesionProvider } from "./contexto/SesionContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <SesionProvider>
                <CarritoProvider>
                    <App />
                </CarritoProvider>
            </SesionProvider>
        </BrowserRouter>
    </StrictMode>
);
