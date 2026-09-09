/*- Funciones del catalogo
   - Filtra los productos por categoria usando el atributo data-cat.
   - Busca por nombre en tiempo real.
   - Agrega productos al carrito, que se guarda en localStorage.
   ============================================================ */


function agregarAlCarrito(boton) {
    const codigo = boton.dataset.codigo;
    const resultado = Carrito.agregar(codigo, 1);

    /* Confirmacion visual en el mismo boton. */
    const textoOriginal = boton.textContent;
    boton.textContent = "Agregado!";
    boton.disabled = true;

    setTimeout(function () {
        boton.textContent = textoOriginal;
        boton.disabled = false;
    }, 1200);

    console.log(resultado.mensaje);
}

document.addEventListener("DOMContentLoaded", function () {

    const productos = document.querySelectorAll(".producto");
    const buscador = document.getElementById("buscador");
    const conteo = document.getElementById("conteoResultados");

    let categoriaActiva = "todas";
    let textoBuscado = "";

    /* Muestra u oculta cada tarjeta segun el filtro y la busqueda. */
    function filtrar() {
        let visibles = 0;

        productos.forEach(function (tarjeta) {
            const categoria = tarjeta.dataset.cat;
            const nombre = tarjeta.querySelector(".card-title").textContent.toLowerCase();

            const pasaCategoria = categoriaActiva === "todas" || categoria === categoriaActiva;
            const pasaBusqueda = nombre.indexOf(textoBuscado.toLowerCase()) !== -1;

            if (pasaCategoria && pasaBusqueda) {
                tarjeta.style.display = "";
                visibles = visibles + 1;
            } else {
                tarjeta.style.display = "none";
            }
        });

        if (conteo) {
            conteo.textContent = visibles + (visibles === 1 ? " producto" : " productos");
        }
    }

    /* Botones de categoria. */
    document.querySelectorAll(".filtro").forEach(function (boton) {
        boton.addEventListener("click", function () {
            document.querySelectorAll(".filtro").forEach(function (b) {
                b.classList.remove("activo");
            });
            boton.classList.add("activo");
            categoriaActiva = boton.dataset.categoria;
            filtrar();
        });
    });

    /* Buscador */
    if (buscador) {
        buscador.addEventListener("input", function () {
            textoBuscado = buscador.value.trim();
            filtrar();
        });
    }

    filtrar();
});
