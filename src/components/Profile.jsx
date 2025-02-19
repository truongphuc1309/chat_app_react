import React, { useEffect, useRef, useState } from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Badge, Button, IconButton, TextField } from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import userService from '../services/UserService';
import ChangeUserAvatar from './ChangeUserAvatar';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const { user, profile, accessToken } = useAppContext();
    const { setOpenProfile } = profile;

    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState('');

    const [edit, setEdit] = useState(false);
    const [update, setUpdate] = useState(false);

    const oldName = useRef();
    const [openChangeAvtPopUp, setOpenChangeAvtPopUp] = useState(false);

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setName(user.name);
            setAvatar(user.avatar);
        }
    }, [user]);

    const handleUpdateName = async (e) => {
        const result = await userService.updateName({
            token: accessToken,
            name,
        });

        if (result.success) {
            setUpdate(false);
            setEdit(false);
            setName(result.metaData.name);
        }
    };

    return (
        <div className="absolute top-0 left-0 bottom-0 w-[100%] p-[14px] bg-transparent z-[9999]">
            <div className="relative bg-[var(--secondary)] w-[100%] h-[100%] flex flex-col items-center p-[32px_20px] rounded-2xl">
                <IconButton
                    className="w-[40px] h-[40px] top-[32px] left-[20px]"
                    sx={{
                        position: 'absolute !important',
                        height: '40px',
                        width: '40px',
                        '&.MuiIconButton-root': {
                            backgroundColor: 'var(--primary)',
                        },
                    }}
                    onClick={(e) => {
                        setOpenProfile(false);
                    }}
                >
                    <ChevronLeftIcon
                        className="text-[#aaa4d5]"
                        fontSize="large"
                    />
                </IconButton>
                <h1 className="text-2xl text-white text-center mt-1 font-semibold">
                    Profile
                </h1>
                <Badge
                    className="mt-8 cursor-pointer"
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <div
                            className="bg-white p-2 rounded-full"
                            onClick={(e) => setOpenChangeAvtPopUp(true)}
                        >
                            <EditIcon />
                        </div>
                    }
                >
                    <Avatar
                        sx={{
                            height: '200px',
                            width: '200px',
                        }}
                        src={avatar || ''}
                    ></Avatar>
                </Badge>
                <div className="w-[100%] m-10">
                    <p className="text-[#aaa4d5] font-semibold mb-2">
                        Your email
                    </p>
                    <div>
                        <p className="text-[var(--purple-light)]">{email}</p>
                    </div>
                    <p className="text-[#aaa4d5] font-semibold mb-2 mt-4">
                        Your name
                    </p>
                    <div className="flex justify-between items-center">
                        {!edit && (
                            <p className="p-[4px_0_4px] text-[var(--purple-light)]">
                                {name}
                            </p>
                        )}
                        {edit && (
                            <TextField
                                id="outlined-required"
                                defaultValue={name}
                                color="secondary"
                                variant="standard"
                                className="flex-1"
                                onChange={(e) => {
                                    if (e.target.value === oldName.current)
                                        setUpdate(false);
                                    else setUpdate(true);
                                    setName(e.target.value);
                                }}
                            />
                        )}

                        {!update && (
                            <IconButton
                                sx={{
                                    height: '50px',
                                    width: '50px',
                                }}
                                onClick={(e) => {
                                    setEdit(!edit);
                                }}
                            >
                                <EditIcon
                                    sx={{
                                        '&': {
                                            marginRight: '0',
                                        },
                                    }}
                                    className="mr-3 cursor-pointer text-[var(--orange)]"
                                />
                            </IconButton>
                        )}
                        {update && (
                            <IconButton
                                color="success"
                                sx={{
                                    height: '50px',
                                    width: '50px',
                                }}
                                onClick={handleUpdateName}
                            >
                                <DoneOutlineIcon
                                    sx={{
                                        '&': {
                                            marginRight: '0',
                                        },
                                    }}
                                    className="mr-3 cursor-pointer"
                                />
                            </IconButton>
                        )}
                    </div>
                </div>

                <Button
                    variant="contained"
                    onClick={() => navigate('/change-password')}
                >
                    Change your password
                </Button>
                <ChangeUserAvatar
                    open={openChangeAvtPopUp}
                    setStatus={setOpenChangeAvtPopUp}
                    reloadAvt={setAvatar}
                    haveAvt={avatar !== null}
                />
            </div>
        </div>
    );
}

export default Profile;
