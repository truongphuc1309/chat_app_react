import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import conversationService from '../services/ConversationService';
import WebSocketService from '../services/WebSocketService';
import ConversationCard from './ConversationCard';
import SideBarHeader from './SideBarHeader';

function Contacts() {
    const { user, accessToken } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [data, setData] = useState([]);

    const wsRef = useRef(null);

    const getConversations = async () => {
        const result = await conversationService.getAllConversationsOfUser({
            token: accessToken,
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
                className={`bg-[var(--secondary)] w-[100%] h-screen p-2 flex flex-col`}
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
            {/* <Outlet /> */}
        </div>
    );
}

export default Contacts;
