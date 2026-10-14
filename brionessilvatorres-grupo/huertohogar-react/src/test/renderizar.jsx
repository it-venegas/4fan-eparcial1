import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SesionProvider } from "../contexto/SesionContext";
import { CarritoProvider } from "../contexto/CarritoContext";

export function renderizar(componente, { ruta = "/" } = {}) {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <SesionProvider>
                <CarritoProvider>{componente}</CarritoProvider>
            </SesionProvider>
        </MemoryRouter>
    );
}
