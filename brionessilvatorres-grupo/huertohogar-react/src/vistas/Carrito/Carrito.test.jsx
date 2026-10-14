import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Carrito from "./Carrito";
import { renderizar } from "../../test/renderizar";

function guardarCarrito(lineas) {
    localStorage.setItem("huertohogar.carrito", JSON.stringify(lineas));
}

const manzanas = {
    codigo: "FR001",
    nombre: "Manzanas Fuji",
    precio: 1200,
    imagen: "/img/manzana.jpg",
    stock: 150,
    cantidad: 2
};

describe("Vista Carrito", () => {
    it("indica que el carrito esta vacio", () => {
        renderizar(<Carrito />);
        expect(screen.getByText(/Tu carrito esta vacio/)).toBeInTheDocument();
    });

    it("muestra los productos guardados y sus totales", () => {
        guardarCarrito([manzanas]);
        renderizar(<Carrito />);

        expect(screen.getByText("Manzanas Fuji")).toBeInTheDocument();
        expect(screen.getByText(/Subtotal: .*2\.400/)).toBeInTheDocument();
        expect(screen.getByText(/Envio: .*2\.000/)).toBeInTheDocument();
        expect(screen.getByText(/Total: .*4\.400/)).toBeInTheDocument();
    });

    it("quitar un producto lo saca de la tabla", () => {
        guardarCarrito([manzanas]);
        renderizar(<Carrito />);

        fireEvent.click(screen.getByRole("button", { name: "Quitar" }));
        expect(screen.getByText(/Tu carrito esta vacio/)).toBeInTheDocument();
    });

    it("finalizar compra con el carrito vacio muestra un aviso", () => {
        renderizar(<Carrito />);
        fireEvent.click(screen.getByRole("button", { name: "Finalizar compra" }));

        expect(screen.getByText(/Agrega productos desde el catalogo/)).toBeInTheDocument();
    });

    it("vaciar carrito elimina todas las lineas", () => {
        guardarCarrito([manzanas]);
        renderizar(<Carrito />);

        fireEvent.click(screen.getByRole("button", { name: "Vaciar carrito" }));
        expect(screen.getByText(/Tu carrito esta vacio/)).toBeInTheDocument();
    });
});
