import React, { useEffect, useState } from 'react';
import {
    FormControl,
    IconButton,
    InputAdornment,
    List,
    ListItemButton,
    TextField,
} from '@mui/material';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import ImageIcon from '@mui/icons-material/Image';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SendIcon from '@mui/icons-material/Send';
import messageService from '../services/MessageService';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArticleIcon from '@mui/icons-material/Article';
import SendImgVideoMessage from './SendImgVideoMessage';
import SendFileMessage from './SendFileMessage';
import MicIcon from '@mui/icons-material/Mic';
import AudioMessageRecorder from './AudioMessageRecorder';

function SendMessage({ setMessages, ws, setLoadingFiles }) {
    const textFieldStyle = {
        '&.MuiTextField-root': {
            backGroundColor: '#000',
            '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
            },

            '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
                borderWidth: '3px',
            },

            '.MuiInputBase-root': {
                backgroundColor: '#ccc7f3cc',
            },

            '.MuiInputBase-input': {
                fontSize: '1.2rem',
            },
        },
    };

    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const { id } = useParams();
    const [openUploadOptions, setOpenUploadOptions] = useState(false);
    const [iconList, setIconList] = useState(false);
    const [openRecorder, setOpenRecorder] = useState(false);
    const [input, setInput] = useState('');

    const handleSendMessage = async () => {
        if (input.length > 0) {
            const result = await messageService.sendMessage({
                token: cookies.token,
                conversationId: id,
                content: input,
            });

            if (result.success) {
                ws.send({
                    destination: `/app/message`,
                    message: result.metaData,
                });
            }
        }
    };

    return (
        <div className="flex p-[10px_10px] relative mt-2">
            <div className="w-[64px] flex items-center justify-center">
                <IconButton
                    type="submit"
                    onClick={() => {
                        setOpenRecorder(true);
                    }}
                    // size="4rem"
                >
                    <MicIcon className="text-[var(--primary)] !text-[2rem]" />
                </IconButton>
            </div>
            <FormControl className="flex-1 relative">
                <TextField
                    autoComplete="off"
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
                                    onClick={(e) =>
                                        setOpenUploadOptions(!openUploadOptions)
                                    }
                                >
                                    <AttachFileIcon className="text-[var(--primary)] !text-[1.8rem]" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {openUploadOptions && (
                    <div className="absolute bg-[var(--primary)] min-w-[160px] bottom-[100%] right-0 mb-[10px] rounded-xl text-white z-[99]">
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
                            theme="light"
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
                    // size="4rem"
                >
                    <SendIcon className="text-[var(--primary)] !text-[1.8rem]" />
                </IconButton>
            </div>
            {openRecorder && (
                <AudioMessageRecorder
                    setOpenRecorder={setOpenRecorder}
                    ws={ws}
                    setLoadingFiles={setLoadingFiles}
                />
            )}
            <SendImgVideoMessage ws={ws} setLoadingFiles={setLoadingFiles} />
            <SendFileMessage ws={ws} setLoadingFiles={setLoadingFiles} />
        </div>
    );
}

export default SendMessage;
