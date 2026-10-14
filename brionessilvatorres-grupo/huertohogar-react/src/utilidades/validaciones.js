/* ============================================================
   Huerto Hogar - Reglas de validacion

   Son funciones puras: reciben un valor y devuelven el mensaje de
   error, o null si el dato esta correcto. No tocan el DOM ni
   dependen de React, por lo que las vistas las reutilizan y las
   pruebas unitarias pueden comprobarlas directamente.

   Reglas pedidas por el cliente:
   - Correo: requerido, maximo 100 caracteres y solo los dominios
     @duoc.cl, @profesor.duoc.cl y @gmail.com.
   - Contrasena: requerida, entre 4 y 10 caracteres.
   - Nombres: requerido, maximo 50 caracteres.
   - Apellidos: requeridos, maximo 100 caracteres.
   - Confirmacion: tiene que ser igual a la contrasena.
   ============================================================ */

export const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

/* Texto obligatorio con un largo maximo. */
export function validarTexto(valor, etiqueta, largoMaximo) {
    const texto = String(valor ?? "").trim();

    if (texto === "") {
        return `Ingresa ${etiqueta} para continuar.`;
    }
    if (texto.length > largoMaximo) {
        return `${etiqueta} no puede superar los ${largoMaximo} caracteres.`;
    }
    return null;
}

/* Correo con los tres dominios aceptados por el cliente. */
export function validarCorreo(valor) {
    const texto = String(valor ?? "")
        .trim()
        .toLowerCase();

    if (texto === "") {
        return "Ingresa tu correo para continuar.";
    }
    if (texto.length > 100) {
        return "El correo no puede superar los 100 caracteres.";
    }
    if (!texto.includes("@") || texto.includes(" ")) {
        return "Escribe un correo valido, por ejemplo nombre@gmail.com.";
    }

    const permitido = DOMINIOS_PERMITIDOS.some((dominio) => texto.endsWith(dominio));
    if (!permitido) {
        return `Solo aceptamos correos ${DOMINIOS_PERMITIDOS.join(", ")}.`;
    }
    return null;
}

/* Contrasena de 4 a 10 caracteres. */
export function validarContrasena(valor) {
    const texto = String(valor ?? "");

    if (texto === "") {
        return "Ingresa una contrasena para continuar.";
    }
    if (texto.length < 4 || texto.length > 10) {
        return "La contrasena debe tener entre 4 y 10 caracteres.";
    }
    return null;
}

/* La confirmacion tiene que coincidir con la contrasena. */
export function validarConfirmacion(valor, contrasena) {
    const texto = String(valor ?? "");

    if (texto === "") {
        return "Repite la contrasena para continuar.";
    }
    if (texto !== contrasena) {
        return "Las contrasenas no coinciden.";
    }
    return null;
}

/*
   Revisa un formulario completo.
   Recibe los valores y un objeto con la funcion de validacion de
   cada campo, y devuelve un objeto con los errores encontrados.
   Si no hay errores, el objeto queda vacio.
*/
export function validarFormulario(valores, reglas) {
    const errores = {};

    Object.keys(reglas).forEach((campo) => {
        const mensaje = reglas[campo](valores[campo], valores);
        if (mensaje) {
            errores[campo] = mensaje;
        }
    });

    return errores;
}

/* Formatea un numero como precio chileno: 1200 se muestra como $1.200 */
export function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(valor);
}
