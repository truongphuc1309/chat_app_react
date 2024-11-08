import React, { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import userService from '../services/UserService';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext({});

function AppProvider({ children }) {
    const navigate = useNavigate();

    const [cookies] = useCookies(['user']);
    const accessToken = cookies.token;

    const [openProfile, setOpenProfile] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    const getProfile = async () => {
        const result = await userService.getProfile(accessToken);
        if (result.success) {
            setUser(result.metaData);
            setLoading(false);
        } else navigate('/login');
    };

    useEffect(() => {
        getProfile();
    }, []);

    const value = {
        user,
        accessToken,
        profile: { openProfile, setOpenProfile },
    };

    return (
        <AppContext.Provider value={value}>
            {!loading && children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);
export default AppProvider;
