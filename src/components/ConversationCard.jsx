import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import messageService from '../services/MessageService';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CircleIcon from '@mui/icons-material/Circle';
import { formatTime } from '../utils/formatTime';
import ConversationAvatar from './common/ConversationAvatar';

function ConversationCard({ data }) {
    const { user, accessToken, socket, conversation } = useAppContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [isGroup, setIsGroup] = useState(false);
    const [avatarInfor, setAvatarInfor] = useState(null);
    const [total, setTotal] = useState(null);
    const [active, setActive] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const [read, setRead] = useState(true);
    const [time, setTime] = useState('');
    const { setOpenConversationBox } = conversation;
    const [subscriptions, setSubscriptions] = useState([]);

    const getLastMessage = async () => {
        const result = await messageService.getLastMessageOfConversation({
            token: accessToken,
            conversationId: data.id,
        });
        if (result.success) {
            const message = result?.metaData;
            const updatedAt = message?.updatedAt;
            setTime(formatTime(updatedAt));

            if (result.metaData) {
                const me = data.members.find((e) => e.id === user.id);
                setRead(
                    me.lastRead >= message.seq ||
                        message.user.id === user.id ||
                        data.id === id
                );
                if (message.active) {
                    if (message.type === 'text')
                        setLastMessage(
                            `${
                                message.user.id === user.id
                                    ? `You`
                                    : `${message.user.name}`
                            }: ${message.content}`
                        );
                    else if (
                        ['image', 'video', 'file', 'audio', 'voice'].includes(
                            message.type
                        )
                    )
                        setLastMessage(
                            `${
                                message.user.id === user.id
                                    ? `You`
                                    : `${message.user.name}`
                            } sent a ${message.type}`
                        );
                } else
                    setLastMessage(
                        `${
                            message.user.id === user.id
                                ? `You`
                                : `${message.user.name}`
                        } unsent a ${message.type}`
                    );
            }
        } else {
            setLastMessage('');
            setTime('');
        }
    };

    const handleAvatarAndName = (data, user) => {
        if (!data.group) {
            const restMember = data.members.find((e) => e.id !== user.id);
            setName(restMember.name);
        } else {
            setName(data.name);
        }
        setAvatarInfor(data);
    };

    useEffect(() => {
        setIsGroup(data.group);
        setTotal(data.members.length);
        handleAvatarAndName(data, user);
        getLastMessage();

        setSubscriptions((prev) => [
            ...prev,
            socket.subscribe(`/topic/message/last/${data.id}`, (mess) =>
                getLastMessage()
            ),
        ]);

        setSubscriptions((prev) => [
            ...prev,
            socket.subscribe(`/topic/conversation/${data.id}`, (mess) => {
                const message = JSON.parse(mess.body);
                setTotal(message.members.length);
                handleAvatarAndName(message, user);
            }),
        ]);

        return () => {
            subscriptions.forEach((e) => {
                if (e) e.unsubscribe();
            });
            setSubscriptions([]);
        };
    }, [data]);

    useEffect(() => {
        setActive(id === data.id ? true : false);
    }, [id, data]);

    return (
        <div
            className={`flex min-h-[100px] justify-between items-center p-[16px_10px] cursor-pointer border-b-[0.5px] border-b-[#ffffff1f] rounded-2xl
                ${active ? 'bg-[var(--primary)]' : ''}`}
            onClick={() => {
                navigate(`/c/${data.id}`);
                setRead(true);
                setOpenConversationBox(true);
            }}
        >
            <ConversationAvatar data={avatarInfor} width={'30%'} />
            <div className="w-[80%] flex flex-col justify-around">
                <div className="flex items-center justify-between">
                    <h1
                        className={`truncate text-[1.1rem] font-bold w-[70%] text-[#fff]`}
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
            {!read && (
                <div>
                    <CircleIcon className="text-[var(--green)] !text-[1.2rem]" />
                </div>
            )}
        </div>
    );
}

export default ConversationCard;
