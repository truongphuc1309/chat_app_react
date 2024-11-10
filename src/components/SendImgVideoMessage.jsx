import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ClearIcon from '@mui/icons-material/Clear';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Snackbar,
} from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import messageService from '../services/MessageService';
import resetFileInput from '../utils/resetFileInput';

function SendImgVideoMessage({ setLoadingFiles }) {
    const { accessToken, socket } = useAppContext();
    const { id } = useParams();

    const [previewImgVideoPopUp, setPreviewImgVideoPopUp] = useState(false);
    const [previewImgVideoObj, setPreviewImgVideoObj] = useState([]);
    const [fileInput, setFileInput] = useState([]);
    const [error, setError] = useState(null);

    const onChangeImgVideoInput = (e) => {
        console.log(e.target.files);
        const fileArray = Array.from(e.target.files);
        const list = [];
        fileArray.forEach((e) => {
            const type = e.type.split('/')[0];
            list.push({
                url: URL.createObjectURL(e),
                type,
                name: e.name,
                size: e.size,
            });
        });
        setPreviewImgVideoObj(list);
        setFileInput(fileArray);
        setPreviewImgVideoPopUp(true);
        console.log('url', previewImgVideoObj);
    };

    const sendImgVideo = async (file) => {
        const loadingFile = previewImgVideoObj.find(
            (e) => e.name === file.name
        );
        setLoadingFiles((pre) => [loadingFile, ...pre]);

        const result = await messageService.sendMessage({
            token: accessToken,
            conversationId: id,
            file: file,
            type: file.type.split('/')[0],
        });

        if (result.success)
            socket.send('/app/message', {}, JSON.stringify(result.metaData));
        else setError(result.message);

        setLoadingFiles((pre) =>
            pre.filter((e) => e.name !== loadingFile.name)
        );
        URL.revokeObjectURL(loadingFile.url);
    };

    const handleSendImgVideo = (e) => {
        fileInput.forEach((e) => sendImgVideo(e));
        resetFileInput('imgVideoInput');
    };

    return (
        <>
            <Dialog open={previewImgVideoPopUp}>
                <DialogTitle className="!text-[var(--primary)] !text-[2rem] text-center">
                    Send Image/Video
                </DialogTitle>
                <DialogContent
                    sx={{
                        width: '520px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        maxHeight: '420px',
                    }}
                >
                    {previewImgVideoObj.map((e, index) => (
                        <div
                            className={`${
                                previewImgVideoObj.length < 2 ||
                                (index + 1 === previewImgVideoObj.length &&
                                    (index + 1) % 2 !== 0)
                                    ? 'w-[calc(100%-8px)] h-[360px]'
                                    : 'w-[calc(50%-8px)] h-[200px] '
                            } rounded-xl overflow-hidden m-1 border-[2px] border-[var(--primary)] relative bg-[var(--third)]`}
                        >
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    right: '4px',
                                    top: '6px',
                                    backgroundColor: '#cccccc57',
                                    borderRadius: '50%',
                                    zIndex: 9999,

                                    '&:hover': {
                                        backgroundColor: '#cccccc57',
                                    },
                                }}
                                onClick={(e) => {
                                    if (previewImgVideoObj.length === 1)
                                        setPreviewImgVideoPopUp(false);

                                    setFileInput((prev) =>
                                        prev.filter(
                                            (e, index_e) => index_e !== index
                                        )
                                    );
                                    setPreviewImgVideoObj((prev) =>
                                        prev.filter(
                                            (e, index_e) => index_e !== index
                                        )
                                    );
                                }}
                            >
                                <ClearIcon />
                            </IconButton>
                            {e.type === 'image' && (
                                <img
                                    src={e.url}
                                    key={index}
                                    className="w-[100%] h-[100%] "
                                />
                            )}

                            {e.type === 'video' && (
                                <video className="w-[100%] h-[100%]" controls>
                                    <source src={e.url} />
                                </video>
                            )}

                            {e.type === 'audio' && (
                                <audio
                                    className="w-[100%] h-[100%] third-audio"
                                    controls
                                >
                                    <source src={e.url} />
                                </audio>
                            )}

                            {e.type === 'audio' && (
                                <div className="absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%]">
                                    <AudiotrackIcon className="text-[var(--primary)] !text-[6rem]" />
                                </div>
                            )}
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{
                            width: '100%',
                            padding: '20px',
                        }}
                        color="secondary"
                        variant="outlined"
                        onClick={(e) => {
                            previewImgVideoObj.forEach((e) =>
                                URL.revokeObjectURL(e)
                            );
                            resetFileInput('imgVideoInput');
                            setPreviewImgVideoPopUp(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            width: '100%',
                            padding: '20px',
                        }}
                        onClick={() => {
                            handleSendImgVideo();
                            setPreviewImgVideoPopUp(false);
                        }}
                        variant="contained"
                        color="secondary"
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
            <input
                id="imgVideoInput"
                type="file"
                accept="image/*, video/*, audio/*"
                multiple
                onInput={onChangeImgVideoInput}
                hidden
            />
            <Snackbar
                open={error}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => setError(null)}
            >
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
}

export default SendImgVideoMessage;
