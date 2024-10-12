import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import appFirebase from "../credenciales";

const EditarNota = () => {
    const { id } = useParams();  // Obtener el ID de la nota desde la URL
    const navigate = useNavigate();
    const db = getDatabase(appFirebase);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        // Buscar la nota en la base de datos usando el ID de la URL
        const noteRef = ref(db, `notes/${id}`);
        get(noteRef).then((snapshot) => {
            if (snapshot.exists()) {
                const note = snapshot.val();
                setTitle(note.title);
                setContent(note.content);
            } else {
                alert("Nota no encontrada");
                navigate("/notas");  // Redirigir si no se encuentra la nota
            }
        }).catch((error) => {
            alert(`Error al obtener la nota: ${error.message}`);
        });
    }, [db, id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Actualizar la nota en la base de datos
            await update(ref(db, `notes/${id}`), {
                title,
                content,
                updatedAt: new Date().toISOString(),
            });
            alert("Nota actualizada correctamente.");
            navigate("/notas");
        } catch (error) {
            alert(`Error al actualizar la nota: ${error.message}`);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center">Editar Nota</h2>
            <form onSubmit={handleUpdate}>
                <div className="form-group">
                    <label>Título</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Contenido</label>
                    <textarea
                        className="form-control"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Actualizar Nota</button>
            </form>
        </div>
    );
};

export default EditarNota;
