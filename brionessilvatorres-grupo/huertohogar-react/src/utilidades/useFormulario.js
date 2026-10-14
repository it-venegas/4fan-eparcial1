/* ============================================================
   Hook propio useFormulario

   Un hook es una funcion que guarda estado y logica para que un
   componente la reutilice. Este concentra lo que login y registro
   hacian igual: guardar lo escrito, marcar los campos que el
   usuario ya visito y calcular los errores.

   Recibe:
   - valoresIniciales: objeto con cada campo del formulario.
   - reglas: objeto con la funcion de validacion de cada campo.

   Devuelve los valores, los errores, que campos fueron tocados y
   las funciones que la vista conecta a los eventos.
   ============================================================ */

import { useState } from "react";
import { validarFormulario } from "./validaciones";

export function useFormulario(valoresIniciales, reglas) {
    const [valores, setValores] = useState(valoresIniciales);
    const [tocados, setTocados] = useState({});
    const [errores, setErrores] = useState({});

    /* Se ejecuta con cada tecla: guarda el valor y revalida. */
    function manejarCambio(campo, valor) {
        const nuevosValores = { ...valores, [campo]: valor };
        setValores(nuevosValores);
        setErrores(validarFormulario(nuevosValores, reglas));
    }

    /* Se ejecuta al salir del campo: desde aqui ya puede marcarse en rojo. */
    function manejarBlur(campo) {
        setTocados((actuales) => ({ ...actuales, [campo]: true }));
        setErrores(validarFormulario(valores, reglas));
    }

    /* Revisa todo el formulario. Devuelve true si no hay errores. */
    function validarTodo() {
        const nuevosErrores = validarFormulario(valores, reglas);
        setErrores(nuevosErrores);

        /* Marcamos todos los campos como tocados para que se vean
           los errores de los que el usuario nunca abrio. */
        const todosTocados = {};
        Object.keys(reglas).forEach((campo) => {
            todosTocados[campo] = true;
        });
        setTocados(todosTocados);

        return Object.keys(nuevosErrores).length === 0;
    }

    function limpiar() {
        setValores(valoresIniciales);
        setTocados({});
        setErrores({});
    }

    return { valores, errores, tocados, manejarCambio, manejarBlur, validarTodo, limpiar };
}
