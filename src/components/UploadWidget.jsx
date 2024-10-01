import { Avatar } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import userService from '../services/UserService';
import { useCookies } from 'react-cookie';

function UploadWidget({ changeAvatar }) {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
            {
                cloudName: 'diy8dw4cd',
                uploadPreset: 'duy1hjib',
            },
            async (error, result) => {
                if (result.info.url) {
                    const uploadResult = await userService.updateAvatar({
                        token: cookies.token,
                        avatar: result.info.url,
                    });

                    if (uploadResult.success) {
                        changeAvatar(result.info.url);
                    }
                }
            }
        );
    }, []);

    return (
        <Avatar
            sx={{
                bgcolor: 'var(--secondary)',
            }}
            onClick={() => widgetRef.current.open()}
        >
            <EditIcon className="text-black" />
        </Avatar>
    );
}

export default UploadWidget;
