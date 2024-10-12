import React, { useEffect, useState } from "react";
import appFirebase from "../credenciales";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const auth = getAuth(appFirebase);

const Home = () => {
    const [nombreUsuario, setNombreUsuario] = useState("");

    useEffect(() => {
        const db = getDatabase(appFirebase);
        const user = auth.currentUser;

        if (user) {
            const userRef = ref(db, 'users/' + user.uid);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                setNombreUsuario(data.nombre);
            });
        }
    }, []);

    return (
        <div className="home-container">
            <h2 className="text-center">Bienvenido, {nombreUsuario}</h2>
        </div>
    );
};

export default Home;
