import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import conversationService from '../services/ConversationService';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { AppContext, useAppContext } from '../contexts/AppContext';
import WebSocketService from '../services/WebSocketService';

function SearchResultCard({ data, closeSearch }) {
    const { accessToken, socket } = useAppContext();
    const navigate = useNavigate();
    const [openCreatePopUp, setOpenCreatePopUp] = useState(false);
    const wsRef = useRef();

    const handleClick = async () => {
        const result = await conversationService.getSingleConversationByUser({
            token: accessToken,
            id: data.id,
        });

        if (result.success) {
            closeSearch();
            navigate(`/c/${result.metaData.id}`);
        } else setOpenCreatePopUp(true);
    };

    const handleCreate = async () => {
        const result = await conversationService.createSingleConversation({
            token: accessToken,
            memberIds: [data.id],
        });
        if (result.success) {
            this.stomp.send(
                `/app/conversation`,
                {},
                JSON.stringify(result.metaData)
            );

            closeSearch();
            navigate(`/c/${result.metaData.id}`);
        }
        setOpenCreatePopUp(false);
    };
    return (
        <div>
            <div
                className="flex min-h-[100px] justify-between p-[16px_10px] border-b-[0.5px] border-b-[#ffffff1f]  cursor-pointer"
                onClick={handleClick}
            >
                <div className="w-[30%] flex items-center justify-center">
                    <Avatar
                        className="mr-2"
                        sx={{ width: '60px', height: '60px' }}
                        src={data.avatar || ''}
                    ></Avatar>
                </div>
                <div className="w-[80%] flex flex-col justify-center">
                    <p className="truncate text-[#fff] text-[1.2rem]">
                        {data.name}
                    </p>
                    <p className="truncate text-[#a7a6a6] text-[0.8rem]">
                        {data.email}
                    </p>
                </div>
            </div>
            <Dialog
                open={openCreatePopUp}
                onClose={() => setOpenCreatePopUp(false)}
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
                    <h1>
                        <WarningAmberIcon />
                        This conversation unavailable
                    </h1>
                </DialogTitle>
                <DialogContent>
                    <p>Create new conversation</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        variant="outlined"
                        onClick={() => setOpenCreatePopUp(false)}
                    >
                        No
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleCreate}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SearchResultCard;
