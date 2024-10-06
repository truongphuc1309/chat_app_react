import React, { useContext, useEffect, useRef, useState } from 'react';
import ConversationCard from './ConversationCard';
import SideBarHeader from './SideBarHeader';
import conversationService from '../services/ConversationService';
import { useCookies } from 'react-cookie';
import CircularProgress from '@mui/material/CircularProgress';
import { Outlet, useParams } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import WebSocketService from '../services/WebSocketService';
import { ConversationContext } from '../contexts/ConversationContext';

function Contacts() {
    const { user } = useContext(AppContext);
    const [cookies, setCookie] = useCookies(['user']);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [data, setData] = useState([]);
    const { conversation } = useContext(ConversationContext);
    const { openConversationBox, setOpenConversationBox } = conversation;
    const wsRef = useRef(null);
    const innerWidth = window.innerWidth;

    const getConversations = async () => {
        if (innerWidth < 768) setOpenConversationBox(false);

        const result = await conversationService.getAllConversationsOfUser({
            token: cookies.token,
            page: page + 1,
            limit: 10,
        });

        if (result.success) {
            setTotalPages(result.metaData.totalPages);
            setData((pre) =>
                removeDuplicate([...pre, ...result.metaData.content])
            );
            setLoading(false);
            setPage((pre) => pre + 1);
        }
    };

    useEffect(() => {
        getConversations();
        if (wsRef.current) {
            wsRef.current.disconnect();
            wsRef.current.unsubscribe();
        }

        wsRef.current = new WebSocketService({
            broker: `/topic/conversation/list/${user.id}`,
            onReceived: (mess) => {
                const messageData = JSON.parse(mess.body);
                setData((prev) => {
                    const temp = prev.filter((e) => e.id !== messageData.id);

                    return [messageData, ...temp];
                });
            },
        });
        wsRef.current.connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
                wsRef.current.unsubscribe();
            }
        };
    }, []);

    const removeDuplicate = (list) => {
        const result = list.filter(
            (data, index, arr) =>
                arr.findIndex((obj) => obj.id === data.id) === index
        );
        return result;
    };

    const handleScroll = (e) => {
        const scrollHeight = e.target.scrollHeight;
        const currentHeight = e.target.scrollTop + e.target.clientHeight;
        if (currentHeight >= scrollHeight && !loading && page < totalPages) {
            setLoading(true);
            getConversations();
        }
    };

    return (
        <div className="flex">
            <div
                className={`bg-[var(--secondary)] lg:w-[30%] md:w-[340px] md:block ${
                    !openConversationBox ? 'block' : 'hidden'
                } w-[100%] h-screen p-2 flex flex-col`}
            >
                <SideBarHeader />
                <div
                    className="overflow-scroll flex flex-col no-scrollbar"
                    onScroll={handleScroll}
                >
                    {data.map((e, index) => (
                        <ConversationCard data={e} key={index} />
                    ))}
                    {loading && (
                        <CircularProgress
                            color="secondary"
                            className="m-[20px_auto]"
                        />
                    )}
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default Contacts;
