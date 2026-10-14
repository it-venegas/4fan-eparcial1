import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Registro from "./Registro";
import { renderizar } from "../../test/renderizar";

function escribir(etiqueta, valor) {
    fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

function llenarFormulario(datos = {}) {
    const valores = {
        nombres: "Ana",
        apellidos: "Perez Soto",
        correo: "ana@gmail.com",
        contrasena: "clave1",
        confirmar: "clave1",
        ...datos
    };
    escribir("Nombres", valores.nombres);
    escribir("Apellidos", valores.apellidos);
    escribir(/^Correo/, valores.correo);
    escribir(/^Contrasena/, valores.contrasena);
    escribir("Vuelva a escribir la contrasena", valores.confirmar);
}

function enviar() {
    fireEvent.click(screen.getByRole("button", { name: "Registrate" }));
}

describe("Vista Registro", () => {
    it("muestra los errores si se envia vacio", () => {
        renderizar(<Registro />);
        enviar();

        expect(screen.getByText("Ingresa tu nombre para continuar.")).toBeInTheDocument();
        expect(screen.getByText("Ingresa tus apellidos para continuar.")).toBeInTheDocument();
        expect(screen.getByText("Ingresa tu correo para continuar.")).toBeInTheDocument();
    });

    it("avisa si las contrasenas no coinciden", () => {
        renderizar(<Registro />);
        llenarFormulario({ confirmar: "otra1" });
        enviar();

        expect(screen.getByText("Las contrasenas no coinciden.")).toBeInTheDocument();
    });

    it("no permite registrar un correo que ya existe", () => {
        renderizar(<Registro />);
        llenarFormulario({ correo: "admin@duoc.cl" });
        enviar();

        expect(
            screen.getByText("Ya existe una cuenta registrada con ese correo.")
        ).toBeInTheDocument();
    });

    it("con datos correctos crea la cuenta y limpia el formulario", () => {
        renderizar(<Registro />);
        llenarFormulario();
        enviar();

        expect(screen.getByText(/Cuenta creada correctamente, Ana/)).toBeInTheDocument();
        expect(screen.getByLabelText("Nombres")).toHaveValue("");

        const registrados = JSON.parse(localStorage.getItem("huertohogar.registrados"));
        expect(registrados[0].correo).toBe("ana@gmail.com");
    });
});
