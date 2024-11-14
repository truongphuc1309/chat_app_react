import React, { useEffect } from 'react';
import SideBar from '../components/SideBar';
import { useCookies } from 'react-cookie';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import AppProvider from '../contexts/AppContext';
import ConversationBox from '../components/ConversationBox';
import ConversationProvider from '../contexts/ConversationContext';

function Home() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const { id } = useParams();

    return (
        <AppProvider>
            <div className="bg-[url('https://t3.ftcdn.net/jpg/01/99/79/88/360_F_199798806_PAFfWGapie6Mk8igqKHbhIIa9LwQcvQr.jpg')] bg-repeat bg-center h-screen flex">
                <SideBar />
                {id && (
                    <ConversationProvider>
                        <ConversationBox />
                    </ConversationProvider>
                )}
            </div>
        </AppProvider>
    );
}

export default Home;
