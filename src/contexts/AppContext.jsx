import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import userService from '../services/UserService';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext({});

function AppProvider({ children }) {
    const [cookies] = useCookies(['user']);
    const [render, setRender] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const getProfile = async () => {
        const result = await userService.getProfile(cookies.token);
        if (result.success) {
            setUser(result.metaData);
            setRender(true);
        } else navigate('/login');
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <AppContext.Provider
            value={{ user, profile: { openProfile, setOpenProfile } }}
        >
            {render && children}
        </AppContext.Provider>
    );
}

export default AppProvider;
