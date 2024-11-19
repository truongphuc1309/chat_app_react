import { Button, CircularProgress, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';
import ErrorIcon from '@mui/icons-material/Error';

function Login() {
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

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMess, setErrorMess] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);

    const [cookies, setCookie] = useCookies(['user']);

    useEffect(() => {
        if (cookies.token) navigate('/');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        const response = await authService.login(email, password);
        setLoginLoading(false);
        if (response.success == false) {
            setErrorMess(response.message);
            if (response.code === '2003') setSendEmail(true);
            else setSendEmail(false);
        } else {
            setCookie('token', response.metaData.accessToken, { path: '/' });
            setCookie('refresh_token', response.metaData.refreshToken, {
                path: '/',
            });
            navigate('/');
        }
    };

    return (
        <div className="w-screen h-screen bg-[var(--primary)] flex items-center justify-center">
            <form className=" bg-white sm:w-[420px] sm:h-auto h-[100%] w-[100%] p-12 shadow-[#00000042] shadow-xl rounded-xl">
                <h1 className="text-[var(--primary)] text-center font-bold text-4xl mb-8">
                    Log In
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
                    }}
                />
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
                    Log In
                    {loginLoading && (
                        <CircularProgress
                            color="inherit"
                            size={26}
                            className="ml-2"
                        />
                    )}
                </Button>

                {errorMess && (
                    <p className="mt-4 text-center text-red-600 p-[10px_10px] bg-[#fca5a55a]">
                        <ErrorIcon className="mr-2" />
                        {errorMess}
                        {sendEmail && (
                            <Button
                                sx={{
                                    marginLeft: '4px',
                                    textTransform: 'none',
                                }}
                                onClick={() => navigate('/send-verification')}
                            >
                                Send Email
                            </Button>
                        )}
                    </p>
                )}

                <Link
                    to="/forgot-password"
                    className="mt-2 ml-2 text-[1rem] text-blue-400 block text-center underline"
                >
                    Forgot password?
                </Link>
                <div className="text-center text-[1rem] mt-[14px] text-[#9188d9]">
                    Not Registered?
                    <Link
                        to="/register"
                        className="ml-2 text-[1rem] text-blue-400"
                    >
                        Register
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
