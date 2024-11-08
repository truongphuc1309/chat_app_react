const tranferFileSize = (size) => {
    if (size >= 1000000) return `${Math.round(size / 1000000)} Mb`;

    return `${Math.round((size / 1000) * 10) / 10} Kb`;
};
export { tranferFileSize };
