import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [profileImage, setProfileImage] = useState('');

    return (
        <UserContext.Provider value={{ profileImage, setProfileImage }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
