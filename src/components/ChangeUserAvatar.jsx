import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';
import userService from '../services/UserService';
import resetFileInput from '../utils/resetFileInput';
import { useAppContext } from '../contexts/AppContext';

function ChangeUserAvatar({ open, setStatus, reloadAvt, haveAvt }) {
    const { accessToken } = useAppContext();
    const [previewAvt, setPreviewAvt] = useState('');
    const [openPreviewAvtPopUp, setOpenPreviewAvtPopUp] = useState(false);
    const [avtFile, setAvtFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);

    const handleUploadImg = () => {
        const fileInput = document.getElementById('userAvatarInput');
        fileInput.click();
    };

    const handleChangeAvatar = async () => {
        setLoading(true);
        const result = await userService.updateAvatar({
            token: accessToken,
            avatar: avtFile,
        });

        if (result.success) reloadAvt(result.metaData.avatar);
        URL.revokeObjectURL(previewAvt);
        setLoading(false);
        setOpenPreviewAvtPopUp(false);
        resetFileInput('userAvatarInput');
    };

    const handleRemoveAvatar = async () => {
        setRemoveLoading(true);
        const result = await userService.removeAvatar({
            token: accessToken,
        });

        if (result.success) {
            setRemoveLoading(false);
            reloadAvt(null);
            setStatus(false);
        }
    };

    return (
        <div>
            <input
                id="userAvatarInput"
                type="file"
                accept="image/*"
                onChange={(e) => {
                    setPreviewAvt(URL.createObjectURL(e.target.files[0]));
                    setAvtFile(e.target.files[0]);
                    setStatus(false);
                    setOpenPreviewAvtPopUp(true);
                }}
                hidden
            />
            <Dialog
                open={open}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent
                    sx={{
                        minWidth: '400px',
                        padding: '40px',
                    }}
                >
                    <Button
                        sx={{
                            display: 'block',
                            width: '100%',
                            padding: '20px',
                            marginBottom: '20px',
                        }}
                        onClick={handleUploadImg}
                        variant="contained"
                        color="secondary"
                    >
                        Change avatar
                    </Button>
                    {haveAvt && (
                        <Button
                            sx={{
                                display: 'flex',
                                width: '100%',
                                padding: '20px',
                                marginBottom: '20px',
                            }}
                            color="error"
                            variant="contained"
                            onClick={handleRemoveAvatar}
                        >
                            {removeLoading && (
                                <CircularProgress
                                    color="inherit"
                                    className="mr-4"
                                />
                            )}
                            Remove avatar
                        </Button>
                    )}
                    <Button
                        sx={{
                            display: 'block',
                            width: '100%',
                            padding: '20px',
                        }}
                        color="secondary"
                        variant="text"
                        onClick={(e) => setStatus(false)}
                    >
                        Cancel
                    </Button>
                </DialogContent>
            </Dialog>

            <Dialog
                open={openPreviewAvtPopUp}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent
                    sx={{
                        minWidth: '400px',
                        padding: '40px',
                    }}
                >
                    <img
                        src={previewAvt || ''}
                        className="max-h-[500px] max-w-[500px]"
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        padding: '20px',
                    }}
                >
                    <Button
                        sx={{
                            width: '100%',
                            padding: '20px',
                        }}
                        color="secondary"
                        variant="outlined"
                        onClick={(e) => {
                            URL.revokeObjectURL(previewAvt);
                            setOpenPreviewAvtPopUp(false);
                            resetFileInput('userAvatarInput');
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            width: '100%',
                            padding: '20px',
                        }}
                        onClick={handleChangeAvatar}
                        variant="contained"
                        color="secondary"
                    >
                        {loading && (
                            <CircularProgress
                                color="inherit"
                                className="mr-4"
                            />
                        )}
                        Change
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ChangeUserAvatar;
