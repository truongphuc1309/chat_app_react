import DownloadIcon from '@mui/icons-material/Download';
import {
    Avatar,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import conversationService from '../services/ConversationService';
import messageService from '../services/MessageService';
import { formatLocalTime } from '../utils/formatTime';
import ConversationBoxHeader from './ConversationBoxHeader';
import ConversationInfo from './ConversationInfo';
import LoadingFile from './LoadingFile';
import MessageCard from './MessageCard';
import SendMessage from './SendMessage';

function ConversationBox() {
    const { id } = useParams();
    const { user, accessToken, socket, conversation } = useAppContext();

    const [subscription, setSubscription] = useState(null);
    const [messages, setMessages] = useState([]);
    const pageRef = useRef(1);
    const totalPagesRef = useRef(0);
    const conversationIdRef = useRef('');
    const [openGroupInfo, setOpenGroupInfo] = useState(false);
    const [loading, setLoading] = useState(true);
    const { openConversationBox, setOpenConversationBox } = conversation;
    const [viewImg, setViewImg] = useState(null);
    const [loadingFiles, setLoadingFiles] = useState([]);

    useEffect(() => {
        getData();
        pageRef.current = 1;
        getMessages();

        if (id !== conversationIdRef.current && subscription) {
            subscription.unsubscribe();
        }
        setSubscription(
            socket.subscribe(
                `/topic/conversation/messages/${id}`,
                handleOnReceiveMessage
            )
        );

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [id]);

    const handleOnReceiveMessage = (mess) => {
        const message = JSON.parse(mess.body);
        const action = message.action;
        const data = message.data;
        if (action === 'SEND') {
            setMessages((prev) => [data, ...prev]);
        } else if (action === 'DELETE') {
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
            token: accessToken,
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

    const getData = async () => {
        const result = await conversationService.getConversationDetails({
            token: accessToken,
            id,
        });
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
                        <div className="relative border-b-[1px] border-b-[#ffffff41] w-[100%]  mt-6 mb-4">
                            <p className="absolute bottom-[-12px] bg-[var(--secondary)] right-[50%] translate-x-[50%] text-white text-center p-[0_10px]">
                                {formatLocalTime(tempTime)}
                            </p>
                        </div>
                    )}
                    <MessageCard
                        data={e}
                        key={e.id}
                        isYour={e.user.id === user.id}
                        presentAvt={presentAvt}
                        viewImg={setViewImg}
                        isLast={index === 0}
                    />
                    {index === arr.length - 1 && (
                        <div className="relative border-b-[1px] border-b-[#ffffff41] w-[100%]  mt-6 mb-4">
                            <p className="absolute bottom-[-12px] bg-[var(--secondary)] right-[50%] translate-x-[50%] text-white text-center p-[0_10px]">
                                {formatLocalTime(currentTimeMess)}
                            </p>
                        </div>
                    )}
                </>
            );
        });
    };

    return (
        <div
            className={`relative h-screen flex-1 ${
                openConversationBox ? 'flex' : 'flex'
            } flex-col lg:b bg-transparent p-[14px]`}
        >
            <ConversationBoxHeader
                setOpenGroupInfo={setOpenGroupInfo}
                setOpenConversationBox={setOpenConversationBox}
            />

            {openGroupInfo && <ConversationInfo close={closeGroupInfo} />}
            <div
                className="flex-1 flex flex-col-reverse p-[10px_20px] overflow-y-scroll overflow-x-hidden bg-[var(--secondary)] rounded-2xl mt-[14px]"
                onScroll={handleScroll}
            >
                {loadingFiles.map((e) => (
                    <LoadingFile data={e} />
                ))}
                {handleRenderMessage(messages)}
                {loading && (
                    <CircularProgress
                        color="secondary"
                        className="m-[20px_auto]"
                    />
                )}
            </div>

            <SendMessage
                setMessages={setMessages}
                setLoadingFiles={setLoadingFiles}
            />

            <Dialog open={viewImg}>
                <DialogTitle className="flex items-center">
                    <Avatar src={viewImg || ''} />
                    <p className="text-[var(--primary)] text-[1.4rem] ml-4">
                        {viewImg?.user.name}
                    </p>
                </DialogTitle>
                <DialogContent>
                    <img src={viewImg?.file.url} />
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{
                            width: '100%',
                            padding: '20px',
                        }}
                        color="secondary"
                        variant="outlined"
                        onClick={(e) => {
                            setViewImg(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            width: '100%',
                            padding: '20px',
                        }}
                        onClick={() => {}}
                        variant="contained"
                        color="secondary"
                    >
                        <a href={viewImg?.file.downloadUrl}>
                            Download
                            <DownloadIcon className="ml-2" />
                        </a>
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ConversationBox;
