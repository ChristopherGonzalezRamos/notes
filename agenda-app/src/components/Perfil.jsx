import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, update } from "firebase/database";
import appFirebase from "../credenciales";
import { useUser } from "../UserContext";
import { FaPencilAlt } from 'react-icons/fa'; // Importar el ícono de lápiz
import '../App.css';

const Perfil = () => {
    const { profileImage, setProfileImage } = useUser();
    const [userData, setUserData] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Estado para controlar si está en modo edición
    const [editedName, setEditedName] = useState('');
    const [editedOcupacion, setEditedOcupacion] = useState('');

    useEffect(() => {
        const auth = getAuth(appFirebase);
        const user = auth.currentUser;

        if (user) {
            const db = getDatabase(appFirebase);
            const userRef = ref(db, `users/${user.uid}`);

            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setUserData(data);
                    setProfileImage(data.profileImage || '');
                }
            });

            setUserEmail(user.email);
        }
    }, [setProfileImage]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataUrl = reader.result;
                setProfileImage(imageDataUrl);

                const auth = getAuth(appFirebase);
                const user = auth.currentUser;
                if (user) {
                    const db = getDatabase(appFirebase);
                    const userRef = ref(db, `users/${user.uid}`);
                    update(userRef, { profileImage: imageDataUrl });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = () => {
        setEditedName(userData.nombre);
        setEditedOcupacion(userData.ocupacion);
        setIsEditing(true);
    };

    const handleSaveChanges = () => {
        const auth = getAuth(appFirebase);
        const user = auth.currentUser;
        if (user) {
            const db = getDatabase(appFirebase);
            const userRef = ref(db, `users/${user.uid}`);
            update(userRef, {
                nombre: editedName,
                ocupacion: editedOcupacion,
            }).then(() => {
                setIsEditing(false);
            });
        }
    };

    return (
        <div className="perfil-container">
            <h1 className="perfil-title">Mi Perfil</h1>
            {userData ? (
                <div className="profile-content">
                    <div className="profile-image-container">
                        <label htmlFor="profile-image-upload" className="profile-image-label">
                            {profileImage ? (
                                <img src={profileImage} alt="Foto de perfil" className="profile-image" />
                            ) : (
                                <div className="placeholder-image">Selecciona una imagen</div>
                            )}
                        </label>
                        <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <p className="profile-image-text">Foto de perfil</p>
                    </div>
                    
                    {!isEditing ? (
                        <>
                            <p className="profile-data"><strong>Nombre:</strong> {userData.nombre}</p>
                            <p className="profile-data"><strong>Correo electrónico:</strong> {userEmail}</p>
                            <p className="profile-data"><strong>Ocupación:</strong> {userData.ocupacion}</p>

                            <button 
                                className="btn btn-edit" 
                                onClick={handleEditClick}
                                style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}
                                title="Editar datos" // Tooltip al pasar el mouse
                            >
                                <FaPencilAlt style={{ marginRight: '5px' }} />
                                Editar datos
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="edit-form">
                                <div className="form-group">
                                    <label htmlFor="edit-name">Nombre:</label>
                                    <input
                                        id="edit-name"
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-ocupacion">Ocupación:</label>
                                    <input
                                        id="edit-ocupacion"
                                        type="text"
                                        value={editedOcupacion}
                                        onChange={(e) => setEditedOcupacion(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <button className="btn btn-save" onClick={handleSaveChanges} style={{ marginTop: '10px' }}>
                                    Guardar cambios
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <p className="text-center">Cargando datos del usuario...</p>
            )}
        </div>
    );
};

export default Perfil;
