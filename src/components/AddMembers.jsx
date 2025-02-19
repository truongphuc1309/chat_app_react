import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import conversationService from '../services/ConversationService';
import userService from '../services/UserService';
import CircularProgress from '@mui/material/CircularProgress';
import { useConversationContext } from '../contexts/ConversationContext';
import { data } from 'autoprefixer';

function AddMembers({ members, open, close }) {
    const { id } = useParams();
    const [memberIds, setMemberIds] = useState([]);
    const { user, accessToken, socket } = useAppContext();
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);

    useEffect(() => {
        setMemberIds(members.map((e) => e.id));
    }, []);

    const getSearchData = async (value) => {
        const result = await userService.search({
            token: accessToken,
            key: value,
        });
        if (result.success) {
            const list = result.metaData.filter(
                (e) =>
                    e.id !== user.id &&
                    !selectedMemberIds.includes(e.id) &&
                    !memberIds.includes(e.id)
            );
            setOptions(list);
        }
    };

    const handleChangeValue = (e, value) => {
        const ids = value.map((e) => e.id);
        setSelectedMemberIds(ids);
    };

    const handleSearch = async (e) => {
        if (e.target.value !== '') {
            await getSearchData(e.target.value);
        } else {
            setOptions([]);
        }
    };

    const handleSubmit = async (e) => {
        if (selectedMemberIds.length > 0) {
            setLoading(true);
            const promises = selectedMemberIds.map(
                async (e) =>
                    await conversationService.addMember({
                        token: accessToken,
                        conversationId: id,
                        userId: e,
                    })
            );
            let result = await Promise.all(promises);
            result = result[0];
            if (result.success) {
                socket.send(
                    '/app/conversation/change-data',
                    {},
                    JSON.stringify(result.metaData)
                );

                socket.send(
                    '/app/conversation',
                    {},
                    JSON.stringify(result.metaData)
                );
            }

            setLoading(false);
            close();
        }
    };

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                '& .MuiPaper-root': {
                    minWidth: '600px',
                },
            }}
        >
            <DialogTitle
                id="alert-dialog-title"
                className="text-center text-[var(--primary)]"
            >
                Add members
            </DialogTitle>
            <DialogContent>
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={options}
                    getOptionLabel={(option) => option.name}
                    renderOption={renderOption}
                    isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                    }
                    renderInput={(params) => (
                        <TextField
                            sx={{
                                marginTop: '20px',
                            }}
                            {...params}
                            label="Select Members"
                            color="primary"
                        />
                    )}
                    onChange={handleChangeValue}
                    onInputChange={handleSearch}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={(e) => close()}
                >
                    Close
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {loading && (
                        <CircularProgress
                            color="inherit"
                            size={'2rem'}
                            className="mr-2"
                        />
                    )}
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const renderOption = (props, option) => {
    const { key, ...optionProps } = props;
    return (
        <Box component="li" {...optionProps} key={key}>
            <div className="w-[30%] flex items-center justify-center">
                <Avatar
                    className="mr-2"
                    sx={{ width: '60px', height: '60px' }}
                    src={option.avatar || ''}
                ></Avatar>
            </div>
            <p className="w-[80%] flex flex-col justify-around truncate text-[var(--primary)]">
                {option.name}
            </p>
        </Box>
    );
};

export default AddMembers;
