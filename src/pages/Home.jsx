import React, { useEffect } from 'react';
import SideBar from '../components/SideBar';
import { useCookies } from 'react-cookie';
import { Outlet, useNavigate } from 'react-router-dom';
import AppProvider from '../contexts/AppContext';
import ConversationBox from '../components/ConversationBox';

function Home() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    useEffect(() => {
        if (cookies.token == null) navigate('/login');
        // else navigate('/c');
    }, []);

    return (
        <AppProvider>
            <div className="bg-[url('https://t3.ftcdn.net/jpg/01/99/79/88/360_F_199798806_PAFfWGapie6Mk8igqKHbhIIa9LwQcvQr.jpg')] bg-repeat bg-center h-screen">
                <SideBar />
            </div>
        </AppProvider>
    );
}

export default Home;
