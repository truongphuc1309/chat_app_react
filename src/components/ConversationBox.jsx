import { Avatar, AvatarGroup, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import conversationService from '../services/ConversationService';
import { useCookies } from 'react-cookie';
import { AppContext } from '../contexts/AppContext';
import ConversationInfo from './ConversationInfo';
import SendMessage from './SendMessage';
import messageService from '../services/MessageService';
import MessageCard from './MessageCard';
import WebSocketService from '../services/WebSocketService';
import { formatLocalTime } from '../utils/formatTime';

function ConversationBox() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const { id } = useParams();
    const { user } = useContext(AppContext);

    const [data, setData] = useState(null);
    const [name, setName] = useState('');
    const [isGroup, setIsGroup] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [total, setTotal] = useState(null);
    const [email, setEmail] = useState('');
    const [admin, setAdmin] = useState(false);
    const [messages, setMessages] = useState([]);
    const pageRef = useRef(1);
    const totalPagesRef = useRef(0);
    const conversationIdRef = useRef('');
    const [openGroupInfo, setOpenGroupInfo] = useState(false);
    const [loading, setLoading] = useState(true);
    const wsRef = useRef(null);

    useEffect(() => {
        getData();
        pageRef.current = 1;
        getMessages();

        if (wsRef.current && id !== conversationIdRef.current) {
            wsRef.current.disconnect();
            wsRef.current.unsubscribe();
        }
        wsRef.current = new WebSocketService({
            broker: `/topic/conversation/${id}`,
            onReceived: handleOnReceiveMessage,
        });
        wsRef.current.connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
                wsRef.current.unsubscribe();
            }
        };
    }, [id]);

    const handleOnReceiveMessage = (mess) => {
        const message = JSON.parse(mess.body);
        const action = message.action;
        const data = message.data;
        if (action === 'SEND') {
            setMessages((prev) => [data, ...prev]);
        } else if (action === 'DELETE') {
            const temp = messages.map((e) => {
                return e;
            });
            setMessages((prev) =>
                prev.map((e) => {
                    if (e.id === data.id) return data;
                    else return e;
                })
            );
        }
    };

    const getMessages = async () => {
        const result = await messageService.getAllMessagesOfConversation({
            token: cookies.token,
            conversationId: id,
            page: pageRef.current,
            limit: 20,
        });

        if (result.success) {
            totalPagesRef.current = result.metaData.totalPages;

            if (id !== conversationIdRef.current) {
                setMessages(result.metaData.content);
                conversationIdRef.current = id;
            } else if (id === conversationIdRef.current) {
                console.log('call api');
                setMessages((prev) => [...prev, ...result.metaData.content]);
            }

            setLoading(false);
        }
    };

    const handleScroll = (e) => {
        const scrollHeight = e.target.scrollHeight;
        const currentHeight =
            Math.abs(e.target.scrollTop - e.target.clientHeight) + 2;
        if (
            currentHeight >= scrollHeight &&
            pageRef.current < totalPagesRef.current
        ) {
            pageRef.current++;
            getMessages();
            setLoading(true);
        }
    };

    const handleAvatarAndName = (data, user) => {
        if (!data.group) {
            const restMember = data.members.find((e) => e?.id !== user?.id);
            setAvatar(restMember.avatar);
            setName(restMember.name);
            setEmail(restMember.email);
        } else {
            setName(data.name);
            setAvatar(data.avatar);
        }
    };

    const getData = async () => {
        const result = await conversationService.getConversationDetails({
            token: cookies.token,
            id,
        });

        if (result.success) {
            setData(result.metaData);
            setIsGroup(result.metaData.group);
            setTotal(result.metaData.members.length);
            handleAvatarAndName(result.metaData, user);
            setAdmin(result.metaData.createdBy.id === user.id);
        }
    };

    const closeGroupInfo = () => {
        setOpenGroupInfo(false);
    };

    const uidOfPreMessRef = useRef('');
    const preTimeRef = useRef();

    const handleRenderMessage = (messages) => {
        uidOfPreMessRef.current = '';
        preTimeRef.current = null;
        return messages.map((e, index, arr) => {
            const temp = `${uidOfPreMessRef.current}`;
            let presentAvt = e.user.id !== temp;
            uidOfPreMessRef.current = e.user.id;

            let presentTime = false;
            const currentTimeMess = new Date(e.createdAt);
            const tempTime = `${preTimeRef.current}`;

            if (preTimeRef.current) {
                if (
                    (preTimeRef.current.getTime() - currentTimeMess.getTime()) /
                        1000 >
                    600
                ) {
                    presentTime = true;
                    presentAvt = true;
                }
            }
            preTimeRef.current = currentTimeMess;

            return (
                <>
                    {presentTime && (
                        <p className="text-center mt-6">
                            {formatLocalTime(tempTime)}
                        </p>
                    )}
                    <MessageCard
                        ws={wsRef.current}
                        data={e}
                        key={index}
                        isYour={e.user.id === user.id}
                        presentAvt={presentAvt}
                    />
                    {index === arr.length - 1 && (
                        <p className="text-center mt-6">
                            {formatLocalTime(currentTimeMess)}
                        </p>
                    )}
                </>
            );
        });
    };

    return (
        <div className="relative h-screen flex-1 flex flex-col bg-[#ccc7f387]">
            <div
                className="h-[86px] bg-[var(--primary)] flex items-center p-[0_40px] cursor-pointer"
                onClick={() => setOpenGroupInfo(true)}
            >
                <div className="w-min-[120px]">
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
                            sx={{ width: '60px', height: '60px' }}
                            src={avatar || ''}
                        ></Avatar>
                    )}
                </div>
                <h1 className="text-white text-2xl ml-4">{name}</h1>
            </div>
            <div
                className="flex-1 flex  flex-col-reverse p-[0_20px] overflow-y-scroll overflow-x-hidden no-scrollbar"
                onScroll={handleScroll}
            >
                {handleRenderMessage(messages)}
                {loading && (
                    <CircularProgress
                        color="secondary"
                        className="m-[20px_auto]"
                    />
                )}
            </div>
            <SendMessage setMessages={setMessages} ws={wsRef.current} />

            {openGroupInfo && (
                <ConversationInfo
                    data={{
                        isGroup,
                        avatar,
                        name,
                        email,
                        total,
                        admin,
                        members: data?.members,
                    }}
                    setAvatar={setAvatar}
                    close={closeGroupInfo}
                />
            )}
        </div>
    );
}

export default ConversationBox;
