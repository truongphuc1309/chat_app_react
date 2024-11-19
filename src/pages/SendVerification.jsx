import { Button, CircularProgress, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import authService from '../services/AuthService';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useCookies } from 'react-cookie';
import ErrorIcon from '@mui/icons-material/Error';

function SendVerification() {
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
        const result = await authService.sendVerificationEmail(email);
        setSendLoading(false);

        if (result.success) {
            setSuccess(true);
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000); // 30 phút
            setCookie('disable', 'true', {
                path: '/',
                expires: expirationDate,
            });
            setDisable(true);
        } else {
            setErrorMess(result.message);
            setSuccess(false);
        }
    };

    useEffect(() => {
        if (cookies.disable) setDisable(true);
    }, []);

    return (
        <div className="w-screen h-screen bg-[var(--primary)] flex items-center justify-center">
            <form className=" bg-white p-12 shadow-[#00000042] shadow-xl sm:w-[420px] sm:h-auto h-[100%] w-[100%] rounded-xl">
                <h1 className="text-[var(--primary)] text-center font-bold text-4xl mb-8">
                    Verify Email
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
                    <p className="text-green-600 bg-[#86efad36] p-[10px_20px] mt-4">
                        <DoneAllIcon /> Sent email successfully
                    </p>
                )}
            </form>
        </div>
    );
}

export default SendVerification;
