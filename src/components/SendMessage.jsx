import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import ArticleIcon from '@mui/icons-material/Article';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import {
    FormControl,
    IconButton,
    InputAdornment,
    List,
    ListItemButton,
    TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import useOutsideClick from '../hooks/useOutsideClick';
import messageService from '../services/MessageService';
import AudioMessageRecorder from './AudioMessageRecorder';
import SendFileMessage from './SendFileMessage';
import SendImgVideoMessage from './SendImgVideoMessage';

function SendMessage({ setLoadingFiles }) {
    const textFieldStyle = {
        '&.MuiTextField-root': {
            '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
            },

            '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
                borderWidth: '3px',
            },

            '.MuiInputBase-root': {
                backgroundColor: '#fff',
            },

            '.MuiInputBase-input': {
                fontSize: '1.2rem',
            },
        },
    };

    const { accessToken, socket } = useAppContext();
    const { id } = useParams();
    const [openUploadOptions, setOpenUploadOptions] = useState(false);
    const [iconList, setIconList] = useState(false);
    const [openRecorder, setOpenRecorder] = useState(false);
    const [input, setInput] = useState('');
    const uploadOptionsRef = useOutsideClick(() => setOpenUploadOptions(false));

    const handleSendMessage = async () => {
        if (input.length > 0) {
            const result = await messageService.sendMessage({
                token: accessToken,
                conversationId: id,
                content: input,
            });

            if (result.success) {
                socket.send(
                    '/app/message',
                    {},
                    JSON.stringify(result.metaData)
                );
            }
        }
    };

    return (
        <div className="flex p-[10px_10px] relative mt-2">
            <div className="w-[64px] flex items-center justify-center">
                <IconButton
                    type="submit"
                    sx={{
                        color: '#fff',
                        padding: '20px',
                        height: '46px',
                        width: '46px',
                        '&.MuiIconButton-root': {
                            backgroundColor: 'var(--orange)',
                        },
                    }}
                    onClick={() => {
                        setOpenRecorder(true);
                    }}
                >
                    <MicIcon className="text-white !text-[2rem]" />
                </IconButton>
            </div>
            <FormControl className="flex-1 relative">
                <TextField
                    autoComplete="off"
                    placeholder="Type a message"
                    className="rounded-sm"
                    size="normal"
                    variant="outlined"
                    value={input}
                    sx={textFieldStyle}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                            setInput('');
                        }
                    }}
                    InputProps={{
                        sx: {
                            borderRadius: '20px',
                        },

                        startAdornment: (
                            <InputAdornment
                                position="start"
                                className="cursor-pointer"
                            >
                                <IconButton
                                    onClick={(e) => {
                                        setTimeout(() => {
                                            setIconList(!iconList);
                                        }, 1);
                                    }}
                                >
                                    <SentimentSatisfiedAltIcon className="text-[var(--primary)] !text-[1.8rem]" />
                                </IconButton>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment
                                position="start"
                                className="cursor-pointer"
                            >
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        setOpenUploadOptions(
                                            !openUploadOptions
                                        );
                                    }}
                                    sx={{
                                        transform: 'rotate(20deg)',
                                    }}
                                >
                                    <AttachFileIcon className="text-[var(--primary)] !text-[1.8rem]" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {openUploadOptions && (
                    <div
                        ref={uploadOptionsRef}
                        className="absolute bg-[var(--primary)] min-w-[160px] bottom-[100%] right-0 mb-[10px] rounded-xl text-white z-[99]"
                    >
                        <List>
                            <ListItemButton
                                onClick={(e) => {
                                    document
                                        .getElementById('imgVideoInput')
                                        .click();
                                    setOpenUploadOptions(false);
                                }}
                            >
                                <ImageIcon className="mr-2" />
                                Image / Video
                            </ListItemButton>
                            <ListItemButton
                                onClick={(e) => {
                                    document
                                        .getElementById('fileInput')
                                        .click();
                                    setOpenUploadOptions(false);
                                }}
                            >
                                <ArticleIcon className="mr-2" />
                                File
                            </ListItemButton>
                        </List>
                    </div>
                )}
                {iconList && (
                    <div className="absolute bottom-[100%] mb-[10px]">
                        <Picker
                            data={data}
                            onEmojiSelect={(e) =>
                                setInput((pre) => pre + e.native)
                            }
                            theme="dark"
                            onClickOutside={(e) => {
                                if (iconList === true) setIconList(false);
                            }}
                        />
                    </div>
                )}
            </FormControl>
            <div className="w-[64px] flex items-center justify-center">
                <IconButton
                    type="submit"
                    onClick={() => {
                        handleSendMessage();
                        setInput('');
                    }}
                    sx={{
                        color: '#fff',
                        padding: '20px',
                        height: '46px',
                        width: '46px',
                        transform: 'rotate(-20deg)',
                        '&.MuiIconButton-root': {
                            backgroundColor: 'var(--green)',
                        },
                    }}
                >
                    <SendIcon className="text-white !text-[1.8rem]" />
                </IconButton>
            </div>
            {openRecorder && (
                <AudioMessageRecorder
                    setOpenRecorder={setOpenRecorder}
                    setLoadingFiles={setLoadingFiles}
                />
            )}
            <SendImgVideoMessage setLoadingFiles={setLoadingFiles} />
            <SendFileMessage setLoadingFiles={setLoadingFiles} />
        </div>
    );
}

export default SendMessage;
