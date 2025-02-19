import React, { useContext, useEffect, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClearIcon from '@mui/icons-material/Clear';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import WestIcon from '@mui/icons-material/West';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    FormControl,
    IconButton,
    InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
} from '@mui/material';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import authService from '../services/AuthService';
import userService from '../services/UserService';
import GroupCreation from './GroupCreation';
import SearchResultCard from './SearchResultCard';
import useOutsideClick from '../hooks/useOutsideClick';

function SideBarHeader() {
    const textStyle = {
        '&.MuiTextField-root': {
            backgroundColor: 'var(--secondary)',
            borderRadius: '40px',

            '& .MuiInputBase-inputSizeSmall': {
                color: 'var(--purple-light)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--secondary)',
                borderWidth: '3px',
            },

            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--purple-light)',
                borderWidth: '3px',
                transition: 'all 0.4s',
            },

            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--purple-light)',
                borderWidth: '3px',
            },
        },
    };

    const { user, profile } = useContext(AppContext);
    const { openProfile, setOpenProfile } = profile;
    const navigate = useNavigate();
    const [openGroupCreation, setOpenGroupCreation] = useState(false);
    const [openLogOutPopUp, setOpenLogOuPopUp] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [filled, setFilled] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const menuRef = useOutsideClick(() => setOpenMenu(false));
    useEffect(() => {
        if (!search) {
            setSearchInput('');
            setFilled(false);
        }
    }, [search]);

    const handleOpenLogoutPopUp = () => {
        setOpenLogOuPopUp(true);
        setOpenMenu(false);
    };

    const handleCloseLogoutPopUp = () => {
        setOpenLogOuPopUp(false);
    };

    const handleOpenGroupCreation = (status) => {
        setOpenGroupCreation(status);
    };

    const handleLogout = async (e) => {
        const result = await authService.logOut(cookies.token);
        console.log(result);
        if (result.success == true) {
            removeCookie('token', { path: '/' });
            removeCookie('refresh_token', { path: '/' });
            navigate('/login');
        }
    };

    const getSearchData = async (value) => {
        const result = await userService.search({
            token: cookies.token,
            key: value,
        });
        if (result.success)
            setData(result.metaData.filter((e) => e.id !== user.id));
    };

    const handleSearch = async (e) => {
        if (!search) {
            setSearch(true);
        }
        setSearchInput(e.target.value);

        if (e.target.value !== '') {
            await getSearchData(e.target.value);
            if (!filled) setFilled(true);
        } else {
            setData([]);
            setFilled(false);
        }
    };

    return (
        <div className="flex relative justify-between items-center p-[10px_0]">
            {!search && (
                <IconButton
                    variant="text"
                    color="secondary"
                    sx={{
                        height: '40px',
                        width: '40px',
                        '&.MuiIconButton-root': {
                            backgroundColor: 'var(--secondary)',
                        },
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(!openMenu);
                    }}
                >
                    <MenuIcon
                        className="cursor-pointer text-[#aaa4d5] !text-[1.6rem]"
                        fontSize="large"
                    ></MenuIcon>
                </IconButton>
            )}

            {search && (
                <IconButton
                    variant="text"
                    color="secondary"
                    sx={{
                        height: '40px',
                        width: '40px',
                        '&.MuiIconButton-root': {
                            backgroundColor: 'var(--secondary)',
                        },
                    }}
                    onClick={(e) => {
                        setSearchInput([]);
                        setSearch(false);
                    }}
                >
                    <WestIcon
                        className="cursor-pointer !text-[#aaa4d5] !text-[1.6rem]"
                        fontSize="large"
                    />
                </IconButton>
            )}
            {openMenu && (
                <div ref={menuRef}>
                    <List
                        sx={{
                            position: 'absolute !important',
                            top: '100%',
                            minWidth: '200px',
                            left: 0,
                            zIndex: 999,
                            bgcolor: 'var(--primary)',
                            borderRadius: '10px',
                            boxShadow: '0 0 10px var(--purple-light)',
                        }}
                    >
                        <ListItemButton
                            sx={{
                                '&': '2px white',
                            }}
                            onClick={(e) => {
                                setOpenMenu(false);
                                setOpenProfile(true);
                            }}
                        >
                            <ListItemIcon>
                                <AccountCircleIcon className="text-white" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Profile"
                                className="text-white"
                            />
                        </ListItemButton>
                        <ListItemButton
                            onClick={(e) => {
                                setOpenGroupCreation(true);
                                setOpenMenu(false);
                            }}
                        >
                            <ListItemIcon>
                                <AddCircleIcon className="text-white" />
                            </ListItemIcon>
                            <ListItemText
                                primary="New group"
                                className="text-white"
                            />
                        </ListItemButton>
                        <ListItemButton
                            className="border-t-[2px_!important]"
                            onClick={handleOpenLogoutPopUp}
                        >
                            <ListItemIcon>
                                <LogoutIcon className="text-white" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Log Out"
                                className="text-white"
                            />
                        </ListItemButton>
                    </List>
                </div>
            )}

            <FormControl className="w-[80%]">
                <TextField
                    autoComplete="off"
                    className="rounded-sm"
                    size="small"
                    variant="outlined"
                    value={searchInput}
                    onChange={handleSearch}
                    onFocus={(e) => {
                        setOpenMenu(false);
                    }}
                    sx={textStyle}
                    InputProps={{
                        sx: {
                            borderRadius: '20px',
                        },

                        startAdornment: (
                            <InputAdornment
                                position="start"
                                className="cursor-pointer"
                            >
                                <SearchIcon className="text-[#aaa4d5]" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <>
                                {filled && (
                                    <InputAdornment
                                        position="end"
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            setSearchInput('');
                                            setFilled(false);
                                        }}
                                    >
                                        <ClearIcon className="!text-[#aaa4d5]" />
                                    </InputAdornment>
                                )}
                            </>
                        ),
                    }}
                />
            </FormControl>
            {search && (
                <div className='className="flex flex-col bg-[var(--secondary)] absolute top-[100%] h-[calc(100vh-100%-28px)] w-[100%] z-[999] overflow-y-scroll p-[20px] rounded-2xl'>
                    {data.map((e) => (
                        <SearchResultCard
                            data={e}
                            closeSearch={() => setSearch(false)}
                        />
                    ))}
                    {data.length <= 0 && (
                        <p className="text-center text-[1.2rem] mt-2 ">
                            No results
                        </p>
                    )}
                </div>
            )}
            <Dialog
                open={openLogOutPopUp}
                onClose={handleCloseLogoutPopUp}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    '&.MuiPaper-root': {
                        width: '200px',
                    },
                }}
            >
                <DialogTitle
                    id="alert-dialog-title"
                    className="text-[var(--primary)] !p-[20px]"
                >
                    Do you want to log out?
                </DialogTitle>
                <DialogActions className="!p-[20px]">
                    <Button
                        onClick={handleCloseLogoutPopUp}
                        color="secondary"
                        variant="outlined"
                    >
                        No
                    </Button>
                    <Button
                        onClick={handleLogout}
                        color="secondary"
                        variant="contained"
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            {openGroupCreation && (
                <GroupCreation
                    handleOpenGroupCreation={handleOpenGroupCreation}
                />
            )}
        </div>
    );
}

export default SideBarHeader;
