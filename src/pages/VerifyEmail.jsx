import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button, CircularProgress } from '@mui/material';
import authService from '../services/AuthService';

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);

    const handleVerifyEmail = async (token) => {
        const result = await authService.verifyEmail(token);
        if (result.success) setSuccess(true);
        else setFailed(true);
    };

    useEffect(() => {
        handleVerifyEmail(token);
    }, []);

    return (
        <div className="bg-[var(--primary)] h-screen flex justify-center items-center">
            {success || failed || <CircularProgress color="info" />}
            {success && (
                <div className="bg-white sm:w-[500px] sm:h-[400px] h-[100%] w-[100%] rounded-xl p-[60px_40px] flex flex-col items-center">
                    <CheckCircleIcon
                        sx={{ fontSize: 120 }}
                        className="text-green-400"
                    />
                    <h1 className="text-[2rem]">
                        <b>Verified!</b>
                    </h1>
                    <p className="mt-2">
                        You have successfully verified your account
                    </p>
                    <Button
                        variant="contained"
                        sx={{
                            marginTop: '30px',
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                </div>
            )}

            {failed && (
                <div className="bg-white shadow-xl sm:w-[500px] sm:h-[400px] h-[100%] w-[100%] rounded-xl p-[60px_40px] flex flex-col items-center justify-center">
                    <CancelIcon
                        sx={{ fontSize: 120 }}
                        className="text-red-400"
                    />
                    <h1 className="text-[2rem] mt-5">
                        <b>Not Found Page!</b>
                    </h1>
                </div>
            )}
        </div>
    );
}

export default VerifyEmail;
