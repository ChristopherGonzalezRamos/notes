// src/components/NavBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaArrowLeft } from 'react-icons/fa'; // Importar íconos
import { useUser } from "../UserContext"; // Importar el contexto
import Settings from './Configuraciones'; // Importar el componente de configuraciones
import { getAuth, signOut } from "firebase/auth";
import appFirebase from "../credenciales"; // Importar credenciales de Firebase

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { profileImage } = useUser(); // Usar el contexto

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode", !darkMode);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        if (settingsOpen) setSettingsOpen(false); // Cerrar configuraciones si está abierta
    };

    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
        if (menuOpen) setMenuOpen(false); // Cerrar menú si está abierto
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleSignOut = () => {
        const userConfirmed = window.confirm("¿Deseas salir?");
        if (userConfirmed) {
            const auth = getAuth(appFirebase);
            signOut(auth).then(() => {
                console.log("Sesión cerrada");
            }).catch((error) => {
                console.error("Error al cerrar sesión", error);
            });
        }
    };    

    return (
        <>
            <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`} style={{ background: darkMode ? 'linear-gradient(90deg, rgba(0,36,61,1) 0%, rgba(2,65,109,1) 50%, rgba(9,9,121,1) 100%)' : '#f8f9fa' }}>
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: darkMode ? '#fff' : '#000' }}>NOT3S</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {!settingsOpen && (
                        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/" style={{ color: darkMode ? '#f8f9fa' : '#000', fontSize: '1.1rem', marginRight: '15px' }}>Inicio</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/notas" style={{ color: darkMode ? '#f8f9fa' : '#000', fontSize: '1.1rem', marginRight: '15px' }}>Agenda</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                    
                    <div className="dropdown">
                        <div className="user-icon" onClick={toggleMenu} style={{ cursor: 'pointer', borderRadius: '50%', border: `2px solid ${darkMode ? '#f8f9fa' : '#000'}`, width: '50px', height: '50px', overflow: 'hidden' }}>
                            {profileImage ? (
                                <img src={profileImage} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <FaUserCircle style={{ color: darkMode ? '#f8f9fa' : '#000', fontSize: '2rem' }} />
                            )}
                        </div>
                        {menuOpen && (
                            <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                                <Link className="dropdown-item" to="/perfil" onClick={closeMenu}>Mi Perfil</Link>
                                <button className="dropdown-item" onClick={toggleSettings}>Configuraciones</button>
                                <button className="dropdown-item" onClick={() => {handleSignOut(); closeMenu();}}>Cerrar sesión</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {settingsOpen && (
                <Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} onBack={() => setSettingsOpen(false)} />
            )}
        </>
    );
};

export default Navbar;
