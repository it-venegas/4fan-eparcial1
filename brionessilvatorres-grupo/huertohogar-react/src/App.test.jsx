import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";
import { renderizar } from "./test/renderizar";

describe("App", () => {
    it("renderiza sin errores y muestra la pagina de inicio", () => {
        renderizar(<App />);
        expect(screen.getByText("Productos Destacados")).toBeInTheDocument();
    });

    it("muestra la barra de navegacion en todas las paginas", () => {
        renderizar(<App />, { ruta: "/login" });
        expect(screen.getByRole("link", { name: "Catalogo" })).toBeInTheDocument();
        expect(screen.getByText("Logeate")).toBeInTheDocument();
    });

    it("una direccion que no existe vuelve al inicio", () => {
        renderizar(<App />, { ruta: "/pagina-que-no-existe" });
        expect(screen.getByText("Productos Destacados")).toBeInTheDocument();
    });

    it("el contador del carrito en la barra sube al agregar un producto", () => {
        const { container } = renderizar(<App />, { ruta: "/catalogo" });

        expect(container.querySelector(".contadorCarrito")).toBeNull();

        const botones = screen.getAllByRole("button", { name: "Agregar al carrito" });
        fireEvent.click(botones[0]);

        expect(container.querySelector(".contadorCarrito")).toHaveTextContent("1");
    });
});
