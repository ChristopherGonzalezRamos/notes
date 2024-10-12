import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importando Firebase
import appFirebase from './credenciales';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const auth = getAuth(appFirebase);

// Importando componentes
import Login from './components/Login';
import Home from './components/Home';
import Notas from './components/Notas';
import Perfil from './components/Perfil';
import Navbar from './components/NavBar';
import Settings from './components/Configuraciones';
import { UserProvider } from './UserContext';

import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);
      } else {
        setUsuario(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserProvider> {/* Envuelve LA aplicación en el UserProvider */}
      <Router>
        <div>
          {usuario && <Navbar />} {/* Mostrar la barra de navegación solo si el usuario está autenticado */}
          <Routes>
            <Route path="/" element={usuario ? <Home correoUsuario={usuario.email} /> : <Login />} />
            <Route path="/notas" element={usuario ? <Notas /> : <Login />} />
            <Route path="/perfil" element={usuario ? <Perfil /> : <Login />} />
            <Route path="/configuraciones" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
