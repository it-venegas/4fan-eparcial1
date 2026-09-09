/*Huerto Hogar - Validacion del formulario de login

   Reglas pedidas por el cliente:
   - Correo: requerido, maximo 100 caracteres, solo los dominios
     @duoc.cl, @profesor.duoc.cl y @gmail.com.
   - Contrasena: requerida, entre 4 y 10 caracteres.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    Validador.iniciar("formularioLogin", {

        "input-email": [
            Reglas.requerido("tu correo"),
            Reglas.maximo(100, "El correo"),
            Reglas.correo()
        ],

        "input-pass": [
            Reglas.requerido("tu contrasena"),
            Reglas.rango(4, 10, "La contrasena")
        ]

    }, function () {
        /* Esta funcion solo corre si todos los campos pasaron la validacion. */
        const correo = document.getElementById("input-email").value.trim().toLowerCase();
        const clave = document.getElementById("input-pass").value;

        const usuario = USUARIOS.find(function (u) {
            return u.correo.toLowerCase() === correo && u.contrasena === clave;
        });

        if (!usuario) {
            Validador.mostrarAviso("formularioLogin", "danger",
                "Ese correo y contrasena no coinciden con ninguna cuenta registrada.");
            return;
        }

        /* Guardamos la sesion para saber quien esta conectado. */
        localStorage.setItem("huertohogar.sesion", JSON.stringify(usuario));

        Validador.mostrarAviso("formularioLogin", "success",
            "Bienvenido de vuelta, " + usuario.nombre + ". Te estamos redirigiendo al catalogo.");

        setTimeout(function () {
            window.location.href = "../catalogo/catalogo.html";
        }, 1500);
    });
});
