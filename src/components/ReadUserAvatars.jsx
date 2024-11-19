import { Avatar, AvatarGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useConversationContext } from '../contexts/ConversationContext';
import { useAppContext } from '../contexts/AppContext';

function ReadUserAvatars({ isYour, message }) {
    const { user, socket } = useAppContext();
    const { data } = useConversationContext();
    const [readUsers, setReadUsers] = useState([]);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        setReadUsers(data.members.filter((e) => e.lastRead >= message.seq));
        if (subscription) subscription.unsubscribe();

        setSubscription(
            socket.subscribe(`/topic/last-message/${message.id}`, (mess) => {
                const message = JSON.parse(mess.body);
                console.log(message);
                if (message.reader.id !== user.id)
                    setReadUsers((prev) => [...prev, message.reader]);
            })
        );

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [message]);

    return (
        <div
            className={`mt-[2px] flex items-center  ${
                isYour ? 'flex-row-reverse' : 'ml-[34px]'
            }`}
        >
            <AvatarGroup
                max={10}
                sx={{
                    '& .MuiAvatar-root': {
                        height: '16px',
                        width: '16px',
                        borderWidth: '1px',
                        fontSize: '0.6rem',
                        marginRight: '4px',
                    },
                }}
            >
                {readUsers.map((e) => {
                    if (e.id !== message.user.id && e.id !== user.id)
                        return <Avatar src={e.avatar || ''} />;
                })}
            </AvatarGroup>
        </div>
    );
}

export default ReadUserAvatars;
