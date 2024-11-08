import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import {
    Avatar,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
} from '@mui/material';
import WavesurferPlayer from '@wavesurfer/react';
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import messageService from '../services/MessageService';
import { formatLocalTime } from '../utils/formatTime';
import { tranferFileSize } from '../utils/tranferFileSize';

function MessageCard({ data, isYour, ws, presentAvt, viewImg }) {
    const { accessToken } = useAppContext();
    const messageElementRef = useRef();
    const time = formatLocalTime(data.createdAt);
    const [isHover, setIsHover] = useState(false);
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const [deletting, setDeletting] = useState(false);
    const [wavesurfer, setWavesurfer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [waveWidth, setWaveWidth] = useState(0);

    const handleDeleteMessage = async () => {
        setDeletting(true);
        const result = await messageService.deleteMessage({
            id: data.id,
            token: accessToken,
        });

        if (result.success) {
            ws.send({
                destination: `/app/message/delete`,
                message: result.metaData,
            });
        }
        setDeletting(false);
        setOpenDeletePopUp(false);
    };

    const onReady = (ws) => {
        setWavesurfer(ws);
    };

    useEffect(() => {
        if (messageElementRef.current) {
            const { offsetWidth } = messageElementRef.current;
            setWaveWidth((offsetWidth * 40) / 100);
        }
    }, []);

    return (
        <>
            <div
                ref={messageElementRef}
                onMouseEnter={() => {
                    if (data.active) setIsHover(true);
                }}
                onMouseLeave={() => {
                    if (data.active) setIsHover(false);
                }}
            >
                <div
                    className={`mt-[2px] flex items-center  ${
                        isYour ? 'flex-row-reverse' : ''
                    }`}
                >
                    {!isYour && presentAvt && (
                        <Avatar
                            src={data.user.avatar || ''}
                            sx={{
                                '&': {
                                    height: '32px',
                                    width: '32px',
                                    alignSelf: 'end',
                                },
                            }}
                        />
                    )}
                    {data.active && data.type === 'text' && (
                        <p
                            className={` max-w-[50%] p-[4px_10px]  text-white break-word ${
                                isYour
                                    ? 'rounded-[20px_20px_0_20px] bg-[var(--primary)]'
                                    : 'rounded-[0_20px_20px_20px] bg-[var(--third)]'
                            } 
                            ${!isYour && !presentAvt ? 'ml-[36px]' : 'ml-1'}
                            `}
                        >
                            {data.content}
                        </p>
                    )}

                    {data.active && data.type === 'image' && (
                        <img
                            src={data.file.url}
                            className={`max-w-[50%] w-auto max-h-[200px] rounded-xl cursor-pointer ${
                                !isYour && !presentAvt ? 'ml-[36px]' : 'ml-1'
                            } border-[2px] border-[var(--primary)]`}
                            onClick={() => viewImg(data)}
                        />
                    )}

                    {data.active && data.type === 'audio' && (
                        <div
                            className={`p-[4px_4px] max-w-[50%]  text-white break-word ${
                                isYour
                                    ? 'rounded-[40px_40px_0_40px] bg-[var(--primary)]'
                                    : 'rounded-[0_40px_40px_40px] bg-[var(--third)]'
                            } 
                            ${!isYour && !presentAvt ? 'ml-[36px]' : 'ml-1'}
                            `}
                        >
                            <audio
                                controls
                                className={`max-w-[100%] h-[40px] ${
                                    isYour ? 'primary-audio' : 'third-audio'
                                }`}
                            >
                                <source src={data.file.url} type="audio/ogg" />
                                <source src={data.file.url} type="audio/mpeg" />
                            </audio>
                        </div>
                    )}

                    {data.active && data.type === 'voice' && (
                        <div
                            id={`message_${data.id}`}
                            className={`flex overflow-hidden p-[10px] text-white break-word ${
                                isYour
                                    ? 'rounded-[40px_40px_0_40px] bg-[var(--primary)]'
                                    : 'rounded-[0_40px_40px_40px] bg-[var(--third)]'
                            } 
                            ${!isYour && !presentAvt ? 'ml-[36px]' : 'ml-1'}
                            `}
                        >
                            <IconButton
                                onClick={(e) => {
                                    if (!isPlaying) wavesurfer.play();
                                    else wavesurfer.pause();
                                }}
                                className="!w-[40px] !h-[40px] mr-[20px]"
                            >
                                {!isPlaying && (
                                    <PlayCircleIcon className="text-[#4236a3] !text-[2rem]" />
                                )}
                                {isPlaying && (
                                    <PauseCircleIcon className="text-[#4236a3] !text-[2rem]" />
                                )}
                            </IconButton>

                            <WavesurferPlayer
                                width={waveWidth}
                                height={40}
                                normalize
                                waveColor="violet"
                                url={data.file.url}
                                progressColor={'#4236a3'}
                                onReady={onReady}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            />
                        </div>
                    )}

                    {data.active && data.type === 'video' && (
                        <video
                            controls
                            className={`max-w-[50%] w-auto max-h-[200px] rounded-xl ${
                                !isYour && !presentAvt ? 'ml-[36px]' : 'ml-1'
                            } border-[2px] border-[var(--primary)]`}
                        >
                            <source src={data.file.url} type="video/mp4" />
                        </video>
                    )}

                    {data.active && data.type === 'file' && (
                        <a
                            href={data.file.downloadUrl}
                            className={`flex items-center max-w-[50%] p-[4px_10px]  text-white break-word ${
                                isYour
                                    ? 'rounded-[20px_20px_0_20px] bg-[var(--primary)]'
                                    : 'rounded-[0_20px_20px_20px] bg-[var(--third)]'
                            } 
                            ${!isYour && !presentAvt ? 'ml-[36px]' : 'ml-1'}
                            `}
                        >
                            <div className="relative w-[60px]">
                                <InsertDriveFileIcon className="text-purple-500 !text-[4rem]" />
                                <p className="absolute top-[50%] right-[50%] translate-x-[50%] text-[0.8rem]">
                                    {
                                        data.file.originalName.split('.')[
                                            data.file.originalName.split('.')
                                                .length - 1
                                        ]
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-[1rem] text-blue-900 max-w-[100px]  lg:max-w-[200px] xl:max-w-[300px] truncate">
                                    {data.file.originalName}
                                </p>
                                <p className="text-[var(--third)] text-[0.8rem]">
                                    {tranferFileSize(data.file.size)}
                                </p>
                            </div>
                        </a>
                    )}

                    {!data.active && (
                        <p
                            className={`bg-[#dbd7f9] max-w-[50%] p-[4px_10px] text-[var(--primary)] border-[var(--primary)] border-[1px] ${
                                isYour
                                    ? 'rounded-[20px_20px_0_20px]'
                                    : 'rounded-[0_20px_20px_20px] '
                            }
                            ${!isYour && !presentAvt ? 'ml-[36px]' : 'ml-1'}`}
                        >
                            {isYour
                                ? `You unsent a ${
                                      data.type === 'text'
                                          ? 'message'
                                          : data.type
                                  }`
                                : `${data.user.name} unsent a ${
                                      data.type === 'text'
                                          ? 'message'
                                          : data.type
                                  }`}
                        </p>
                    )}

                    {isHover && isYour && (
                        <div
                            className={`flex items-center mr-2 transition-all`}
                        >
                            <IconButton
                                color="error"
                                sx={{
                                    marginRight: '8px',
                                    height: '30px',
                                    width: '30px',
                                }}
                                onClick={() => setOpenDeletePopUp(true)}
                            >
                                <DeleteIcon />
                            </IconButton>
                            <p className="text-[#828282]">{time}</p>
                        </div>
                    )}
                </div>
            </div>
            <Dialog
                open={openDeletePopUp}
                onClose={() => setOpenDeletePopUp(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    '& .MuiPaper-root': {
                        minWidth: '400px',
                        padding: '10px 20px',
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    Delete this message?
                </DialogTitle>

                <DialogActions>
                    <Button
                        color="secondary"
                        variant="outlined"
                        onClick={() => setOpenDeletePopUp(false)}
                    >
                        No
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleDeleteMessage}
                    >
                        Yes
                        {deletting && (
                            <CircularProgress
                                className="!ml-2"
                                size="1.4rem"
                                color="inherit"
                            />
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default MessageCard;
