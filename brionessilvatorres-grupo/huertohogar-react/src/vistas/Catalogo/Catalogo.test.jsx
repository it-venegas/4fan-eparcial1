import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Catalogo from "./Catalogo";
import { renderizar } from "../../test/renderizar";

describe("Vista Catalogo", () => {
    it("muestra los 8 productos al entrar", () => {
        renderizar(<Catalogo />);

        expect(screen.getByText("8 productos")).toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: "Agregar al carrito" })).toHaveLength(8);
    });

    it("filtra por categoria", () => {
        renderizar(<Catalogo />);
        fireEvent.click(screen.getByRole("button", { name: "Frutas Frescas" }));

        expect(screen.getByText("3 productos")).toBeInTheDocument();
        expect(screen.getByText("Manzanas Fuji")).toBeInTheDocument();
        expect(screen.queryByText("Palta Hass")).not.toBeInTheDocument();
    });

    it("filtra por el texto del buscador, sin importar mayusculas", () => {
        renderizar(<Catalogo />);
        fireEvent.change(screen.getByLabelText("Buscar producto"), {
            target: { value: "PALTA" }
        });

        expect(screen.getByText("1 producto")).toBeInTheDocument();
        expect(screen.getByText("Palta Hass")).toBeInTheDocument();
    });

    it("avisa cuando ninguna busqueda coincide", () => {
        renderizar(<Catalogo />);
        fireEvent.change(screen.getByLabelText("Buscar producto"), {
            target: { value: "chocolate" }
        });

        expect(screen.getByText("No encontramos productos con esa busqueda.")).toBeInTheDocument();
    });

    it("al agregar, la tarjeta confirma con 'Agregado!'", () => {
        renderizar(<Catalogo />);
        fireEvent.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[0]);

        expect(screen.getByRole("button", { name: "Agregado!" })).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem("huertohogar.carrito"))).toHaveLength(1);
    });
});
