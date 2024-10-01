import React, { useState } from 'react';
import conversationService from '../services/ConversationService';

export const ConversationContext = createContext({});

function ConversationProvider({ children }) {
    const [data, setData] = useState({});

    const getData = async () => {
        const result = await conversationService.getConversationDetails({
            token: cookies.token,
            id,
        });

        if (result.success) {
            setData(result.metaData);
        }
    };

    return (
        <ConversationContext.Provider>{children}</ConversationContext.Provider>
    );
}

export default ConversationProvider;
