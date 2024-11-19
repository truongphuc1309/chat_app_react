import { Button, CircularProgress, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import authService from '../services/AuthService';
import ErrorIcon from '@mui/icons-material/Error';

function ForgotPassword() {
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

    const [cookies, setCookie] = useCookies(['user']);

    const [email, setEmail] = useState('');
    const [errorMess, setErrorMess] = useState('');
    const [success, setSuccess] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [disable, setDisable] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSendLoading(true);
        const result = await authService.forgotPassword(email);
        setSendLoading(false);

        if (result.success) {
            setSuccess(true);
            setErrorMess('');
        } else {
            setErrorMess(result.message);
            setSuccess(false);
        }
    };

    return (
        <div className="w-screen h-screen bg-[var(--primary)] flex items-center justify-center">
            <form className=" bg-white p-12 shadow-[#00000042] shadow-xl sm:w-[460px] sm:h-auto h-[100%] w-[100%] rounded-xl">
                <h1 className="text-[var(--primary)] text-center font-bold text-4xl mb-8">
                    Forgot Password
                </h1>
                <TextField
                    label="Email"
                    fullWidth
                    size="normal"
                    color=""
                    type="email"
                    required
                    sx={textStyle}
                    helperText=""
                    onChange={(e) => {
                        setEmail(e.target.value);
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
                    Send Email
                    {sendLoading && (
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
                    <p className="text-green-600 break-words bg-[#86efad36] p-[10px_20px] mt-4">
                        <DoneAllIcon /> We have sent a email that contains a
                        link to reset password, please check your email
                    </p>
                )}
            </form>
        </div>
    );
}

export default ForgotPassword;
