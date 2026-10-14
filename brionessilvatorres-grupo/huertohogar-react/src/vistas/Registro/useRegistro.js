/* ============================================================
   Logica de la vista Registro

   Reemplaza a functions-regis.js. Mantiene las mismas reglas que
   pidio el cliente: nombres hasta 50 caracteres, apellidos hasta
   100, correo de los dominios permitidos, contrasena de 4 a 10 y
   confirmacion que debe coincidir.

   La cuenta creada queda guardada, asi que despues se puede
   iniciar sesion con ella.
   ============================================================ */

import { useState } from "react";
import { useFormulario } from "../../utilidades/useFormulario";
import {
    validarTexto,
    validarCorreo,
    validarContrasena,
    validarConfirmacion
} from "../../utilidades/validaciones";
import { useSesion } from "../../contexto/SesionContext";

/*
   Cada regla recibe el valor del campo y, como segundo parametro,
   todos los valores del formulario. La confirmacion lo aprovecha
   para compararse con la contrasena.
*/
const REGLAS = {
    nombres: (valor) => validarTexto(valor, "tu nombre", 50),
    apellidos: (valor) => validarTexto(valor, "tus apellidos", 100),
    correo: (valor) => validarCorreo(valor),
    contrasena: (valor) => validarContrasena(valor),
    confirmar: (valor, valores) => validarConfirmacion(valor, valores.contrasena)
};

const VALORES_INICIALES = {
    nombres: "",
    apellidos: "",
    correo: "",
    contrasena: "",
    confirmar: ""
};

export function useRegistro() {
    const { registrar } = useSesion();
    const [aviso, setAviso] = useState(null);

    const formulario = useFormulario(VALORES_INICIALES, REGLAS);

    function enviar(evento) {
        evento.preventDefault();

        if (!formulario.validarTodo()) {
            setAviso({
                tipo: "danger",
                texto: "Revisa los campos marcados en rojo antes de continuar."
            });
            return;
        }

        const { nombres, apellidos, correo, contrasena } = formulario.valores;

        const error = registrar({
            nombre: `${nombres.trim()} ${apellidos.trim()}`,
            correo: correo.trim(),
            contrasena
        });

        if (error) {
            setAviso({ tipo: "danger", texto: error });
            return;
        }

        setAviso({
            tipo: "success",
            texto: `Cuenta creada correctamente, ${nombres.trim()}. Ya puedes iniciar sesion.`
        });
        formulario.limpiar();
    }

    return { ...formulario, aviso, enviar };
}
