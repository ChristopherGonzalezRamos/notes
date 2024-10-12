// src/components/Settings.jsx
import React from "react";
import { FaSun, FaMoon, FaArrowLeft } from 'react-icons/fa'; // Importar íconos

const Settings = ({ darkMode, toggleDarkMode, onBack }) => {
    return (
        <div className={`settings-container ${darkMode ? 'dark-mode' : 'light-mode'}`} style={{ padding: '10px', width: '200px', height: '100vh', 
        position: 'fixed', top: 0, right: 0, backgroundColor: darkMode ? '#333' : '#f8f9fa', color: darkMode ? '#fff' : '#000', boxShadow: '0 0 5px rgba(0,0,0,0.3)', 
        zIndex: 1000 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: darkMode ? '#fff' : '#000', 
                fontSize: '1.2rem', cursor: 'pointer', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                <FaArrowLeft style={{ marginRight: '8px' }} />
                Regresar
            </button>
            <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Configuraciones</h3>
            <div className="dark-mode-toggle" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={toggleDarkMode}>
                {darkMode ? <FaSun style={{ marginRight: '8px' }} /> : <FaMoon style={{ marginRight: '8px' }} />}
                <span style={{ fontSize: '0.9rem' }}>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </div>
        </div>
    );
};

export default Settings;
