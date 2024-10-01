const handleApiResponse = async (fn) => {
    let status = true;
    let result = null;

    try {
        const response = await fn();

        result = response.data;
    } catch (e) {
        result = e.response.data;
        status = false;
    }

    return {
        success: status,
        ...result,
    };
};

export default handleApiResponse;
