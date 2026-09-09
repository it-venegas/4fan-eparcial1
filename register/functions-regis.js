/*Huerto Hogar - Validacion del formulario de registro

   Reglas pedidas por el cliente:
   - RUN: requerido, sin puntos ni guion, entre 7 y 9 caracteres,
     y se valida el digito verificador con el algoritmo Modulo 11.
   - Nombre: requerido, maximo 50 caracteres.
   - Apellidos: requeridos, maximo 100 caracteres.
   - Correo: requerido, maximo 100, solo los tres dominios permitidos.
   - Contrasena: requerida, entre 4 y 10 caracteres.
   - Confirmacion: tiene que ser igual a la contrasena.
   - Region y comuna: requeridas, la comuna depende de la region.
   - Direccion: requerida, maximo 300 caracteres.
   - Fecha de nacimiento: opcional, no puede ser futura.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* Carga las regiones y deja lista la actualizacion de comunas. */
    Validador.enlazarRegionComuna("input-region", "input-comuna");

    Validador.iniciar("formularioRegistro", {

        "input-run": [
            Reglas.requerido("tu RUN"),
            Reglas.run()
        ],

        "input-name": [
            Reglas.requerido("tu nombre"),
            Reglas.maximo(50, "El nombre")
        ],

        "input-lastname": [
            Reglas.requerido("tus apellidos"),
            Reglas.maximo(100, "Los apellidos")
        ],

        "input-email": [
            Reglas.requerido("tu correo"),
            Reglas.maximo(100, "El correo"),
            Reglas.correo()
        ],

        "input-fecha": [
            Reglas.fechaPasada("La fecha de nacimiento")
        ],

        "input-pass": [
            Reglas.requerido("una contrasena"),
            Reglas.rango(4, 10, "La contrasena")
        ],

        "input-pass2": [
            Reglas.requerido("la confirmacion de la contrasena"),
            Reglas.igualA("input-pass", "Las contrasenas no coinciden.")
        ],

        "input-region": [
            Reglas.requerido("tu region")
        ],

        "input-comuna": [
            Reglas.requerido("tu comuna")
        ],

        "input-direccion": [
            Reglas.requerido("tu direccion"),
            Reglas.maximo(300, "La direccion")
        ]

    }, function (formulario) {
        /* Solo llega aca si todo el formulario es valido. */
        const nuevoUsuario = {
            run: document.getElementById("input-run").value.trim().toUpperCase(),
            nombre: document.getElementById("input-name").value.trim(),
            apellidos: document.getElementById("input-lastname").value.trim(),
            correo: document.getElementById("input-email").value.trim(),
            region: document.getElementById("input-region").value,
            comuna: document.getElementById("input-comuna").value,
            direccion: document.getElementById("input-direccion").value.trim()
        };

        /* Guardamos el usuario registrado en localStorage. */
        const registrados = JSON.parse(localStorage.getItem("huertohogar.registrados") || "[]");
        registrados.push(nuevoUsuario);
        localStorage.setItem("huertohogar.registrados", JSON.stringify(registrados));

        Validador.mostrarAviso("formularioRegistro", "success",
            "Cuenta creada correctamente, " + nuevoUsuario.nombre + ". Ya puedes iniciar sesion.");

        formulario.reset();
        document.querySelectorAll(".is-valid, .is-invalid").forEach(function (campo) {
            campo.classList.remove("is-valid", "is-invalid");
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
