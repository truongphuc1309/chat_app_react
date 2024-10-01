import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Autocomplete,
    TextField,
    Box,
    Avatar,
} from '@mui/material';
import React, { useState, useContext, useEffect, useRef } from 'react';
import Chip from '@mui/material/Chip';
import { useCookies } from 'react-cookie';

import userService from '../services/UserService';
import SearchResultCard from './SearchResultCard';
import { AppContext } from '../contexts/AppContext';
import conversationService from '../services/ConversationService';
import WebSocketService from '../services/WebSocketService';
import { useNavigate } from 'react-router-dom';

function GroupCreation({ handleOpenGroupCreation }) {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const { user } = useContext(AppContext);
    const [options, setOptions] = useState([]);
    const [memberIds, setMemberIds] = useState([]);
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const wsRef = useRef();

    useEffect(() => {
        if (wsRef.current) {
            wsRef.current.disconnect();
            wsRef.current.unsubscribe();
        }
        wsRef.current = new WebSocketService({});
        wsRef.current.connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
                wsRef.current.unsubscribe();
            }
        };
    }, []);

    const getSearchData = async (value) => {
        const result = await userService.search({
            token: cookies.token,
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
                token: cookies.token,
                name: name.trim(),
                memberIds,
            });

            if (result.success) {
                wsRef.current.send({
                    destination: `/app/conversation`,
                    message: result.metaData,
                });
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
            <DialogTitle id="alert-dialog-title" className="text-center">
                Create New Group
            </DialogTitle>
            <DialogContent>
                <TextField
                    className="w-[100%]"
                    id="outlined-basic"
                    label="Group's name"
                    variant="outlined"
                    color="secondary"
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
                            color="secondary"
                        />
                    )}
                    onChange={handleChangeValue}
                    onInputChange={handleSearch}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    onClick={() => {
                        handleOpenGroupCreation(false);
                    }}
                >
                    Close
                </Button>
                <Button color="success" onClick={handleSubmit}>
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
