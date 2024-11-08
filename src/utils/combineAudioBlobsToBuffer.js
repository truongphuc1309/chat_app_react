const combineAudioBlobsToBuffer = async (blobs) => {
    const audioContext = new window.AudioContext();

    // Đọc và giải mã từng blob thành AudioBuffer
    const audioBuffers = await Promise.all(
        blobs.map((blob) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    audioContext.decodeAudioData(reader.result, (buffer) => {
                        resolve(buffer);
                    });
                };
                reader.readAsArrayBuffer(blob);
            });
        })
    );

    // Tính tổng độ dài
    const totalLength = audioBuffers.reduce(
        (acc, buffer) => acc + buffer.length,
        0
    );
    const combinedBuffer = audioContext.createBuffer(
        1,
        totalLength,
        audioContext.sampleRate
    );
    let offset = 0;

    // Sao chép từng buffer vào combinedBuffer
    audioBuffers.forEach((buffer) => {
        combinedBuffer.copyToChannel(buffer.getChannelData(0), 0, offset);
        offset += buffer.length;
    });

    // Trả về AudioBuffer đã được kết hợp
    return combinedBuffer;
};

export default combineAudioBlobsToBuffer;
