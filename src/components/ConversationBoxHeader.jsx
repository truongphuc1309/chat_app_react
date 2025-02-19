import { Button, IconButton } from '@mui/material';
import React, { memo, useEffect, useRef } from 'react';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useConversationContext } from '../contexts/ConversationContext';
import ConversationAvatar from './common/ConversationAvatar';
import { useAppContext } from '../contexts/AppContext';
import { useState } from 'react';
import { formatLocalTime } from '../utils/formatTime';
import { useNavigate } from 'react-router-dom';

function ConversationBoxHeader({ setOpenGroupInfo, setOpenConversationBox }) {
    const innerWidth = window.innerWidth;

    const navigate = useNavigate();
    const { user, socket } = useAppContext();
    const { data } = useConversationContext();
    const [name, setName] = useState();
    const [online, setOnline] = useState();
    const [lastSeen, setLastSeen] = useState();
    const partnerRef = useRef();
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        if (!data.group) {
            partnerRef.current = data?.members.find((e) => {
                return e.id !== user.id;
            });

            console.warn('Siuuuu', data);
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
            className="h-[86px] bg-[var(--secondary)] flex items-center p-[0_40px] cursor-pointer rounded-2xl"
            onClick={() => setOpenGroupInfo(true)}
        >
            {innerWidth < 768 && (
                <IconButton
                    color="secondary"
                    sx={{
                        color: '#fff',
                        padding: '20px',
                        marginLeft: '-20px',
                        marginRight: '40px',
                        height: '46px',
                        width: '46px',
                        '&.MuiIconButton-root': {
                            backgroundColor: 'var(--primary)',
                        },
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenConversationBox(false);
                        navigate('/c');
                    }}
                >
                    <KeyboardArrowLeftIcon className="!text-[3rem]" />
                </IconButton>
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
                    {online && (
                        <p className="text-[var(--orange)] text-sm">Online</p>
                    )}
                    {!online && (
                        <p className="text-[#8090af] text-sm">
                            {`Last seen at ${formatLocalTime(lastSeen)}`}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default memo(ConversationBoxHeader);
