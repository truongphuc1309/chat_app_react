import { Avatar, AvatarGroup } from '@mui/material';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Link, useParams } from 'react-router-dom';
import messageService from '../services/MessageService';
import { useCookies } from 'react-cookie';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { formatTime } from '../utils/formatTime';
import WebSocketService from '../services/WebSocketService';

function ConversationCard({ data }) {
    const { user } = useContext(AppContext);
    const [cookies, setCookie] = useCookies(['user']);
    const { id } = useParams();
    const [name, setName] = useState('');
    const [isGroup, setIsGroup] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [total, setTotal] = useState(null);
    const [active, setActive] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const [time, setTime] = useState('');
    const wsRef = useRef();

    const getLastMessage = async () => {
        const result = await messageService.getLastMessageOfConversation({
            token: cookies.token,
            conversationId: data.id,
        });
        if (result.success) {
            const message = result.metaData;
            const updatedAt = message.updatedAt;
            console.log(updatedAt);
            setTime(formatTime(updatedAt));
            if (message.active) setLastMessage(message.content);
            else {
                if (message.user.id === user.id)
                    setLastMessage('You unsent a message');
                else setLastMessage(`${message.user.name} unsent a message`);
            }
        }
    };

    const handleAvatarAndName = (data, user) => {
        if (!data.group) {
            const restMember = data.members.find((e) => e.id !== user.id);
            setAvatar(restMember.avatar);
            setName(restMember.name);
        } else {
            setName(data.name);
            setAvatar(data.avatar);
        }
    };

    useEffect(() => {
        setIsGroup(data.group);
        setTotal(data.members.length);
        handleAvatarAndName(data, user);
        getLastMessage();

        if (wsRef.current) {
            wsRef.current.disconnect();
            wsRef.current.unsubscribe();
        }
        wsRef.current = new WebSocketService({
            broker: `/topic/message/last/${data.id}`,
            onReceived: (mess) => getLastMessage(),
        });
        wsRef.current.connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
                wsRef.current.unsubscribe();
            }
        };
    }, [data]);

    useEffect(() => {
        setActive(id === data.id ? true : false);
    }, [id, data]);

    return (
        <Link
            to={`/c/${data.id}`}
            className={`flex min-h-[100px] justify-between items-center p-[16px_10px] cursor-pointer border-b-2 ${
                active ? 'bg-[var(--primary)]' : ''
            }`}
        >
            <div className="w-[30%] flex items-center justify-center">
                {isGroup && !avatar && (
                    <AvatarGroup
                        total={total}
                        max={3}
                        variant="circular"
                        className="flex items-center mr-2"
                        sx={{
                            '& .MuiAvatar-root': {
                                height: '34px',
                                width: '34px',
                            },
                        }}
                    >
                        {data.members[0] && (
                            <Avatar
                                sx={{ bgcolor: 'var(--primary)' }}
                                src={data.members[0].avatar || ''}
                            ></Avatar>
                        )}
                        {data.members[1] && (
                            <Avatar
                                sx={{ bgcolor: 'var(--primary)' }}
                                src={data.members[1].avatar || ''}
                            ></Avatar>
                        )}
                    </AvatarGroup>
                )}
                {(!isGroup || avatar) && (
                    <Avatar
                        className="mr-2"
                        sx={{ width: '68px', height: '68px' }}
                        src={avatar || ''}
                    ></Avatar>
                )}
            </div>
            <div className="w-[80%] flex flex-col justify-around">
                <div className="flex items-center justify-between">
                    <h1
                        className={`truncate text-[1.1rem] font-bold w-[70%] ${
                            active ? 'text-[#fff]' : 'text-[var(--primary)]'
                        }`}
                    >
                        {name}
                    </h1>
                </div>
                {lastMessage && (
                    <div className="flex items-center ">
                        <p
                            className={`text-sm  ${
                                active ? 'text-[#fff]' : 'text-[#aaa4d5]'
                            } truncate max-w-[50%]`}
                        >
                            {lastMessage}
                        </p>
                        <FiberManualRecordIcon
                            fontSize="small"
                            className={`${
                                active ? 'text-[#fff]' : 'text-[#aaa4d5]'
                            } `}
                            sx={{
                                margin: '0 6px',
                                height: '8px',
                                width: '8px',
                            }}
                        />
                        <p
                            className={`text-[0.7rem]  ${
                                active ? 'text-[#fff]' : 'text-[#aaa4d5]'
                            }`}
                        >
                            {time}
                        </p>
                    </div>
                )}
            </div>
        </Link>
    );
}

export default ConversationCard;
