import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ConversationService from '../services/ConversationService';
import { useAppContext } from './AppContext';

export const ConversationContext = createContext({});

function ConversationProvider({ children }) {
    const { accessToken, socket } = useAppContext();
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    const getConversationInfo = async () => {
        if (id) {
            setLoading(true);
            const result = await ConversationService.getConversationDetails({
                id,
                token: accessToken,
            });
            if (result.success) setData(result.metaData);
            setLoading(false);
        }
    };

    useEffect(() => {
        getConversationInfo();

        if (subscription) subscription.unsubscribe();
        setSubscription(
            socket.subscribe(`/topic/conversation/${id}`, (mess) => {
                const message = JSON.parse(mess.body);
                setData(message);
            })
        );

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [id]);
    return (
        <ConversationContext.Provider
            value={{
                data,
            }}
        >
            {!loading && children}
        </ConversationContext.Provider>
    );
}

export const useConversationContext = () => useContext(ConversationContext);

export default ConversationProvider;
