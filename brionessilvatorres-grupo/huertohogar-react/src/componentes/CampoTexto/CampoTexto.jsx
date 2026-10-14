/* ============================================================
   Componente CampoTexto

   Un campo de formulario con su etiqueta y su mensaje de error.
   Antes cada campo repetia el mismo bloque de HTML en login y en
   registro; ahora el bloque existe una vez y se configura por
   propiedades.

   Propiedades que recibe:
   - id: identificador del campo, usado por la etiqueta.
   - etiqueta: texto que ve el usuario.
   - tipo: text, email o password. Por defecto text.
   - valor: lo que hay escrito. Lo controla la vista (componente
     controlado), por eso siempre refleja el estado del formulario.
   - error: mensaje a mostrar, o null si el campo esta correcto.
   - tocado: indica si el usuario ya salio del campo. Evita marcar
     en rojo un campo que todavia no ha completado.
   - onChange y onBlur: avisan a la vista de lo que hizo el usuario.
   - ayuda: texto gris opcional bajo la etiqueta.
   ============================================================ */

import "./CampoTexto.css";

function CampoTexto({
    id,
    etiqueta,
    tipo = "text",
    valor,
    error,
    tocado,
    onChange,
    onBlur,
    ayuda,
    maxLength,
    autoComplete,
    placeholder
}) {
    /* Solo marcamos el campo una vez que el usuario interactuo con el. */
    const mostrarError = Boolean(tocado && error);
    const mostrarValido = Boolean(tocado && !error && valor);

    return (
        <div className="mb-3 campoTexto">
            <label htmlFor={id} className="form-label">
                {etiqueta}
                {ayuda && <span className="textoAyuda">{ayuda}</span>}
            </label>

            <input
                id={id}
                name={id}
                type={tipo}
                className={`form-control ${mostrarError ? "is-invalid" : ""} ${
                    mostrarValido ? "is-valid" : ""
                }`}
                value={valor}
                onChange={(evento) => onChange(id, evento.target.value)}
                onBlur={() => onBlur(id)}
                maxLength={maxLength}
                autoComplete={autoComplete}
                placeholder={placeholder}
            />

            {/* El mensaje solo se dibuja cuando hay error que mostrar */}
            {mostrarError && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}

export default CampoTexto;
