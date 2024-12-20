import React, { useEffect, useRef, useState } from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Badge, Button, IconButton, TextField } from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import userService from '../services/UserService';
import ChangeUserAvatar from './ChangeUserAvatar';

function Profile() {
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
        <div className="absolute top-0 left-0 bottom-0 w-[100%] p-[16px_32px] flex flex-col items-center bg-[var(--third)]">
            <Button
                color="secondary"
                className="w-[40px] h-[40px] top-2 left-2"
                sx={{
                    position: 'absolute !important',
                }}
                onClick={(e) => {
                    setOpenProfile(false);
                }}
            >
                <ChevronLeftIcon
                    className="text-[var(--primary)]"
                    fontSize="large"
                />
            </Button>
            <h1 className="text-2xl text-[var(--primary)] text-center mt-1 font-semibold">
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
                <p className="text-[var(--primary)] font-semibold mb-2">
                    Your email
                </p>
                <div>
                    <p>{email}</p>
                </div>
                <p className="text-[var(--primary)] font-semibold mb-2 mt-4">
                    Your name
                </p>
                <div className="flex justify-between items-center">
                    {!edit && <p className="p-[4px_0_4px]">{name}</p>}
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
                            color="secondary"
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
                                className="mr-3 cursor-pointer text-black"
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

            <ChangeUserAvatar
                open={openChangeAvtPopUp}
                setStatus={setOpenChangeAvtPopUp}
                reloadAvt={setAvatar}
                haveAvt={avatar !== null}
            />
        </div>
    );
}

export default Profile;
