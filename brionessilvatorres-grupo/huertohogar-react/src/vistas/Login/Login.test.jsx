import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import { SesionProvider } from "../../contexto/SesionContext";

function dibujarLogin() {
    render(
        <MemoryRouter initialEntries={["/login"]}>
            <SesionProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/catalogo" element={<p>Pagina del catalogo</p>} />
                </Routes>
            </SesionProvider>
        </MemoryRouter>
    );
}

function escribir(etiqueta, valor) {
    fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

function enviar() {
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
}

describe("Vista Login", () => {
    it("muestra los errores si se envia vacio", () => {
        dibujarLogin();
        enviar();

        expect(screen.getByText(/Revisa los campos marcados/)).toBeInTheDocument();
        expect(screen.getByText("Ingresa tu correo para continuar.")).toBeInTheDocument();
        expect(screen.getByText("Ingresa una contrasena para continuar.")).toBeInTheDocument();
    });

    it("rechaza un correo de dominio no permitido", () => {
        dibujarLogin();
        escribir(/^Correo/, "ana@hotmail.com");
        escribir(/^Contrasena/, "1234");
        enviar();

        expect(screen.getByText(/Solo aceptamos correos/)).toBeInTheDocument();
    });

    it("rechaza credenciales que no existen", () => {
        dibujarLogin();
        escribir(/^Correo/, "admin@duoc.cl");
        escribir(/^Contrasena/, "malaclave");
        enviar();

        expect(screen.getByText(/no coinciden con ninguna cuenta/)).toBeInTheDocument();
    });

    it("con una cuenta de prueba da la bienvenida y lleva al catalogo", async () => {
        dibujarLogin();
        escribir(/^Correo/, "admin@duoc.cl");
        escribir(/^Contrasena/, "admin123");
        enviar();

        expect(screen.getByText(/Bienvenido de vuelta, Isabel Torres/)).toBeInTheDocument();

        expect(
            await screen.findByText("Pagina del catalogo", {}, { timeout: 2000 })
        ).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem("huertohogar.sesion")).correo).toBe(
            "admin@duoc.cl"
        );
    });
});
