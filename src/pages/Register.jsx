import React, { useEffect, useState } from 'react';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';
import { useCookies } from 'react-cookie';
import MailIcon from '@mui/icons-material/Mail';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorIcon from '@mui/icons-material/Error';

function Register() {
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
            '& .MuiFormHelperText-contained': {
                color: 'error.main',
                margin: 0,
            },
        },
    };

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errorMess, setErrorMess] = useState('');

    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['user']);
    const [openEmailPopUp, setOpenEmailPopUp] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [resendEmailLoading, setResendEmailLoading] = useState(false);
    const [resentEmail, setResentEmail] = useState(false);
    const [disableSendEmail, setDisableSendEmail] = useState(false);

    useEffect(() => {
        if (cookies.token) navigate('/');
    }, []);

    useEffect(() => {
        if (cookies.disable) setDisableSendEmail(true);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== rePassword) setErrorMess('No matching password');
        else {
            setRegisterLoading(true);
            const response = await authService.register({
                email,
                name,
                password,
            });
            setRegisterLoading(false);
            if (response.success == false) setErrorMess(response.message);
            else setOpenEmailPopUp(true);
        }
    };

    const handleResendEmail = async (e) => {
        setResendEmailLoading(true);
        setResentEmail(false);
        const result = await authService.sendVerificationEmail(email);
        setResendEmailLoading(false);

        if (result.success) {
            setResentEmail(true);
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000); // 30 phút
            setCookie('disable', 'true', {
                path: '/',
                expires: expirationDate,
            });
            setDisableSendEmail(true);
        }
    };

    return (
        <div className="w-screen h-screen bg-[var(--primary)] flex items-center justify-center">
            <form className=" bg-white sm:w-[420px] sm:h-auto h-[100%] w-[100%] p-10 shadow-[#00000042] shadow-xl rounded-xl">
                <h1 className="text-[var(--primary)] text-center font-bold text-4xl mb-8">
                    Register
                </h1>
                <TextField
                    id="email"
                    label="Email"
                    fullWidth
                    size="normal"
                    color=""
                    type="email"
                    required
                    sx={textStyle}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMess('');
                    }}
                />
                <TextField
                    id="name"
                    label="Full Name"
                    fullWidth
                    size="normal"
                    color=""
                    type="text"
                    required
                    sx={textStyle}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrorMess('');
                    }}
                />
                <TextField
                    id="password"
                    label="Password"
                    fullWidth
                    size="normal"
                    color=""
                    type="password"
                    required
                    sx={textStyle}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMess('');
                    }}
                />
                <TextField
                    id="confirm-password"
                    label="Confirm Password"
                    fullWidth
                    size="normal"
                    color=""
                    type="password"
                    required
                    sx={textStyle}
                    onChange={(e) => {
                        setRePassword(e.target.value);
                        setErrorMess('');
                    }}
                />

                <Button
                    id="register-button"
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
                    Register
                    {registerLoading && (
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

                <div className="text-center text-[1rem] mt-[14px] text-[#9188d9]">
                    Have an account?
                    <Link
                        to="/login"
                        className="ml-2 text-[1rem] text-blue-400"
                    >
                        Log In
                    </Link>
                </div>
            </form>
            <Dialog
                id="success-register-dialog"
                open={openEmailPopUp}
                // onClose={() => setOpenDeletePopUp(false)}
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
                    Register successfully!
                </DialogTitle>
                <DialogContent>
                    <div className="flex items-center justify-center">
                        <MailIcon
                            color="success"
                            sx={{
                                height: '200px',
                                width: '200px',
                            }}
                        />
                    </div>
                    A verification email has been sent to <b>{email}</b>
                    <br />
                    Please check your inbox (and spam folder) to verify your
                    account within the next <b>24 hours</b>
                    <br />
                    If you do not verify your email within this time, you will
                    need to register again
                    <br />
                    <b>
                        If you didn't receive the email, click the button below
                        to resend it
                    </b>
                    <br />
                    <br />
                    {resentEmail && (
                        <p className="text-green-600">
                            <DoneAllIcon /> Resent email successfully
                        </p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={disableSendEmail}
                        color="secondary"
                        variant="outlined"
                        onClick={handleResendEmail}
                    >
                        Resend email
                        {resendEmailLoading && (
                            <CircularProgress
                                color="secondary"
                                size={26}
                                className="ml-2"
                            />
                        )}
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => setOpenEmailPopUp(false)}
                    >
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Register;
