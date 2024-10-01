import React, { useEffect, useState } from 'react';
import {
    FormControl,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import messageService from '../services/MessageService';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';

function SendMessage({ setMessages, ws }) {
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
    // const { user } = useContext(AppContext);

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
        <div className="p-[20px_20px]">
            <FormControl className="w-[100%]">
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
                                <ImageIcon className="text-[var(--primary)]" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment
                                position="start"
                                className="cursor-pointer"
                            >
                                <IconButton
                                    type="submit"
                                    onClick={() => {
                                        handleSendMessage();
                                        setInput('');
                                    }}
                                >
                                    <SendIcon className="text-[var(--primary)]" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </FormControl>
        </div>
    );
}

export default SendMessage;
