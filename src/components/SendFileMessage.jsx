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
import React, { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import messageService from '../services/MessageService';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { tranferFileSize } from '../utils/tranferFileSize';
import resetFileInput from '../utils/resetFileInput';

function SendFileMessage({ ws, setLoadingFiles }) {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const { id } = useParams();

    const [previewFilePopUp, setPreviewFilePopUp] = useState(false);
    const [previewFileObj, setPreviewFileObj] = useState([]);
    const [fileInput, setFileInput] = useState([]);
    const [error, setError] = useState(null);

    const onChangeImgVideoInput = (e) => {
        console.log(e.target.files);
        const fileArray = Array.from(e.target.files);
        const list = [];
        fileArray.forEach((e) => {
            const type = e.type.split('/')[0];
            list.push({ type: type, name: e.name, size: e.size });
        });
        setPreviewFileObj(list);
        setFileInput(fileArray);
        setPreviewFilePopUp(true);
        console.log('url', previewFileObj);
    };

    const sendFile = async (file) => {
        const loadingFile = previewFileObj.find((e) => e.name === file.name);
        setLoadingFiles((pre) => [loadingFile, ...pre]);

        const result = await messageService.sendMessage({
            token: cookies.token,
            conversationId: id,
            file: file,
            type: 'file',
        });
        if (result.success) {
            ws.send({
                destination: `/app/message`,
                message: result.metaData,
            });
        } else setError(result.message);

        setLoadingFiles((pre) =>
            pre.filter((e) => e.name !== loadingFile.name)
        );
        URL.revokeObjectURL(loadingFile.url);
    };

    const handleSendFile = async (e) => {
        fileInput.forEach((e) => sendFile(e));
        resetFileInput('fileInput');
    };

    return (
        <>
            <Dialog open={previewFilePopUp}>
                <DialogTitle className="!text-[var(--primary)] !text-[2rem] text-center">
                    Send File
                </DialogTitle>
                <DialogContent
                    sx={{
                        width: '520px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        maxHeight: '400px',
                    }}
                >
                    {previewFileObj.map((e, index) => (
                        <div className="h-[120px] bg-[var(--primary)] w-[100%] rounded-xl mb-2 flex items-center p-[10px_20px] relative">
                            <div className="w-[24%] relative">
                                <InsertDriveFileIcon className="text-purple-500 !text-[6rem]" />
                                <p className="absolute top-[50%] right-[50%] translate-x-[50%] text-[1.2rem] text-[var(--secondary)]">
                                    {
                                        e.name.split('.')[
                                            e.name.split('.').length - 1
                                        ]
                                    }
                                </p>
                            </div>
                            <div className="w-[60%]">
                                <p className="text-[1.2rem] text-blue-900 w-[100%] truncate">
                                    {e.name}
                                </p>
                                <p className="text-[var(--third)]">
                                    {tranferFileSize(e.size)}
                                </p>
                            </div>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    right: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: '#cccccc57',
                                    borderRadius: '50%',

                                    '&:hover': {
                                        backgroundColor: '#cccccc57',
                                    },
                                }}
                                onClick={(e) => {
                                    if (previewFileObj.length === 1)
                                        setPreviewFilePopUp(false);

                                    setFileInput((prev) =>
                                        prev.filter(
                                            (e, index_e) => index_e !== index
                                        )
                                    );
                                    setPreviewFileObj((prev) =>
                                        prev.filter(
                                            (e, index_e) => index_e !== index
                                        )
                                    );
                                }}
                            >
                                <DeleteOutlineIcon className="!text-red-500" />
                            </IconButton>
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
                            previewFileObj.forEach((e) =>
                                URL.revokeObjectURL(e)
                            );
                            resetFileInput('fileInput');
                            setPreviewFilePopUp(false);
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
                            handleSendFile();
                            setPreviewFilePopUp(false);
                        }}
                        variant="contained"
                        color="secondary"
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
            <input
                id="fileInput"
                type="file"
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

export default SendFileMessage;
