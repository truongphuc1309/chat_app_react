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
import React, { useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import conversationService from '../services/ConversationService';
import userService from '../services/UserService';

function GroupCreation({ handleOpenGroupCreation }) {
    const { user, accessToken, socket } = useContext(AppContext);
    const [options, setOptions] = useState([]);
    const [memberIds, setMemberIds] = useState([]);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const getSearchData = async (value) => {
        const result = await userService.search({
            token: accessToken,
            key: value,
        });
        if (result.success) {
            const list = result.metaData.filter(
                (e) => e.id !== user.id && !memberIds.includes(e.id)
            );
            setOptions(list);
        }
    };

    const handleChangeValue = (e, value) => {
        const ids = value.map((e) => e.id);
        setMemberIds(ids);
    };

    const handleSearch = async (e) => {
        if (e.target.value !== '') {
            await getSearchData(e.target.value);
        } else {
            setOptions([]);
        }
    };

    const handleSubmit = async (e) => {
        if (memberIds.length >= 1 && name.trim().length >= 1) {
            const result = await conversationService.createGroup({
                token: accessToken,
                name: name.trim(),
                memberIds,
            });

            if (result.success) {
                socket.send(
                    '/app/conversation',
                    {},
                    JSON.stringify(result.metaData)
                );
                handleOpenGroupCreation(false);
                navigate(`/c/${result.metaData.id}`);
            }
        }
    };

    return (
        <Dialog
            open={true}
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
                color="primary"
            >
                Create New Group
            </DialogTitle>
            <DialogContent>
                <TextField
                    className="w-[100%]"
                    id="outlined-basic"
                    label="Group's name"
                    variant="outlined"
                    color="primary"
                    value={name}
                    sx={{
                        '&': {
                            margin: '20px 0',
                        },
                    }}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
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
                            {...params}
                            label="Select Members"
                            color="primary"
                        />
                    )}
                    onChange={handleChangeValue}
                    onInputChange={handleSearch}
                />
            </DialogContent>
            <DialogActions className="!p-[20px_24px]">
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                        handleOpenGroupCreation(false);
                    }}
                >
                    Close
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Create
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

export default GroupCreation;
