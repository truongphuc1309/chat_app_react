import apiUrl from '../configs/AxiosInstance';
import handleApiResponse from '../utils/handleApiResponse';

class MessageService {
    static sendMessage = async ({
        token,
        conversationId,
        content,
        file,
        type = 'text',
    }) => {
        const encoder = new TextEncoder(); // Tạo một TextEncoder để mã hóa
        const byteArray = encoder.encode(content); // Chuyển đổi đoạn văn bản thành byte

        // Chuyển đổi byte array thành Base64 để dễ dàng gửi qua mạng
        const base64Message = btoa(String.fromCharCode(...byteArray));

        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'message',
                    {
                        conversationId,
                        content: base64Message,
                        type,
                        file,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data;charset=UTF-8',
                        },
                    }
                )
        );
    };

    static getAllMessagesOfConversation = async ({
        token,
        conversationId,
        page,
        limit,
    }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.get(
                    `message/all/${conversationId}?page=${page}&limit=${limit}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );
    };

    static getLastMessageOfConversation = async ({ token, conversationId }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.get(`message/last/${conversationId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
        );
    };

    static deleteMessage = async ({ token, id }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.delete(`message/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
        );
    };

    static readLastMessage = async ({ token, messageId }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    `message/last-read/${messageId}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );
    };
}

export default MessageService;
