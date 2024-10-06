import React, { createContext, useState } from 'react';

export const ConversationContext = createContext({});

function ConversationProvider({ children }) {
    const [openConversationBox, setOpenConversationBox] = useState(true);

    return (
        <ConversationContext.Provider
            value={{
                conversation: {
                    openConversationBox,
                    setOpenConversationBox,
                },
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
}

export default ConversationProvider;
