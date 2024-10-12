import React, { useState } from "react";
import Imagen from "../assets/agenda.png";

import appFirebase from "../credenciales";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(appFirebase);

const Login = () => {
    const [registrando, setRegistrando] = useState(false);

    const funcAutenticacion = async (e) => {
        e.preventDefault();
        const correo = e.target.email.value;
        const contraseña = e.target.password.value;

        if (registrando) {
            const nombre = e.target.nombre.value;
            const ocupacion = e.target.ocupacion.value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, correo, contraseña);
                const user = userCredential.user;

                // Guardar datos adicionales en la base de datos
                const db = getDatabase(appFirebase);
                await set(ref(db, 'users/' + user.uid), {
                    nombre: nombre,
                    ocupacion: ocupacion,
                    correo: correo,
                });

                alert("Usuario registrado exitosamente.");
            } catch (error) {
                alert(`Error al registrar: ${error.message}`);
            }
        } else {
            try {
                await signInWithEmailAndPassword(auth, correo, contraseña);
                alert("Inicio de sesión exitoso.");
            } catch (error) {
                alert(`Error al iniciar sesión: ${error.message}`);
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row w-100">
                {/* Cuadro para el login */}
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className="card card-body shadow-lg">
                        <form onSubmit={funcAutenticacion}>
                            <h1 className="text-center mb-4">BIENVENIDO A NOT3S</h1>
                            {registrando && (
                                <>
                                    <input type="text" placeholder="Nombre" className="form-control mb-3" id="nombre" />
                                    <input type="text" placeholder="Ocupación" className="form-control mb-3" id="ocupacion" />
                                </>
                            )}
                            <input type="text" placeholder="Ingresar Email" className="form-control mb-3" id="email" />
                            <input type="password" placeholder="Ingresar Contraseña" className="form-control mb-3" id="password" />
                            <button className="btn btn-primary w-100 mb-3">{registrando ? "Regístrate" : "Iniciar Sesión"}</button>
                        </form>
                        <h4 className="text-center">
                            {registrando ? "Si ya tienes cuenta" : "No tienes cuenta"}
                        </h4>
                        <button className="btn btn-link w-100 text-center" onClick={() => setRegistrando(!registrando)}>
                            {registrando ? "Iniciar Sesión" : "Regístrate"}
                        </button>
                    </div>
                </div>

                {/* Espacio para la imagen */}
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <img src={Imagen} alt="Agenda" className="img-fluid" />
                </div>
            </div>
        </div>
    );
};

export default Login;
