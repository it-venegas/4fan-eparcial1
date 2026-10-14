import { describe, it, expect } from "vitest";
import {
    validarTexto,
    validarCorreo,
    validarContrasena,
    validarConfirmacion,
    validarFormulario,
    formatearPrecio
} from "./validaciones";

describe("validarCorreo", () => {
    it("acepta los tres dominios permitidos", () => {
        expect(validarCorreo("ana@duoc.cl")).toBeNull();
        expect(validarCorreo("profe@profesor.duoc.cl")).toBeNull();
        expect(validarCorreo("ana@gmail.com")).toBeNull();
    });

    it("acepta mayusculas y espacios alrededor", () => {
        expect(validarCorreo("  ANA@GMAIL.COM ")).toBeNull();
    });

    it("rechaza el correo vacio", () => {
        expect(validarCorreo("")).toBe("Ingresa tu correo para continuar.");
    });

    it("rechaza un dominio no permitido", () => {
        expect(validarCorreo("ana@hotmail.com")).toMatch(/Solo aceptamos correos/);
    });

    it("rechaza un texto sin arroba", () => {
        expect(validarCorreo("anagmail.com")).toMatch(/correo valido/);
    });

    it("rechaza mas de 100 caracteres", () => {
        const largo = "a".repeat(95) + "@gmail.com";
        expect(validarCorreo(largo)).toMatch(/100 caracteres/);
    });
});

describe("validarContrasena", () => {
    it("acepta los limites de 4 y 10 caracteres", () => {
        expect(validarContrasena("1234")).toBeNull();
        expect(validarContrasena("1234567890")).toBeNull();
    });

    it("rechaza menos de 4 y mas de 10 caracteres", () => {
        expect(validarContrasena("123")).toMatch(/entre 4 y 10/);
        expect(validarContrasena("12345678901")).toMatch(/entre 4 y 10/);
    });

    it("rechaza la contrasena vacia", () => {
        expect(validarContrasena("")).toMatch(/Ingresa una contrasena/);
    });
});

describe("validarTexto", () => {
    it("acepta un texto dentro del largo maximo", () => {
        expect(validarTexto("Ana", "tu nombre", 50)).toBeNull();
    });

    it("rechaza el texto vacio o con solo espacios", () => {
        expect(validarTexto("   ", "tu nombre", 50)).toBe("Ingresa tu nombre para continuar.");
    });

    it("rechaza el texto que supera el maximo", () => {
        expect(validarTexto("a".repeat(51), "tu nombre", 50)).toMatch(/50 caracteres/);
    });
});

describe("validarConfirmacion", () => {
    it("acepta cuando coincide con la contrasena", () => {
        expect(validarConfirmacion("clave1", "clave1")).toBeNull();
    });

    it("rechaza cuando no coincide", () => {
        expect(validarConfirmacion("clave1", "clave2")).toBe("Las contrasenas no coinciden.");
    });
});

describe("validarFormulario", () => {
    const reglas = {
        correo: (valor) => validarCorreo(valor),
        contrasena: (valor) => validarContrasena(valor)
    };

    it("devuelve un objeto vacio si todo esta correcto", () => {
        const errores = validarFormulario({ correo: "ana@gmail.com", contrasena: "1234" }, reglas);
        expect(errores).toEqual({});
    });

    it("devuelve solo los campos con error", () => {
        const errores = validarFormulario({ correo: "ana@gmail.com", contrasena: "1" }, reglas);
        expect(Object.keys(errores)).toEqual(["contrasena"]);
    });
});

describe("formatearPrecio", () => {
    it("formatea en pesos chilenos con punto de miles", () => {
        expect(formatearPrecio(1200)).toMatch(/\$\s?1\.200/);
    });
});
