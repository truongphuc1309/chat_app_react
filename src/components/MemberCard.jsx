import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
} from '@mui/material';
import React, { useState } from 'react';

import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import conversationService from '../services/ConversationService';
import SingleAvatar from './common/SingleAvatar';
import { useConversationContext } from '../contexts/ConversationContext';

function MemberCard({ data, admin }) {
    const { user, accessToken, socket } = useAppContext();
    const { id } = useParams();
    const { data: conversationData } = useConversationContext();

    const [openRemoveMemberPopUp, setOpenRemoveMemberPopUp] = useState(false);

    const handleRemoveMember = async () => {
        const result = await conversationService.removeMember({
            token: accessToken,
            conversationId: id,
            memberId: data.id,
        });

        if (result.success) {
            const members = conversationData.members;
            const newMembers = members.filter((e) => e.id !== data.id);
            const newData = conversationData;
            const removeData = conversationData;

            // update conversation data
            newData.members = newMembers;
            socket.send(
                '/app/conversation/change-data',
                {},
                JSON.stringify(newData)
            );

            // remove member from conversation
            removeData.members = [data];
            socket.send(
                '/app/conversation/delete',
                {},
                JSON.stringify(removeData)
            );
        }
        setOpenRemoveMemberPopUp(false);
    };

    return (
        <div className="flex border-b-[0.5px] border-b-[#b6b0b029] p-1">
            <div className="w-[30%] flex items-center justify-center">
                <SingleAvatar data={data} />
            </div>
            <p className="w-[80%] flex flex-col justify-around truncate text-white">
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
