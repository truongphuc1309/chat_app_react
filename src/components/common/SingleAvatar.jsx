import { Avatar, Badge, styled } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

function SingleAvatar({ data, size }) {
    const SIZE = {
        s: {
            width: '34px',
            spot: '42%',
        },
        m: {
            width: '60px',
            spot: '56%',
        },
        l: {
            width: '100px',
            spot: '60%',
        },
        xl: {
            width: '200px',
            spot: '60%',
        },
    };

    const StyledBadge = styled(Badge)(() => ({
        '& .MuiBadge-badge': {
            position: 'absolute',
            top: '70%',
            left: `${SIZE[size]?.spot}`,
            height: '20%',
            width: '20%',
            borderRadius: '50%',
            backgroundColor: '#60ec0d',
            color: '#60ec0d',
            boxShadow: `0 0 0 2px transparent`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }));

    const { socket } = useAppContext();
    const [online, setOnline] = useState(false);
    const [id, setId] = useState(null);

    useEffect(() => {
        setOnline(data?.online);
        setId(data?.id);
    }, [data]);

    useEffect(() => {
        if (id)
            socket.subscribe(`/topic/user/${id}`, (mess) => {
                const message = JSON.parse(mess.body);
                setOnline(message.online);
            });
    }, [id]);

    return (
        <StyledBadge
            overlap="circular"
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            variant={online ? 'dot' : ''}
        >
            <Avatar
                src={data?.avatar || ''}
                sx={{ width: SIZE[size]?.width, height: SIZE[size]?.width }}
            />
        </StyledBadge>
    );
}

export default memo(SingleAvatar);
