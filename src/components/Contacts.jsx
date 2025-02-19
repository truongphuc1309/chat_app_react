import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import conversationService from '../services/ConversationService';
import ConversationCard from './ConversationCard';
import SideBarHeader from './SideBarHeader';

function Contacts() {
    const { user, accessToken, socket } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [data, setData] = useState([]);

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
        socket.subscribe(`/topic/conversation/list/${user.id}`, (mess) => {
            const messageData = JSON.parse(mess.body);
            console.log('::Message::', messageData);
            if (messageData.action === 'ADD')
                setData((prev) => {
                    const temp = prev.filter(
                        (e) => e.id !== messageData.data.id
                    );

                    return removeDuplicate([messageData.data, ...temp]);
                });
            else if (messageData.action === 'DELETE')
                setData((prev) => {
                    const temp = prev.filter(
                        (e) => e.id !== messageData.data.id
                    );
                    return removeDuplicate(temp);
                });
        });
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
        <div
            className="h-[calc(100%-60px)] bg-[var(--secondary)] overflow-y-scroll flex flex-col rounded-2xl p-[20px]"
            onScroll={handleScroll}
        >
            {data.map((e, index) => (
                <ConversationCard data={e} key={e.id} />
            ))}
            {loading && (
                <CircularProgress color="secondary" className="m-[20px_auto]" />
            )}
        </div>
    );
}

export default Contacts;
