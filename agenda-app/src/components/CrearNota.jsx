import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, push } from "firebase/database";
import appFirebase from "../credenciales";
import { getAuth } from "firebase/auth";

const auth = getAuth(appFirebase);

const CrearNota = () => {
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const navigate = useNavigate();
    const db = getDatabase(appFirebase);

    const handleSaveNote = () => {
        const user = auth.currentUser;
        if (user) {
            // Genera una nueva referencia con un ID único
            const newNoteRef = ref(db, 'notes/' + push(ref(db, 'notes')).key);
            set(newNoteRef, {
                title: titulo,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userEmail: user.email,
                content: contenido  // Añadido el contenido aquí
            }).then(() => {
                alert(`Nota guardada: \nTítulo: ${titulo}\nContenido: ${contenido}`);
                navigate("/notas");
            }).catch(error => {
                console.error("Error al guardar la nota:", error);
            });
        }
    };

    return (
        <div className="container">
            <h2 className="text-center">Crear Nota</h2>
            <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                    type="text"
                    className="form-control"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Contenido</label>
                <textarea
                    className="form-control"
                    rows="5"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                />
            </div>
            <button className="btn btn-success" onClick={handleSaveNote}>
                Guardar Nota
            </button>
        </div>
    );
};

export default CrearNota;
