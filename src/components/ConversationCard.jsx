import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import messageService from '../services/MessageService';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ConversationContext } from '../contexts/ConversationContext';
import { formatTime } from '../utils/formatTime';
import ConversationAvatar from './common/ConversationAvatar';

function ConversationCard({ data }) {
    const { user, accessToken, socket, conversation } = useAppContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [isGroup, setIsGroup] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [total, setTotal] = useState(null);
    const [active, setActive] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const [time, setTime] = useState('');
    const { setOpenConversationBox } = conversation;
    const [subscription, setSubscription] = useState(null);

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
                        ['image', 'video', 'file', 'audio'].includes(
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

        setSubscription(
            socket.subscribe(`/topic/message/last/${data.id}`, (mess) =>
                getLastMessage()
            )
        );

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [data]);

    useEffect(() => {
        setActive(id === data.id ? true : false);
    }, [id, data]);

    return (
        <div
            className={`flex min-h-[100px] justify-between items-center p-[16px_10px] cursor-pointer border-b-2 ${
                active ? 'bg-[var(--primary)]' : ''
            }`}
            onClick={() => {
                navigate(`/c/${data.id}`);
                setOpenConversationBox(true);
            }}
        >
            <ConversationAvatar data={data} width={'30%'} />
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
        </div>
    );
}

export default ConversationCard;
