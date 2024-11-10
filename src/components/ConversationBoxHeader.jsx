import { Avatar, AvatarGroup, Button } from '@mui/material';
import React from 'react';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

function ConversationBoxHeader({
    data,
    avatar,
    name,
    total,
    isGroup,
    setOpenGroupInfo,
    setOpenConversationBox,
}) {
    const innerWidth = window.innerWidth;
    return (
        <div
            className="h-[86px] bg-[var(--primary)] flex items-center p-[0_40px] cursor-pointer"
            onClick={() => setOpenGroupInfo(true)}
        >
            {innerWidth < 768 && (
                <Button
                    color="secondary"
                    sx={{
                        color: '#fff',
                        padding: '20px',
                        marginLeft: '-20px',
                        marginRight: '20px',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenConversationBox(false);
                    }}
                >
                    <KeyboardArrowLeftIcon
                        sx={{
                            height: '3rem',
                            width: '3rem',
                        }}
                    />
                </Button>
            )}
            <div className="w-min-[120px]">
                {isGroup && !avatar && (
                    <AvatarGroup
                        total={total}
                        max={3}
                        variant="circular"
                        className="flex items-center mr-2"
                        sx={{
                            '& .MuiAvatar-root': {
                                height: '34px',
                                width: '34px',
                            },
                        }}
                    >
                        {data.members[0] && (
                            <Avatar
                                sx={{ bgcolor: 'var(--primary)' }}
                                src={data.members[0].avatar || ''}
                            ></Avatar>
                        )}
                        {data.members[1] && (
                            <Avatar
                                sx={{ bgcolor: 'var(--primary)' }}
                                src={data.members[1].avatar || ''}
                            ></Avatar>
                        )}
                    </AvatarGroup>
                )}
                {(!isGroup || avatar) && (
                    <Avatar
                        className="mr-2"
                        sx={{ width: '60px', height: '60px' }}
                        src={avatar || ''}
                    ></Avatar>
                )}
            </div>
            <h1 className="text-white text-2xl ml-4">{name}</h1>
        </div>
    );
}

export default ConversationBoxHeader;
