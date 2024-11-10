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

function RenameGroup({ open, close }) {
    const { accessToken } = useAppContext();
    const { id } = useParams();
    const [input, setInput] = useState('');

    const handleSubmit = async () => {
        if (input.trim().length > 0) {
            const result = await conversationService.updateName({
                token: accessToken,
                id,
                name: input,
            });

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
            // onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className="text-center">
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
                <Button color="secondary" onClick={() => close()}>
                    Close
                </Button>
                <Button color="success" onClick={handleSubmit}>
                    Rename
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RenameGroup;
