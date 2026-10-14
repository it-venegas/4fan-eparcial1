/* ============================================================
   Huerto Hogar - Estado global de la sesion

   Guarda quien inicio sesion para que la barra de navegacion y la
   pagina de inicio puedan saludarlo. Igual que el carrito, el dato
   se conserva en localStorage entre visitas.

   Las cuentas registradas desde el formulario de registro se suman
   a las cuentas de prueba, asi el usuario puede entrar con la
   cuenta que acaba de crear.
   ============================================================ */

import { createContext, useContext, useEffect, useState } from "react";
import { USUARIOS } from "../datos/productos";

const CLAVE_SESION = "huertohogar.sesion";
const CLAVE_REGISTRADOS = "huertohogar.registrados";

const SesionContext = createContext(null);

function leerJson(clave, valorPorDefecto) {
    try {
        const guardado = localStorage.getItem(clave);
        return guardado ? JSON.parse(guardado) : valorPorDefecto;
    } catch (error) {
        console.warn(`No se pudo leer ${clave}:`, error);
        return valorPorDefecto;
    }
}

export function SesionProvider({ children }) {
    const [usuario, setUsuario] = useState(() => leerJson(CLAVE_SESION, null));
    const [registrados, setRegistrados] = useState(() => leerJson(CLAVE_REGISTRADOS, []));

    /* Guardamos la sesion cada vez que cambia. */
    useEffect(() => {
        try {
            if (usuario) {
                localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
            } else {
                localStorage.removeItem(CLAVE_SESION);
            }
        } catch (error) {
            console.warn("No se pudo guardar la sesion:", error);
        }
    }, [usuario]);

    useEffect(() => {
        try {
            localStorage.setItem(CLAVE_REGISTRADOS, JSON.stringify(registrados));
        } catch (error) {
            console.warn("No se pudo guardar la lista de registrados:", error);
        }
    }, [registrados]);

    /*
     Busca la cuenta entre las de prueba y las registradas.
     Devuelve el usuario si las credenciales coinciden, o null si no.
  */
    function iniciarSesion(correo, contrasena) {
        const texto = String(correo).trim().toLowerCase();
        const cuentas = [...USUARIOS, ...registrados];

        const encontrado = cuentas.find(
            (cuenta) => cuenta.correo.toLowerCase() === texto && cuenta.contrasena === contrasena
        );

        if (!encontrado) {
            return null;
        }

        setUsuario({ correo: encontrado.correo, nombre: encontrado.nombre, tipo: encontrado.tipo });
        return encontrado;
    }

    function cerrarSesion() {
        setUsuario(null);
    }

    /*
     Registra una cuenta nueva. Devuelve un mensaje de error si el
     correo ya estaba en uso, o null si el registro salio bien.
  */
    function registrar(cuenta) {
        const texto = cuenta.correo.trim().toLowerCase();
        const repetidoEnPrueba = USUARIOS.some((u) => u.correo.toLowerCase() === texto);
        const repetidoEnNuevos = registrados.some((u) => u.correo.toLowerCase() === texto);

        if (repetidoEnPrueba || repetidoEnNuevos) {
            return "Ya existe una cuenta registrada con ese correo.";
        }

        setRegistrados((actuales) => [...actuales, { ...cuenta, tipo: "Cliente" }]);
        return null;
    }

    const valor = { usuario, registrados, iniciarSesion, cerrarSesion, registrar };

    return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
    const contexto = useContext(SesionContext);

    if (!contexto) {
        throw new Error("useSesion debe usarse dentro de SesionProvider.");
    }
    return contexto;
}
