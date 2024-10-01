import React, { useContext, useState } from 'react';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
} from '@mui/material';

import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import conversationService from '../services/ConversationService';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { AppContext } from '../contexts/AppContext';

function MemberCard({ data, admin }) {
    const { user } = useContext(AppContext);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const { id } = useParams();

    const [openRemoveMemberPopUp, setOpenRemoveMemberPopUp] = useState(false);

    const handleRemoveMember = async () => {
        await conversationService.removeMember({
            token: cookies.token,
            conversationId: id,
            memberId: data.id,
        });
        setOpenRemoveMemberPopUp(false);
    };

    return (
        <div className="flex border-b-[1px] border-b-[#b6b0b05c] p-1">
            <div className="w-[30%] flex items-center justify-center">
                <Avatar
                    className="mr-2"
                    sx={{
                        width: '54px',
                        height: '54px',
                    }}
                    src={data.avatar || ''}
                ></Avatar>
            </div>
            <p className="w-[80%] flex flex-col justify-around truncate text-[#65637a]">
                {data.name}
                {data.id === user.id ? ' (me)' : ''}
            </p>
            <div className="h-[58px] w-[58px]">
                {admin && user.id !== data.id && (
                    <IconButton
                        color="error"
                        sx={{
                            height: '54px',
                            width: '54px',
                        }}
                        onClick={() => setOpenRemoveMemberPopUp(true)}
                    >
                        <PersonRemoveIcon />
                    </IconButton>
                )}
            </div>
            <Dialog
                open={openRemoveMemberPopUp}
                onClose={() => setOpenRemoveMemberPopUp(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Do you want to remove member ${data.name} from group ?`}
                </DialogTitle>

                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => setOpenRemoveMemberPopUp(false)}
                    >
                        No
                    </Button>
                    <Button color="error" onClick={handleRemoveMember}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MemberCard;
