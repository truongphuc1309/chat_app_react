import { Button, CircularProgress, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import authService from '../services/AuthService';
import ErrorIcon from '@mui/icons-material/Error';
import UserService from '../services/UserService';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const textStyle = {
        '&': {
            marginBottom: '20px',
        },

        '&.MuiTextField-root': {
            '& .MuiInputLabel-outlined': {
                color: 'var(--primary)',
            },
            '& .MuiInputBase-inputSizeSmall': {
                color: 'var(--primary)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
            },
        },
    };

    const { accessToken } = useAppContext();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorMess, setErrorMess] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await UserService.changePassword({
            token: accessToken,
            currentPassword,
            newPassword,
        });
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setErrorMess('');
            removeCookie('token', { path: '/' });
            removeCookie('refresh_token', { path: '/' });
        } else {
            setErrorMess(result.message);
            setSuccess(false);
        }
    };

    return (
        <div className="w-screen h-screen bg-[var(--primary)] flex items-center justify-center">
            <form className=" bg-white p-12 shadow-[#00000042] shadow-xl sm:w-[460px] sm:h-auto h-[100%] w-[100%] rounded-xl">
                <h1 className="text-[var(--primary)] text-center font-bold text-4xl mb-8">
                    Change Password
                </h1>
                <TextField
                    label="Current Password"
                    fullWidth
                    size="normal"
                    color=""
                    type="password"
                    required
                    sx={textStyle}
                    helperText=""
                    onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        setErrorMess('');
                        setSuccess(false);
                    }}
                />
                <TextField
                    label="New Password"
                    fullWidth
                    size="normal"
                    color=""
                    type="password"
                    required
                    sx={textStyle}
                    helperText=""
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrorMess('');
                        setSuccess(false);
                    }}
                />
                <Button
                    disabled={disable}
                    type="submit"
                    className="w-[100%] h-[46px]"
                    variant="contained"
                    sx={{
                        '&,&:hover': {
                            fontSize: '1rem',
                            backgroundColor: 'var(--primary)',
                        },
                    }}
                    onClick={handleSubmit}
                >
                    Change
                    {loading && (
                        <CircularProgress
                            color="inherit"
                            size={26}
                            className="ml-2"
                        />
                    )}
                </Button>
                {errorMess && (
                    <p className="mt-4 text-red-600 p-[10px_20px] bg-[#fca5a55a]">
                        <ErrorIcon className="mr-2" />
                        {errorMess}
                    </p>
                )}
                {success && (
                    <>
                        <p className="text-green-600 break-words bg-[#86efad36] p-[10px_20px] mt-4">
                            <DoneAllIcon /> You have change password
                            successfully
                        </p>
                        <div className="flex items-center justify-center mt-4">
                            <p className="mr-4 text-[var(--primary)]">
                                Please log in again
                            </p>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/login')}
                            >
                                Log in
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}

export default ChangePassword;
