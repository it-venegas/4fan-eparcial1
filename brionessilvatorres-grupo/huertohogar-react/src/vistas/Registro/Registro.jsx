/* ============================================================
   Vista Registro

   Equivale al antiguo register/register.html. En esa version dos
   campos compartian el mismo id, lo que impedia validarlos; aqui
   cada campo es un componente con su propio identificador.
   ============================================================ */

import { Link } from "react-router-dom";
import CampoTexto from "../../componentes/CampoTexto/CampoTexto";
import { useRegistro } from "./useRegistro";
import "./Registro.css";

function Registro() {
    const { valores, errores, tocados, manejarCambio, manejarBlur, aviso, enviar } = useRegistro();

    return (
        <main className="container">
            <h2 className="txtRegis mt-5 mb-3">Registrate</h2>

            <section className="sctRegis">
                {aviso && <div className={`alert alert-${aviso.tipo}`}>{aviso.texto}</div>}

                <form onSubmit={enviar} noValidate>
                    <div className="row">
                        <div className="col-md-6">
                            <CampoTexto
                                id="nombres"
                                etiqueta="Nombres"
                                maxLength={50}
                                autoComplete="given-name"
                                valor={valores.nombres}
                                error={errores.nombres}
                                tocado={tocados.nombres}
                                onChange={manejarCambio}
                                onBlur={manejarBlur}
                            />
                        </div>

                        <div className="col-md-6">
                            <CampoTexto
                                id="apellidos"
                                etiqueta="Apellidos"
                                maxLength={100}
                                autoComplete="family-name"
                                valor={valores.apellidos}
                                error={errores.apellidos}
                                tocado={tocados.apellidos}
                                onChange={manejarCambio}
                                onBlur={manejarBlur}
                            />
                        </div>
                    </div>

                    <CampoTexto
                        id="correo"
                        etiqueta="Correo"
                        tipo="email"
                        ayuda="Solo @duoc.cl, @profesor.duoc.cl y @gmail.com"
                        placeholder="ejemplo@gmail.com"
                        maxLength={100}
                        autoComplete="email"
                        valor={valores.correo}
                        error={errores.correo}
                        tocado={tocados.correo}
                        onChange={manejarCambio}
                        onBlur={manejarBlur}
                    />

                    <div className="row">
                        <div className="col-md-6">
                            <CampoTexto
                                id="contrasena"
                                etiqueta="Contrasena"
                                tipo="password"
                                ayuda="Entre 4 y 10 caracteres"
                                maxLength={10}
                                autoComplete="new-password"
                                valor={valores.contrasena}
                                error={errores.contrasena}
                                tocado={tocados.contrasena}
                                onChange={manejarCambio}
                                onBlur={manejarBlur}
                            />
                        </div>

                        <div className="col-md-6">
                            <CampoTexto
                                id="confirmar"
                                etiqueta="Vuelva a escribir la contrasena"
                                tipo="password"
                                maxLength={10}
                                autoComplete="new-password"
                                valor={valores.confirmar}
                                error={errores.confirmar}
                                tocado={tocados.confirmar}
                                onChange={manejarCambio}
                                onBlur={manejarBlur}
                            />
                        </div>
                    </div>

                    <button type="submit" className="botonRegis btn w-100 mb-3">
                        Registrate
                    </button>

                    <Link className="nav-link text-center btnLogin" to="/login">
                        Si ya tienes cuenta, logeate!
                    </Link>
                </form>
            </section>
        </main>
    );
}

export default Registro;
