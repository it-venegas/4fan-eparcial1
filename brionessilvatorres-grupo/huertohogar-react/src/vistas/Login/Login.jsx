/* ============================================================
   Vista Login

   Equivale al antiguo login/login.html. El formulario ahora es
   controlado: cada campo muestra lo que guarda el estado, y cada
   tecla actualiza ese estado.
   ============================================================ */

import { Link } from "react-router-dom";
import CampoTexto from "../../componentes/CampoTexto/CampoTexto";
import { useLogin } from "./useLogin";
import "./Login.css";

function Login() {
    const { valores, errores, tocados, manejarCambio, manejarBlur, aviso, enviar } = useLogin();

    return (
        <main className="container">
            <h2 className="txtLogin mt-5 mb-3">Logeate</h2>

            <section className="sctLogin">
                {aviso && <div className={`alert alert-${aviso.tipo}`}>{aviso.texto}</div>}

                <div className="alert alert-warning">
                    Cuentas de prueba: admin@duoc.cl / admin123 y cliente@gmail.com / cliente1
                </div>

                <form onSubmit={enviar} noValidate>
                    <CampoTexto
                        id="correo"
                        etiqueta="Correo"
                        tipo="email"
                        ayuda="Solo @duoc.cl, @profesor.duoc.cl y @gmail.com"
                        placeholder="ejemplo@gmail.com"
                        maxLength={100}
                        autoComplete="username"
                        valor={valores.correo}
                        error={errores.correo}
                        tocado={tocados.correo}
                        onChange={manejarCambio}
                        onBlur={manejarBlur}
                    />

                    <CampoTexto
                        id="contrasena"
                        etiqueta="Contrasena"
                        tipo="password"
                        ayuda="Entre 4 y 10 caracteres"
                        maxLength={10}
                        autoComplete="current-password"
                        valor={valores.contrasena}
                        error={errores.contrasena}
                        tocado={tocados.contrasena}
                        onChange={manejarCambio}
                        onBlur={manejarBlur}
                    />

                    <button type="submit" className="botonLogin btn w-100 mb-3">
                        Login
                    </button>

                    <Link className="nav-link text-center btnRegis" to="/registro">
                        Si no tienes cuenta, registrate!
                    </Link>
                </form>
            </section>
        </main>
    );
}

export default Login;
