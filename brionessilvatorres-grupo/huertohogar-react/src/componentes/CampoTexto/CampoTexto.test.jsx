import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CampoTexto from "./CampoTexto";

function dibujar(props = {}) {
    const base = {
        id: "correo",
        etiqueta: "Correo",
        valor: "",
        error: null,
        tocado: false,
        onChange: vi.fn(),
        onBlur: vi.fn()
    };
    const todas = { ...base, ...props };
    render(<CampoTexto {...todas} />);
    return todas;
}

describe("CampoTexto", () => {
    it("asocia la etiqueta con el campo", () => {
        dibujar();
        expect(screen.getByLabelText("Correo")).toHaveAttribute("id", "correo");
    });

    it("no muestra el error si el usuario aun no toca el campo", () => {
        dibujar({ error: "Ingresa tu correo para continuar." });

        expect(screen.queryByText("Ingresa tu correo para continuar.")).not.toBeInTheDocument();
        expect(screen.getByLabelText("Correo")).not.toHaveClass("is-invalid");
    });

    it("muestra el error y lo marca en rojo cuando ya fue tocado", () => {
        dibujar({ error: "Ingresa tu correo para continuar.", tocado: true });

        expect(screen.getByText("Ingresa tu correo para continuar.")).toBeInTheDocument();
        expect(screen.getByLabelText("Correo")).toHaveClass("is-invalid");
    });

    it("lo marca en verde si fue tocado, tiene valor y no hay error", () => {
        dibujar({ valor: "ana@gmail.com", tocado: true });
        expect(screen.getByLabelText("Correo")).toHaveClass("is-valid");
    });

    it("avisa con onChange el id y el texto escrito", () => {
        const props = dibujar();
        fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "ana" } });

        expect(props.onChange).toHaveBeenCalledWith("correo", "ana");
    });

    it("avisa con onBlur al salir del campo", () => {
        const props = dibujar();
        fireEvent.blur(screen.getByLabelText("Correo"));

        expect(props.onBlur).toHaveBeenCalledWith("correo");
    });
});
