import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CarritoProvider, useCarritoContexto } from "./CarritoContext";
import { PRODUCTOS } from "../datos/productos";

const manzanas = PRODUCTOS.find((p) => p.codigo === "FR001");
const palta = PRODUCTOS.find((p) => p.codigo === "PO002");

function usarCarrito() {
    return renderHook(() => useCarritoContexto(), { wrapper: CarritoProvider });
}

describe("CarritoContext", () => {
    it("parte vacio", () => {
        const { result } = usarCarrito();
        expect(result.current.lineas).toEqual([]);
        expect(result.current.totales.total).toBe(0);
    });

    it("agrega un producto", () => {
        const { result } = usarCarrito();
        act(() => result.current.agregar(manzanas));

        expect(result.current.lineas).toHaveLength(1);
        expect(result.current.lineas[0].cantidad).toBe(1);
    });

    it("si el producto ya esta, suma la cantidad en vez de repetir la linea", () => {
        const { result } = usarCarrito();
        act(() => result.current.agregar(manzanas));
        act(() => result.current.agregar(manzanas));

        expect(result.current.lineas).toHaveLength(1);
        expect(result.current.lineas[0].cantidad).toBe(2);
    });

    it("no permite superar el stock", () => {
        const { result } = usarCarrito();
        act(() => result.current.agregar(palta, 50));

        expect(result.current.lineas[0].cantidad).toBe(palta.stock);
    });

    it("cambia la cantidad de una linea", () => {
        const { result } = usarCarrito();
        act(() => result.current.agregar(manzanas));
        act(() => result.current.cambiarCantidad("FR001", 5));

        expect(result.current.lineas[0].cantidad).toBe(5);
    });

    it("quita el producto si la cantidad baja de 1", () => {
        const { result } = usarCarrito();
        act(() => result.current.agregar(manzanas));
        act(() => result.current.cambiarCantidad("FR001", 0));

        expect(result.current.lineas).toHaveLength(0);
    });

    it("elimina y vacia", () => {
        const { result } = usarCarrito();
        act(() => result.current.agregar(manzanas));
        act(() => result.current.agregar(palta));
        act(() => result.current.eliminar("FR001"));
        expect(result.current.lineas).toHaveLength(1);

        act(() => result.current.vaciar());
        expect(result.current.lineas).toHaveLength(0);
    });

    it("cobra $2.000 de envio bajo $20.000", () => {
        const { result } = usarCarrito();
        act(() => result.current.agregar(manzanas));

        expect(result.current.totales.subtotal).toBe(1200);
        expect(result.current.totales.envio).toBe(2000);
        expect(result.current.totales.total).toBe(3200);
    });

    it("el envio es gratis desde $20.000", () => {
        const { result } = usarCarrito();
        act(() => result.current.agregar(palta, 6));
        act(() => result.current.agregar(manzanas));

        expect(result.current.totales.subtotal).toBe(20940);
        expect(result.current.totales.envio).toBe(0);
        expect(result.current.totales.cantidadTotal).toBe(7);
    });

    it("guarda el carrito en localStorage", () => {
        const { result } = usarCarrito();
        act(() => result.current.agregar(manzanas));

        const guardado = JSON.parse(localStorage.getItem("huertohogar.carrito"));
        expect(guardado[0].codigo).toBe("FR001");
    });

    it("recupera el carrito guardado al iniciar", () => {
        localStorage.setItem(
            "huertohogar.carrito",
            JSON.stringify([{ ...manzanas, cantidad: 3 }])
        );
        const { result } = usarCarrito();

        expect(result.current.lineas[0].cantidad).toBe(3);
    });

    it("lanza un error si se usa fuera del Provider", () => {
        const silencio = vi.spyOn(console, "error").mockImplementation(() => {});

        expect(() => renderHook(() => useCarritoContexto())).toThrow(/CarritoProvider/);
        silencio.mockRestore();
    });
});
