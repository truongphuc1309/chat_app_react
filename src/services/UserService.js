import apiUrl from '../configs/AxiosInstance';
import handleApiResponse from '../utils/handleApiResponse';

class UserService {
    static getProfile = async (token) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.get('user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
        );
    };

    static search = async ({ token, key }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.get(`user/search/${key}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
        );
    };

    static updateName = async ({ token, name }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.patch(
                    'user/update',
                    {
                        name,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
        );
    };

    static updateAvatar = async ({ token, avatar }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'user/avatar',
                    {
                        avatar,
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

    static removeAvatar = async ({ token }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'user/avatar/remove',
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

export default UserService;
