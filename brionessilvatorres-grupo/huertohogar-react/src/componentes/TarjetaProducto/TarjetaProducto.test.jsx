import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import TarjetaProducto from "./TarjetaProducto";

const producto = {
    codigo: "FR001",
    nombre: "Manzanas Fuji",
    precio: 1200,
    formato: "malla de 1 kilo",
    stock: 150,
    imagen: "/img/manzana.jpg"
};

describe("TarjetaProducto", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("muestra los datos que recibe por props", () => {
        render(<TarjetaProducto producto={producto} onAgregar={() => {}} />);

        expect(screen.getByText("Manzanas Fuji")).toBeInTheDocument();
        expect(screen.getByText("malla de 1 kilo")).toBeInTheDocument();
        expect(screen.getByText(/1\.200/)).toBeInTheDocument();
        expect(screen.getByAltText("Manzanas Fuji")).toHaveAttribute("src", "/img/manzana.jpg");
    });

    it("al hacer clic llama a onAgregar con el producto", () => {
        const onAgregar = vi.fn();
        render(<TarjetaProducto producto={producto} onAgregar={onAgregar} />);

        fireEvent.click(screen.getByRole("button", { name: "Agregar al carrito" }));

        expect(onAgregar).toHaveBeenCalledTimes(1);
        expect(onAgregar).toHaveBeenCalledWith(producto);
    });

    it("muestra 'Agregado!' y vuelve al texto original despues de 1,2 segundos", () => {
        vi.useFakeTimers();
        render(<TarjetaProducto producto={producto} onAgregar={() => {}} />);

        fireEvent.click(screen.getByRole("button", { name: "Agregar al carrito" }));
        expect(screen.getByRole("button", { name: "Agregado!" })).toBeDisabled();

        act(() => {
            vi.advanceTimersByTime(1200);
        });
        expect(screen.getByRole("button", { name: "Agregar al carrito" })).toBeEnabled();
    });

    it("deshabilita el boton si no hay stock", () => {
        render(<TarjetaProducto producto={{ ...producto, stock: 0 }} onAgregar={() => {}} />);

        expect(screen.getByRole("button", { name: "Sin stock" })).toBeDisabled();
    });
});
