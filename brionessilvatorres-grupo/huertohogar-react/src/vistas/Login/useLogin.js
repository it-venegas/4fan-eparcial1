/* ============================================================
   Logica de la vista Login

   Reemplaza a functions-login.js. Usa el hook useFormulario para
   el estado de los campos y las reglas de validacion, y el
   contexto de sesion para comprobar las credenciales.

   Las reglas son las mismas de la version anterior: el correo debe
   ser de uno de los tres dominios permitidos y la contrasena debe
   tener entre 4 y 10 caracteres.
   ============================================================ */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormulario } from "../../utilidades/useFormulario";
import { validarCorreo, validarContrasena } from "../../utilidades/validaciones";
import { useSesion } from "../../contexto/SesionContext";

const REGLAS = {
    correo: (valor) => validarCorreo(valor),
    contrasena: (valor) => validarContrasena(valor)
};

export function useLogin() {
    const navegar = useNavigate();
    const { iniciarSesion } = useSesion();
    const [aviso, setAviso] = useState(null);

    const formulario = useFormulario({ correo: "", contrasena: "" }, REGLAS);

    function enviar(evento) {
        evento.preventDefault();

        if (!formulario.validarTodo()) {
            setAviso({
                tipo: "danger",
                texto: "Revisa los campos marcados en rojo antes de continuar."
            });
            return;
        }

        const usuario = iniciarSesion(formulario.valores.correo, formulario.valores.contrasena);

        if (!usuario) {
            setAviso({
                tipo: "danger",
                texto: "Ese correo y contrasena no coinciden con ninguna cuenta registrada."
            });
            return;
        }

        setAviso({
            tipo: "success",
            texto: `Bienvenido de vuelta, ${usuario.nombre}. Te llevamos al catalogo.`
        });

        /* Damos un momento para que el usuario alcance a leer el mensaje. */
        setTimeout(() => navegar("/catalogo"), 1200);
    }

    return { ...formulario, aviso, enviar };
}
