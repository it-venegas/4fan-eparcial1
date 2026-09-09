/* Huerto Hogar - Funciones de la pagina de inicio
   Actualiza el contador del carrito y saluda al usuario si ya
   inicio sesion.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* Si hay una sesion guardada, mostramos el nombre del usuario. */
    const saludo = document.getElementById("saludoUsuario");
    if (!saludo) {
        return;
    }

    let sesion = null;
    try {
        sesion = JSON.parse(localStorage.getItem("huertohogar.sesion"));
    } catch (error) {
        console.warn("No se pudo leer la sesion:", error);
    }

    if (sesion) {
        saludo.textContent = "Hola de nuevo, " + sesion.nombre + ".";
        saludo.classList.remove("d-none");
    }
});
