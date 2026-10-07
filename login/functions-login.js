/* ============================================================
   Huerto Hogar - Validacion del formulario de login

   Reglas pedidas por el cliente:
   - Correo: requerido, maximo 100 caracteres y solo los dominios
     @duoc.cl, @profesor.duoc.cl y @gmail.com.
   - Contrasena: requerida, entre 4 y 10 caracteres.

   Cada campo se revisa mientras el usuario escribe y al salir del
   campo. Al presionar Login se revisa todo de nuevo antes de
   comparar las credenciales.
   ============================================================ */

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

/* Cuentas de prueba del sistema. */
const USUARIOS = [
    { correo: "admin@duoc.cl", contrasena: "admin123", nombre: "Isabel Torres" },
    { correo: "vendedor@duoc.cl", contrasena: "venta123", nombre: "Francisca Silva" },
    { correo: "cliente@gmail.com", contrasena: "cliente1", nombre: "Josefa Munoz" }
];


/* ---------- Mensajes de error bajo cada campo ---------- */

/*
   Busca la caja de mensaje que va debajo del input. Si todavia no
   existe la crea, asi el HTML no necesita traerla escrita.
   Bootstrap muestra la clase invalid-feedback cuando el campo de
   arriba tiene la clase is-invalid.
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
    const formulario = document.querySelector(".sctLogin form");
    if (!formulario) {
        return;
    }

    let aviso = document.querySelector(".avisoLogin");
    if (!aviso) {
        aviso = document.createElement("div");
        aviso.className = "avisoLogin";
        formulario.insertAdjacentElement("beforebegin", aviso);
    }

    aviso.className = "avisoLogin alert alert-" + tipo;
    aviso.textContent = texto;
}


/* ---------- Validacion de cada campo ---------- */

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
        return marcarError(campo, "Ingresa tu contrasena para continuar.");
    }
    if (valor.length < 4 || valor.length > 10) {
        return marcarError(campo, "La contrasena debe tener entre 4 y 10 caracteres.");
    }
    return marcarValido(campo);
}


/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", function () {

    const correo = document.getElementById("input-email");
    const contrasena = document.getElementById("input-pass");
    const botonLogin = document.querySelector(".botonLogin");

    if (!correo || !contrasena) {
        return;
    }

    /* Validacion en tiempo real: mientras se escribe y al salir del campo. */
    correo.addEventListener("input", function () { validarCorreo(correo); });
    correo.addEventListener("blur", function () { validarCorreo(correo); });

    contrasena.addEventListener("input", function () { validarContrasena(contrasena); });
    contrasena.addEventListener("blur", function () { validarContrasena(contrasena); });

    /* El boton Login es un enlace, asi que escuchamos su clic y
       evitamos que el navegador salte al inicio de la pagina. */
    function intentarEntrar(evento) {
        evento.preventDefault();

        const correoOk = validarCorreo(correo);
        const contrasenaOk = validarContrasena(contrasena);

        if (!correoOk || !contrasenaOk) {
            mostrarAviso("danger", "Revisa los campos marcados en rojo antes de continuar.");
            return;
        }

        /* Buscamos la cuenta entre las de prueba y las que se
           registraron desde la pagina de registro. */
        let registrados = [];
        try {
            registrados = JSON.parse(localStorage.getItem("huertohogar.registrados")) || [];
        } catch (error) {
            registrados = [];
        }

        const cuentas = USUARIOS.concat(registrados);
        const texto = correo.value.trim().toLowerCase();

        const usuario = cuentas.find(function (cuenta) {
            return cuenta.correo.toLowerCase() === texto && cuenta.contrasena === contrasena.value;
        });

        if (!usuario) {
            mostrarAviso("danger", "Ese correo y contrasena no coinciden con ninguna cuenta registrada.");
            return;
        }

        /* Guardamos la sesion para saludar al usuario en el inicio. */
        localStorage.setItem("huertohogar.sesion", JSON.stringify({
            correo: usuario.correo,
            nombre: usuario.nombre
        }));

        mostrarAviso("success", "Bienvenido de vuelta, " + usuario.nombre + ". Te llevamos al catalogo.");

        setTimeout(function () {
            window.location.href = "../catalogo/catalogo.html";
        }, 1200);
    }

    if (botonLogin) {
        botonLogin.addEventListener("click", intentarEntrar);
    }

    const formulario = document.querySelector(".sctLogin form");
    if (formulario) {
        formulario.addEventListener("submit", intentarEntrar);
    }
});
