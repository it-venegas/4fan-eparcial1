import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FilaCarrito from "./FilaCarrito";

const linea = {
    codigo: "FR001",
    nombre: "Manzanas Fuji",
    precio: 1200,
    imagen: "/img/manzana.jpg",
    stock: 150,
    cantidad: 2
};

function dibujar(props = {}) {
    const todas = { linea, onCambiarCantidad: vi.fn(), onEliminar: vi.fn(), ...props };
    render(
        <table>
            <tbody>
                <FilaCarrito {...todas} />
            </tbody>
        </table>
    );
    return todas;
}

describe("FilaCarrito", () => {
    it("muestra el nombre, la cantidad y el subtotal", () => {
        dibujar();

        expect(screen.getByText("Manzanas Fuji")).toBeInTheDocument();
        expect(screen.getByRole("spinbutton")).toHaveValue(2);
        expect(screen.getByText(/2\.400/)).toBeInTheDocument();
    });

    it("avisa la nueva cantidad al cambiar el campo", () => {
        const props = dibujar();
        fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "3" } });

        expect(props.onCambiarCantidad).toHaveBeenCalledWith("FR001", "3");
    });

    it("no avisa nada si el campo queda vacio mientras se escribe", () => {
        const props = dibujar();
        fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "" } });

        expect(props.onCambiarCantidad).not.toHaveBeenCalled();
    });

    it("avisa que hay que quitar el producto", () => {
        const props = dibujar();
        fireEvent.click(screen.getByRole("button", { name: "Quitar" }));

        expect(props.onEliminar).toHaveBeenCalledWith("FR001");
    });
});
