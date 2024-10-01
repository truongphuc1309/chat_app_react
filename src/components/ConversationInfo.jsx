import {
    Avatar,
    AvatarGroup,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogTitle,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AbcIcon from '@mui/icons-material/Abc';
import ImageIcon from '@mui/icons-material/Image';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import RenameGroup from './RenameGroup';
import AddMembers from './AddMembers';
import conversationService from '../services/ConversationService';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import MemberCard from './MemberCard';
import upLoadFile from '../utils/upLoadFile';

function ConversationInfo({ data, setAvatar, close }) {
    const { user } = useContext(AppContext);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const { id } = useParams();

    const { isGroup, avatar, total, email, members, name, admin } = data;
    const [openMemberList, setOpenMemberList] = useState(false);
    const [openEditList, setOpenEditList] = useState(false);
    const [openChangeNamePopUp, setOpenChangeNamePopUp] = useState(false);
    const [openAddMembersPopUp, setOpenAddMembersPopUp] = useState(false);
    const [openDeletePopUp, setDeletePopUp] = useState(false);
    const [openLeaveGroupPopUp, setOpenLeaveGroupPopUp] = useState(false);

    const navigate = useNavigate();

    const handleDeleleteGroup = async () => {
        await conversationService.deleteGroup({
            token: cookies.token,
            conversationId: id,
        });

        navigate('/c/');
    };

    const handleLeaveGroup = async () => {
        await conversationService.leaveGroup({
            token: cookies.token,
            conversationId: id,
            memberId: user.id,
        });

        navigate('/c/');
    };

    const handleChangeAvatar = () => {
        upLoadFile({
            setAvatar,
            callApi: async (avatar) =>
                await conversationService.changeAvatar({
                    token: cookies.token,
                    id,
                    avatar,
                }),
        });
    };

    const handleOpenMemberList = () => {
        setOpenMemberList(!openMemberList);
    };

    const handleOpenEditList = () => {
        setOpenEditList(!openEditList);
    };

    const handleCloseChangeNamePopUp = () => {
        setOpenChangeNamePopUp(false);
    };

    const handleCloseAddMembersPopUp = () => {
        setOpenAddMembersPopUp(false);
    };

    return (
        <div className="bg-[var(--third)] absolute top-0 right-0 left-0 h-screen p-[20px_40px] flex flex-col items-center overflow-scroll">
            <Button
                color="secondary"
                sx={{
                    position: 'absolute',
                    top: '26px',
                    left: '40px',
                }}
                onClick={close}
            >
                <WestIcon />
            </Button>
            <h1 className="text-[2rem] text-[var(--primary)] font-semibold text-center">
                {isGroup ? 'Group Info' : 'User Info'}
            </h1>
            <div className="flex justify-center mt-10 h-[200px]">
                {isGroup && !avatar && (
                    <AvatarGroup
                        total={total}
                        max={3}
                        variant="circular"
                        className="flex items-center mr-2"
                        sx={{
                            '& .MuiAvatar-root': {
                                height: '100px',
                                width: '100px',
                            },
                        }}
                    >
                        {data.members[0] && (
                            <Avatar
                                sx={{ bgcolor: 'var(--primary)' }}
                                src={members[0].avatar || ''}
                            ></Avatar>
                        )}
                        {data.members[1] && (
                            <Avatar
                                sx={{ bgcolor: 'var(--primary)' }}
                                src={members[1].avatar || ''}
                            ></Avatar>
                        )}
                    </AvatarGroup>
                )}
                {(!isGroup || avatar) && (
                    <Avatar
                        className="mr-2"
                        sx={{ width: '200px', height: '200px' }}
                        src={avatar || ''}
                    ></Avatar>
                )}
            </div>
            <h1 className="text-[3rem] text-[var(--primary)] text-center">
                {name}
            </h1>
            <div className="w-[400px] mt-8">
                {!isGroup && (
                    <div>
                        <h1 className="text-[var(--primary)] text-[1.4rem]">
                            Email
                        </h1>
                        <p className="text-[#818080] text-[1.2rem] tracking-widest">
                            {email}
                        </p>
                    </div>
                )}
                {isGroup && (
                    <div>
                        <div>
                            <ListItemButton onClick={handleOpenEditList}>
                                <ListItemText className="text-[var(--primary)]">
                                    Edit
                                </ListItemText>
                                {openEditList ? (
                                    <ExpandLess className="text-[var(--primary)]" />
                                ) : (
                                    <ExpandMore className="text-[var(--primary)]" />
                                )}
                            </ListItemButton>
                            <Collapse
                                in={openEditList}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding>
                                    {admin && (
                                        <>
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={(e) => {
                                                    setOpenChangeNamePopUp(
                                                        true
                                                    );
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <AbcIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Change group name" />
                                            </ListItemButton>
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={handleChangeAvatar}
                                            >
                                                <ListItemIcon>
                                                    <ImageIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Change group avatar" />
                                            </ListItemButton>
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={(e) => {
                                                    setOpenAddMembersPopUp(
                                                        true
                                                    );
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <GroupAddIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Add members" />
                                            </ListItemButton>
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={(e) =>
                                                    setDeletePopUp(true)
                                                }
                                            >
                                                <ListItemIcon>
                                                    <DeleteIcon className="text-red-600" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Delete group"
                                                    className="text-red-600"
                                                />
                                            </ListItemButton>
                                        </>
                                    )}
                                    {!admin && (
                                        <ListItemButton
                                            sx={{ pl: 4 }}
                                            onClick={() =>
                                                setOpenLeaveGroupPopUp(true)
                                            }
                                        >
                                            <ListItemIcon>
                                                <ExitToAppIcon className="text-red-600" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Leave group"
                                                className="text-red-600"
                                            />
                                        </ListItemButton>
                                    )}
                                </List>
                            </Collapse>
                        </div>

                        <div>
                            <ListItemButton onClick={handleOpenMemberList}>
                                <ListItemText className="text-[var(--primary)] text-[1.4rem]">
                                    {`Member (${members.length})`}
                                </ListItemText>
                                {openMemberList ? (
                                    <ExpandLess className="text-[var(--primary)]" />
                                ) : (
                                    <ExpandMore className="text-[var(--primary)]" />
                                )}
                            </ListItemButton>
                            <Collapse
                                in={openMemberList}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding>
                                    {members.map((e, index) => (
                                        <MemberCard
                                            data={e}
                                            admin={admin}
                                            key={index}
                                        />
                                    ))}
                                </List>
                            </Collapse>
                        </div>
                    </div>
                )}
            </div>
            <RenameGroup
                open={openChangeNamePopUp}
                close={handleCloseChangeNamePopUp}
            />
            {openAddMembersPopUp && (
                <AddMembers
                    members={members}
                    open={openAddMembersPopUp}
                    close={handleCloseAddMembersPopUp}
                />
            )}
            <Dialog
                open={openDeletePopUp}
                onClose={() => setDeletePopUp(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" className="text-center">
                    Do you want to leave this group?
                </DialogTitle>

                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => setDeletePopUp(false)}
                    >
                        No
                    </Button>
                    <Button color="error" onClick={handleDeleleteGroup}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openLeaveGroupPopUp}
                onClose={() => setOpenLeaveGroupPopUp(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" className="text-center">
                    Do you want delete this group?
                </DialogTitle>

                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => setOpenLeaveGroupPopUp(false)}
                    >
                        No
                    </Button>
                    <Button color="error" onClick={handleLeaveGroup}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ConversationInfo;
