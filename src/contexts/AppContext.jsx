import React, { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import userService from '../services/UserService';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const wsUrl = 'http://localhost:8080/ws';
export const AppContext = createContext({});

function AppProvider({ children }) {
    const navigate = useNavigate();

    const [cookies] = useCookies(['user']);
    const accessToken = cookies.token;

    const [socket, setSocket] = useState(null);

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
        const ws = new SockJS(wsUrl);
        const stomp = Stomp.over(ws);
        stomp.connect(
            {},
            () => {
                console.log('Success connect to ws');
            },
            () => {
                console.log('Error connect to ws');
            }
        );
        setSocket(stomp);
        getProfile();

        return () => {
            stomp.disconnect();
        };
    }, []);

    const value = {
        user,
        accessToken,
        profile: { openProfile, setOpenProfile },
        socket,
    };

    return (
        <AppContext.Provider value={value}>
            {!loading && children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);
export default AppProvider;
