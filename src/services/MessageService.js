import apiUrl from '../configs/AxiosInstance';
import handleApiResponse from '../utils/handleApiResponse';

class MessageService {
    static sendMessage = async ({ token, conversationId, content }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'message',
                    {
                        conversationId,
                        content,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
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
}

export default MessageService;
