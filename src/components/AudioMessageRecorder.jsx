import { IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { ReactMic } from 'react-mic';
import StopIcon from '@mui/icons-material/Stop';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatTimestamp } from '../utils/formatTime';
import MicIcon from '@mui/icons-material/Mic';
import audioBufferToBlob from 'audiobuffer-to-blob';
import combineAudioBlobsToBuffer from '../utils/combineAudioBlobsToBuffer';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SendIcon from '@mui/icons-material/Send';
import messageService from '../services/MessageService';
import { useParams } from 'react-router-dom';
import WavesurferPlayer from '@wavesurfer/react';
import { useAppContext } from '../contexts/AppContext';

const AudioMessageRecorder = ({ setOpenRecorder, ws, setLoadingFiles }) => {
    const { accessToken } = useAppContext();
    const { id } = useParams();

    const [record, setRecord] = useState(false);
    const [audioBlobs, setAudioBlobs] = useState([]);
    const [timestamp, setTimestamp] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [finalBlob, setFinalBlob] = useState(null);
    const [wavesurfer, setWavesurfer] = useState(null);
    const recordPlayerRef = useRef(null);
    const [waveWidth, setWaveWidth] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startRecording = () => {
        setRecord(true);
        runTimeStamp();
    };

    const stopRecording = () => {
        setRecord(false);
        stopTimeStamp();
    };

    const closeRecorder = () => {
        setAudioBlobs([]);
        setFinalBlob(null);
        setRecord(false);
        setOpenRecorder(false);
    };

    const onStop = (recordedBlob) => {
        setAudioBlobs((prev) => [...prev, recordedBlob.blob]);
    };

    const mergeBlobs = async () => {
        if (audioBlobs.length > 0) {
            const combinedBuffer = await combineAudioBlobsToBuffer(audioBlobs);
            const combinedBlob = audioBufferToBlob(combinedBuffer);
            const url = URL.createObjectURL(combinedBlob);
            setFinalBlob(combinedBlob);
            setAudioUrl(url);
        }
    };

    const runTimeStamp = () => {
        const id = setInterval(() => {
            setTimestamp((prev) => prev + 1); // Cập nhật timestamp mỗi giây
        }, 1000);
        setIntervalId(id);
    };

    const stopTimeStamp = () => {
        clearInterval(intervalId);
        setIntervalId(null); // Dừng interval khi ghi âm ngừng
    };

    const onReady = (ws) => {
        setWavesurfer(ws);
    };

    const handleSendAudioFile = async () => {
        if (finalBlob) {
            setOpenRecorder(false);
            const url = audioUrl;
            setLoadingFiles((pre) => [{ type: 'voice', url }, ...pre]);
            const result = await messageService.sendMessage({
                token: accessToken,
                conversationId: id,
                file: finalBlob,
                type: 'voice',
            });

            if (result.success) {
                ws.send({
                    destination: `/app/message`,
                    message: result.metaData,
                });
            }

            setLoadingFiles((pre) => pre.filter((e) => e?.url !== url));
        }
    };

    useEffect(() => {
        startRecording();
    }, []);

    useEffect(() => {
        if (recordPlayerRef.current) {
            const { offsetWidth } = recordPlayerRef.current;
            setWaveWidth(offsetWidth - 140);
        }
    }, [audioUrl]);

    useEffect(() => {
        mergeBlobs();
    }, [audioBlobs]);

    return (
        <div className="bg-[var(--third)] absolute top-0 bottom-0 right-0 left-0 flex items-center">
            <IconButton
                className="!mr-[10px] !ml-[10px]"
                onClick={closeRecorder}
            >
                <CancelIcon className="!text-[2rem] text-red-500" />
            </IconButton>
            {!audioUrl && (
                <div className="flex items-center flex-1">
                    <ReactMic
                        record={record}
                        className="sound-wave flex-1 !h-[80px]"
                        onStop={onStop}
                        strokeColor="#9188d9"
                        backgroundColor="#ccc7f3"
                        audioBitsPerSecond={240000} // Tăng chất lượng âm thanh
                        echoCancellation={true} // Bỏ tiếng vang
                        autoGainControl={true}
                    />

                    <p className="ml-2 text-[var(--primary)]">
                        {formatTimestamp(timestamp)}
                    </p>
                    <IconButton
                        className="!mr-[10px] !ml-[10px]"
                        onClick={stopRecording}
                    >
                        <StopIcon className="!text-[2rem] text-[var(--primary)]" />
                    </IconButton>
                </div>
            )}

            {audioUrl && (
                <div
                    ref={recordPlayerRef}
                    className="flex w-[100%] items-center p-[10px_20px_10px_0]"
                >
                    <IconButton
                        onClick={(e) => {
                            if (!isPlaying) wavesurfer.play();
                            else wavesurfer.pause();
                        }}
                        className="!w-[40px] !h-[40px] mr-[20px]"
                    >
                        {!isPlaying && (
                            <PlayCircleIcon className="text-[var(--primary)] !text-[2rem]" />
                        )}
                        {isPlaying && (
                            <PauseCircleIcon className="text-[var(--primary)] !text-[2rem]" />
                        )}
                    </IconButton>

                    <WavesurferPlayer
                        width={waveWidth}
                        height={50}
                        waveColor="violet"
                        normalize
                        url={audioUrl}
                        progressColor={'#4236a3'}
                        onReady={onReady}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />

                    <IconButton
                        className="!w-[40px] !h-[40px]"
                        onClick={(e) => {
                            setAudioUrl(null);
                            setTimeout(startRecording, 1);
                        }}
                    >
                        <MicIcon className="text-[var(--primary)] !text-[2rem]" />
                    </IconButton>

                    <IconButton className="ml-6" onClick={handleSendAudioFile}>
                        <SendIcon className="text-[var(--primary)] !text-[2rem]" />
                    </IconButton>
                </div>
            )}
        </div>
    );
};

export default AudioMessageRecorder;
