import { Avatar, AvatarGroup } from '@mui/material';
import React, { memo } from 'react';
import SingleAvatar from './SingleAvatar';
import { useAppContext } from '../../contexts/AppContext';

function ConversationAvatar({ data, width, size = 'small' }) {
    const { user } = useAppContext();

    const AVATAR_SIZE = {
        s: {
            width: '34px',
            spot: '40%',
        },
        m: {
            width: '60px',
            spot: '50%',
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

    const SIZE = {
        small: {
            memberSize: 's',
            mainSize: 'm',
        },
        large: {
            memberSize: 'l',
            mainSize: 'xl',
        },
    };
    return (
        <div className={`w-[${width}] flex items-center justify-center`}>
            {data?.group && !data.avatar && (
                <AvatarGroup
                    total={data?.members.length}
                    max={3}
                    variant="circular"
                    className="flex items-center mr-2"
                    sx={{
                        '& .MuiAvatar-root': {
                            height: AVATAR_SIZE[SIZE[size].memberSize].width,
                            width: AVATAR_SIZE[SIZE[size].memberSize].width,
                        },
                    }}
                >
                    {data.members[0] && (
                        <SingleAvatar
                            size={SIZE[size].memberSize}
                            data={data.members[0]}
                            key={data.members[0].id}
                        />
                    )}
                    {data.members[1] && (
                        <SingleAvatar
                            size={SIZE[size].memberSize}
                            data={data.members[1]}
                            key={data.members[1].id}
                        />
                    )}
                </AvatarGroup>
            )}
            {data?.group && data.avatar && (
                <SingleAvatar
                    data={{ avatar: data.avatar }}
                    size={SIZE[size].mainSize}
                />
            )}

            {!data?.group &&
                data?.members.map((e) => {
                    if (e.id !== user.id)
                        return (
                            <SingleAvatar data={e} size={SIZE[size].mainSize} />
                        );
                })}
        </div>
    );
}

export default memo(ConversationAvatar);
