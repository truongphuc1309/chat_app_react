import React, { useContext, useEffect, useState } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
} from '@mui/material';
import { useFormControl } from '@mui/material/FormControl';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WestIcon from '@mui/icons-material/West';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useCookies } from 'react-cookie';
import authService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import GroupCreation from './GroupCreation';
import userService from '../services/UserService';
import SearchResultCard from './SearchResultCard';
import { AppContext } from '../contexts/AppContext';

function SideBarHeader() {
    const textStyle = {
        '&.MuiTextField-root': {
            '& .MuiInputBase-inputSizeSmall': {
                color: 'var(--primary)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
            },

            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
                borderWidth: '3px',
                transition: 'all 0.4s',
            },

            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
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
                <Button
                    variant="text"
                    color="secondary"
                    sx={{ textTransform: 'none' }}
                    onClick={(e) => {
                        setOpenMenu(!openMenu);
                    }}
                >
                    <MenuIcon
                        className="cursor-pointer text-[var(--primary)]"
                        fontSize="large"
                    ></MenuIcon>
                </Button>
            )}

            {search && (
                <Button
                    variant="text"
                    color="secondary"
                    sx={{ textTransform: 'none' }}
                    onClick={(e) => {
                        setSearchInput([]);
                        setSearch(false);
                    }}
                >
                    <WestIcon
                        className="cursor-pointer text-[var(--primary)]"
                        fontSize="large"
                    />
                </Button>
            )}
            {openMenu && (
                <div onClickCapture={(e) => console.log('siuu')}>
                    <List
                        sx={{
                            position: 'absolute !important',
                            top: '100%',
                            minWidth: '200px',
                            left: 0,
                            zIndex: 999,
                            bgcolor: 'var(--third)',
                            borderRadius: '4px',
                            boxShadow: '0 0 10px var(--third)',
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
                                <SearchIcon className="text-[var(--primary)]" />
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
                                        <ClearIcon className="text-[var(--primary)]" />
                                    </InputAdornment>
                                )}
                            </>
                        ),
                    }}
                />
            </FormControl>
            {search && (
                <div className='className="flex flex-col bg-[var(--secondary)] absolute top-[100%] h-[calc(100vh-100%-8px)] w-[100%] z-[999] overflow-scroll'>
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
            >
                <DialogTitle id="alert-dialog-title">
                    Do You Want To Log Out?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseLogoutPopUp} color="secondary">
                        No
                    </Button>
                    <Button onClick={handleLogout} color="secondary" autoFocus>
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
