function upLoadFile({ callApi, setAvatar }) {
    let cloudinary = null;
    let widget = null;
    cloudinary = window.cloudinary;
    widget = cloudinary.createUploadWidget(
        {
            cloudName: 'diy8dw4cd',
            uploadPreset: 'duy1hjib',
        },
        async (error, result) => {
            if (result.info.url) {
                const uploadResult = await callApi(result.info.url);
                if (uploadResult.success) {
                    setAvatar(result.info.url);
                }
            }
        }
    );
    widget.open();
}

export default upLoadFile;
