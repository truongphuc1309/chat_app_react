import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import conversationService from '../services/ConversationService';
import { useAppContext } from '../contexts/AppContext';
import { useConversationContext } from '../contexts/ConversationContext';

function RenameGroup({ open, close }) {
    const { accessToken, socket } = useAppContext();
    const { data } = useConversationContext();
    const { id } = useParams();
    const [input, setInput] = useState('');

    const handleSubmit = async () => {
        if (input.trim().length > 0) {
            const result = await conversationService.updateName({
                token: accessToken,
                id,
                name: input,
            });

            if (result.success) {
                data.name = result.metaData.newName;
                socket.send(
                    '/app/conversation/change-data',
                    {},
                    JSON.stringify(data)
                );
            }

            close();
        }
    };

    return (
        <Dialog
            sx={{
                '.MuiPaper-root': {
                    width: '400px',
                },
            }}
            open={open}
            onClose={close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle
                id="alert-dialog-title"
                className="text-center text-[var(--primary)]"
            >
                Change group name
            </DialogTitle>
            <DialogContent>
                <TextField
                    color="success"
                    sx={{
                        marginTop: '20px',
                        width: '100%',
                    }}
                    label="New name"
                    variant="outlined"
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => close()}
                >
                    Close
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Rename
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RenameGroup;
