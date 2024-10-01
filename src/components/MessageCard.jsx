import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import messageService from '../services/MessageService';
import { useCookies } from 'react-cookie';
import { formatLocalTime } from '../utils/formatTime';

function MessageCard({ data, isYour, ws, presentAvt }) {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const time = formatLocalTime(data.createdAt);
    const [isHover, setIsHover] = useState(false);
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);

    const handleDeleteMessage = async () => {
        const result = await messageService.deleteMessage({
            id: data.id,
            token: cookies.token,
        });

        if (result.success) {
            ws.send({
                destination: `/app/message/delete`,
                message: result.metaData,
            });
            setOpenDeletePopUp(false);
        }
    };

    return (
        <>
            <div
                onMouseEnter={() => {
                    if (data.active) setIsHover(true);
                }}
                onMouseLeave={() => {
                    if (data.active) setIsHover(false);
                }}
            >
                {!isYour && (
                    <div className="mt-[2px] flex items-center">
                        {presentAvt && (
                            <Avatar
                                src={data.user.avatar || ''}
                                sx={{
                                    '&': {
                                        height: '32px',
                                        width: '32px',
                                    },
                                }}
                            />
                        )}
                        {data.active && (
                            <p
                                className={`bg-[#c0b9f2] max-w-[50%] p-[4px_10px] rounded-[0_20px_20px_20px] text-white break-words ${
                                    !presentAvt ? 'ml-[36px]' : 'ml-1'
                                }`}
                            >
                                {data.content}
                            </p>
                        )}

                        {!data.active && (
                            <p className="bg-[#dbd7f9] max-w-[50%] p-[4px_10px] rounded-[0_20px_20px_20px] text-[var(--primary)] border-[var(--primary)] border-[1px]">
                                Unset a message
                            </p>
                        )}
                        {isHover && (
                            <p className="text-[#828282] ml-2">{time}</p>
                        )}
                    </div>
                )}

                {isYour && (
                    <div className="mt-[2px] flex flex-row-reverse items-center">
                        {data.active && (
                            <p className="bg-[var(--primary)] max-w-[50%] p-[4px_10px] rounded-[20px_20px_0_20px] text-white break-words">
                                {data.content}
                            </p>
                        )}

                        {!data.active && (
                            <p className="bg-[#dbd7f9] max-w-[50%] p-[4px_10px] rounded-[20px_20px_0_20px] text-[var(--primary)] border-[var(--primary)] border-[1px]">
                                You unset a message
                            </p>
                        )}

                        {isHover && (
                            <div className="flex items-center mr-2">
                                <IconButton
                                    color="error"
                                    sx={{
                                        marginRight: '8px',
                                        height: '30px',
                                        width: '30px',
                                    }}
                                    onClick={() => setOpenDeletePopUp(true)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <p className="text-[#828282]">{time}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Dialog
                open={openDeletePopUp}
                onClose={() => setOpenDeletePopUp(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    '& .MuiPaper-root': {
                        minWidth: '400px',
                        padding: '10px 20px',
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    Delete this message?
                </DialogTitle>

                <DialogActions>
                    <Button
                        color="secondary"
                        variant="outlined"
                        onClick={() => setOpenDeletePopUp(false)}
                    >
                        No
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleDeleteMessage}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default MessageCard;
