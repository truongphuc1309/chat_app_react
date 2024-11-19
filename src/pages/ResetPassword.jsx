import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    TextField,
} from '@mui/material';
import authService from '../services/AuthService';
import NotFound from './NotFound';
import ErrorIcon from '@mui/icons-material/Error';

function ResetPassword() {
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

    const { token } = useParams();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [errorMess, setErrorMess] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [successReset, setSuccessReset] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleVerifyEmail = async (token) => {
        const result = await authService.confirmResetPassword(token);
        if (result.success) setSuccess(true);
        else setFailed(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        const result = await authService.resetPassword({
            token,
            newPassword: password,
            confirmPassword,
        });
        setResetLoading(false);

        if (result.success) setSuccessReset(true);
        else setErrorMess(result.message);
    };

    useEffect(() => {
        handleVerifyEmail(token);
    }, []);

    return (
        <div className="bg-[var(--primary)] h-screen flex justify-center items-center">
            {success || failed || <CircularProgress color="info" />}
            {success && (
                <form className=" bg-white sm:w-[420px] sm:h-auto h-[100%] w-[100%] p-12 shadow-[#00000042] shadow-xl">
                    <h1 className="text-[var(--primary)] text-center font-bold text-4xl mb-8">
                        Reset Password
                    </h1>
                    <TextField
                        label="Password"
                        fullWidth
                        size="normal"
                        color=""
                        type="password"
                        required
                        sx={textStyle}
                        helperText=""
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorMess('');
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        fullWidth
                        size="normal"
                        color=""
                        type="password"
                        required
                        sx={textStyle}
                        helperText=""
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrorMess('');
                        }}
                    />
                    <Button
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
                        Reset
                        {resetLoading && (
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
                </form>
            )}
            {failed && <NotFound />}
            <Dialog
                open={successReset}
                onClose={() => setSuccessReset(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    '& .MuiPaper-root': {
                        minWidth: '400px',
                        padding: '10px 20px',
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title" className="text-center">
                    <CheckCircleIcon
                        sx={{ fontSize: 120 }}
                        className="text-green-400"
                    />
                    <h1 className="text-[2rem]">Successfully!</h1>
                    <p>You have reset password successfully</p>
                </DialogTitle>
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ResetPassword;
