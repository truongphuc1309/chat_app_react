import { Stomp } from '@stomp/stompjs';
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import UserService from '../services/UserService';

const wsUrl = 'http://localhost:8080/ws';
export const AppContext = createContext({});

function AppProvider({ children }) {
    const navigate = useNavigate();

    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const accessToken = cookies.token;

    const socketRef = useRef();

    const [openProfile, setOpenProfile] = useState(false);
    const [user, setUser] = useState({});
    const [openConversationBox, setOpenConversationBox] = useState(true);
    const [loading, setLoading] = useState(true);

    const getProfile = async () => {
        if (!accessToken) {
            navigate('/login');
            return;
        }

        const result = await UserService.getProfile(accessToken);
        if (result.success) {
            setUser(result.metaData);
            return;
        }
        removeCookie('token', { path: '/' });
        removeCookie('refresh_token', { path: '/' });
        navigate('/login');
    };

    const run = async () => {
        await getProfile();
        const ws = new SockJS(wsUrl);
        const stomp = Stomp.over(ws);
        if (cookies.token) {
            stomp.connect(
                {
                    Authorization: `Bearer ${cookies.token}`,
                },
                () => {
                    console.log('Success connect to ws');

                    socketRef.current = stomp;
                    setLoading(false);
                },
                () => {
                    console.log('Error connect to ws');
                }
            );
        }
    };

    useEffect(() => {
        run();

        return () => {
            socketRef.current.disconnect();
            console.log('Log out');
        };
    }, []);

    const value = {
        user,
        accessToken,
        profile: { openProfile, setOpenProfile },
        socket: socketRef.current,
        conversation: {
            openConversationBox,
            setOpenConversationBox,
        },
    };

    return (
        <AppContext.Provider value={value}>
            {!loading && socketRef.current && children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);
export default AppProvider;
