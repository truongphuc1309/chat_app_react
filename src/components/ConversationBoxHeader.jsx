import { Button } from '@mui/material';
import React, { memo, useEffect, useRef } from 'react';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useConversationContext } from '../contexts/ConversationContext';
import ConversationAvatar from './common/ConversationAvatar';
import { useAppContext } from '../contexts/AppContext';
import { useState } from 'react';
import { formatLocalTime } from '../utils/formatTime';

function ConversationBoxHeader({ setOpenGroupInfo, setOpenConversationBox }) {
    const innerWidth = window.innerWidth;

    const { user, socket } = useAppContext();
    const { data } = useConversationContext();
    const [name, setName] = useState();
    const [online, setOnline] = useState();
    const [lastSeen, setLastSeen] = useState();
    const partnerRef = useRef();
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        if (!data?.group) {
            partnerRef.current = data?.members.find((e) => {
                return e.id !== user.id;
            });
            if (partnerRef.current) {
                setSubscription(
                    socket.subscribe(
                        `/topic/user/${partnerRef.current.id}`,
                        (mess) => {
                            const message = JSON.parse(mess.body);
                            console.log('::Parter::', message);
                            setName(message.name);
                            setOnline(message.online);
                            setLastSeen(message.updatedAt);
                        }
                    )
                );
                setName(partnerRef.current.name);
                setOnline(partnerRef.current.online);
                setLastSeen(partnerRef.current.updatedAt);
            }
        }

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [data]);

    return (
        <div
            className="h-[86px] bg-[var(--primary)] flex items-center p-[0_40px] cursor-pointer"
            onClick={() => setOpenGroupInfo(true)}
        >
            {innerWidth < 768 && (
                <Button
                    color="secondary"
                    sx={{
                        color: '#fff',
                        padding: '20px',
                        marginLeft: '-20px',
                        marginRight: '20px',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenConversationBox(false);
                    }}
                >
                    <KeyboardArrowLeftIcon
                        sx={{
                            height: '3rem',
                            width: '3rem',
                        }}
                    />
                </Button>
            )}
            <div>
                <ConversationAvatar data={data} />
            </div>
            {data?.group && (
                <div className="ml-4">
                    <h1 className="text-white text-2xl">{data?.name}</h1>
                    <p className="text-[#d6d6d6] text-sm">
                        {data?.members.length}
                        {data?.members.length > 1 ? ' members' : ' member'}
                    </p>
                </div>
            )}

            {!data?.group && (
                <div className="ml-4">
                    <h1 className="text-white text-2xl">{name}</h1>
                    <p className="text-[#d6d6d6] text-sm">
                        {online
                            ? 'Online'
                            : `Last seen at ${formatLocalTime(lastSeen)}`}
                    </p>
                </div>
            )}
        </div>
    );
}

export default memo(ConversationBoxHeader);
