import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

function NotFound() {
    return (
        <div className="bg-[var(--primary)] h-screen flex justify-center items-center">
            <div className="bg-white h-[400px] w-[500px] rounded-xl p-[60px_40px] flex flex-col items-center justify-center">
                <CancelIcon sx={{ fontSize: 120 }} className="text-red-400" />
                <h1 className="text-[2rem] mt-5">
                    <b>Not Found Page!</b>
                </h1>
            </div>
        </div>
    );
}

export default NotFound;
