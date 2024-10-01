import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import userService from '../services/UserService';
import { useCookies } from 'react-cookie';

export const AppContext = createContext({});

function AppProvider({ children }) {
    const [cookies] = useCookies(['user']);
    const [render, setRender] = useState(false);

    const [user, setUser] = useState({});
    const getProfile = async () => {
        const result = await userService.getProfile(cookies.token);
        if (result.success) {
            setUser(result.metaData);
            setRender(true);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <AppContext.Provider value={{ user }}>
            {render && children}
        </AppContext.Provider>
    );
}

export default AppProvider;
