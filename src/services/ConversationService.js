import apiUrl from '../configs/AxiosInstance';
import handleApiResponse from '../utils/handleApiResponse';

class ConversationService {
    static getConversationDetails = async ({ token, id }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.get(`conversation/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
        );
    };

    static getSingleConversationByUser = async ({ token, id }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.get(`conversation/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
        );
    };

    static getAllConversationsOfUser = async ({ token, page, limit = 10 }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.get(
                    `conversation/all?page=${page}&limit=${limit}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );
    };

    static createGroup = async ({ token, name, memberIds }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'conversation',
                    {
                        name: name,
                        addedMembers: memberIds,
                        group: 'true',
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );
    };

    static createSingleConversation = async ({ token, memberIds }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'conversation',
                    {
                        addedMembers: memberIds,
                        group: false,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );
    };

    static updateName = async ({ token, id, name }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.patch(
                    'conversation/rename',
                    {
                        conversationId: id,
                        newName: name,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );
    };

    static updateAvatar = async ({ token, id, avatar }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'conversation/avatar',
                    {
                        avatar,
                        conversationId: id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )
        );
    };

    static removeAvatar = async ({ token, id }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    `conversation/avatar/remove/${id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );
    };

    static addMember = async ({ token, conversationId, userId }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'conversation/add',
                    {
                        conversationId,
                        userId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );
    };

    static removeMember = async ({ token, conversationId, memberId }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'conversation/remove',
                    {
                        conversationId,
                        memberId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );
    };

    static leaveGroup = async ({ token, conversationId, memberId }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'conversation/remove',
                    {
                        conversationId,
                        memberId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );
    };

    static deleteGroup = async ({ token, conversationId }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.delete(`conversation/${conversationId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
        );
    };
}

export default ConversationService;
