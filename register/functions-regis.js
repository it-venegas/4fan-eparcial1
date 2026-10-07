/* ============================================================
   Huerto Hogar - Validacion del formulario de registro

   Reglas pedidas por el cliente:
   - Nombres: requerido, maximo 50 caracteres.
   - Apellidos: requeridos, maximo 100 caracteres.
   - Correo: requerido, maximo 100 caracteres y solo los dominios
     @duoc.cl, @profesor.duoc.cl y @gmail.com.
   - Contrasena: requerida, entre 4 y 10 caracteres.
   - Confirmacion: tiene que ser igual a la contrasena.

   Cada campo se revisa mientras el usuario escribe y al salir del
   campo. Al presionar Registrate se revisa todo el formulario de
   nuevo antes de guardar la cuenta.
   ============================================================ */

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];


/* ---------- Mensajes de error bajo cada campo ---------- */

/*
   Busca la caja de mensaje que va debajo del input y la crea si no
   existe. Bootstrap muestra la clase invalid-feedback cuando el
   campo de arriba tiene la clase is-invalid.
*/
function cajaMensaje(campo) {
    let caja = campo.nextElementSibling;

    if (!caja || !caja.classList.contains("invalid-feedback")) {
        caja = document.createElement("div");
        caja.className = "invalid-feedback";
        campo.insertAdjacentElement("afterend", caja);
    }
    return caja;
}

function marcarError(campo, mensaje) {
    campo.classList.remove("is-valid");
    campo.classList.add("is-invalid");
    cajaMensaje(campo).textContent = mensaje;
    return false;
}

function marcarValido(campo) {
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
    cajaMensaje(campo).textContent = "";
    return true;
}

/* Mensaje general que se muestra arriba del formulario. */
function mostrarAviso(tipo, texto) {
    const formulario = document.querySelector(".sctRegis form");
    if (!formulario) {
        return;
    }

    let aviso = document.querySelector(".avisoRegis");
    if (!aviso) {
        aviso = document.createElement("div");
        aviso.className = "avisoRegis";
        formulario.insertAdjacentElement("beforebegin", aviso);
    }

    aviso.className = "avisoRegis alert alert-" + tipo;
    aviso.textContent = texto;
}


/* ---------- Validacion de cada campo ---------- */

function validarTexto(campo, etiqueta, largoMaximo) {
    const valor = campo.value.trim();

    if (valor === "") {
        return marcarError(campo, "Ingresa " + etiqueta + " para continuar.");
    }
    if (valor.length > largoMaximo) {
        return marcarError(campo, etiqueta + " no puede superar los " + largoMaximo + " caracteres.");
    }
    return marcarValido(campo);
}

function validarCorreo(campo) {
    const valor = campo.value.trim().toLowerCase();

    if (valor === "") {
        return marcarError(campo, "Ingresa tu correo para continuar.");
    }
    if (valor.length > 100) {
        return marcarError(campo, "El correo no puede superar los 100 caracteres.");
    }
    if (valor.indexOf("@") === -1 || valor.indexOf(" ") !== -1) {
        return marcarError(campo, "Escribe un correo valido, por ejemplo nombre@gmail.com.");
    }

    const permitido = DOMINIOS_PERMITIDOS.some(function (dominio) {
        return valor.endsWith(dominio);
    });

    if (!permitido) {
        return marcarError(campo, "Solo aceptamos correos " + DOMINIOS_PERMITIDOS.join(", ") + ".");
    }
    return marcarValido(campo);
}

function validarContrasena(campo) {
    const valor = campo.value;

    if (valor === "") {
        return marcarError(campo, "Ingresa una contrasena para continuar.");
    }
    if (valor.length < 4 || valor.length > 10) {
        return marcarError(campo, "La contrasena debe tener entre 4 y 10 caracteres.");
    }
    return marcarValido(campo);
}

function validarConfirmacion(campo, campoContrasena) {
    if (campo.value === "") {
        return marcarError(campo, "Repite la contrasena para continuar.");
    }
    if (campo.value !== campoContrasena.value) {
        return marcarError(campo, "Las contrasenas no coinciden.");
    }
    return marcarValido(campo);
}


/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", function () {

    const nombres = document.getElementById("input-name");
    const apellidos = document.getElementById("input-lastname");
    const correo = document.getElementById("input-email");
    const contrasena = document.getElementById("input-pass");
    const confirmar = document.getElementById("input-pass2");
    const botonRegistrar = document.querySelector(".botonRegis");

    if (!nombres || !apellidos || !correo || !contrasena || !confirmar) {
        return;
    }

    /*
       Cada campo se revisa con su propia funcion. Guardamos la pareja
       campo-revision en una lista para no repetir el mismo bloque de
       eventos cinco veces.
    */
    const campos = [
        { campo: nombres, revisar: function () { return validarTexto(nombres, "tu nombre", 50); } },
        { campo: apellidos, revisar: function () { return validarTexto(apellidos, "tus apellidos", 100); } },
        { campo: correo, revisar: function () { return validarCorreo(correo); } },
        { campo: contrasena, revisar: function () { return validarContrasena(contrasena); } },
        { campo: confirmar, revisar: function () { return validarConfirmacion(confirmar, contrasena); } }
    ];

    /* Validacion en tiempo real: mientras se escribe y al salir del campo. */
    campos.forEach(function (item) {
        item.campo.addEventListener("input", item.revisar);
        item.campo.addEventListener("blur", item.revisar);
    });

    /* Si cambia la contrasena, volvemos a revisar la confirmacion. */
    contrasena.addEventListener("input", function () {
        if (confirmar.value !== "") {
            validarConfirmacion(confirmar, contrasena);
        }
    });

    /* El boton Registrate es un enlace, asi que escuchamos su clic y
       evitamos que el navegador salte al inicio de la pagina. */
    function intentarRegistrar(evento) {
        evento.preventDefault();

        /* Revisamos todos los campos. Se usa forEach y no some para que
           queden marcados todos los errores a la vez, no solo el primero. */
        let todoOk = true;
        campos.forEach(function (item) {
            if (!item.revisar()) {
                todoOk = false;
            }
        });

        if (!todoOk) {
            mostrarAviso("danger", "Revisa los campos marcados en rojo antes de continuar.");
            return;
        }

        /* Guardamos la cuenta para poder iniciar sesion con ella despues. */
        let registrados = [];
        try {
            registrados = JSON.parse(localStorage.getItem("huertohogar.registrados")) || [];
        } catch (error) {
            registrados = [];
        }

        const nuevoCorreo = correo.value.trim().toLowerCase();
        const repetido = registrados.some(function (cuenta) {
            return cuenta.correo.toLowerCase() === nuevoCorreo;
        });

        if (repetido) {
            mostrarAviso("danger", "Ya existe una cuenta registrada con ese correo.");
            return;
        }

        registrados.push({
            nombre: nombres.value.trim() + " " + apellidos.value.trim(),
            correo: correo.value.trim(),
            contrasena: contrasena.value
        });
        localStorage.setItem("huertohogar.registrados", JSON.stringify(registrados));

        mostrarAviso("success",
            "Cuenta creada correctamente, " + nombres.value.trim() + ". Ya puedes iniciar sesion.");

        /* Dejamos el formulario limpio para un nuevo registro. */
        campos.forEach(function (item) {
            item.campo.value = "";
            item.campo.classList.remove("is-valid", "is-invalid");
        });
    }

    if (botonRegistrar) {
        botonRegistrar.addEventListener("click", intentarRegistrar);
    }

    const formulario = document.querySelector(".sctRegis form");
    if (formulario) {
        formulario.addEventListener("submit", intentarRegistrar);
    }
});
