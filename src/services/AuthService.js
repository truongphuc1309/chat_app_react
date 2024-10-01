import apiUrl from '../configs/AxiosInstance';
import handleApiResponse from '../utils/handleApiResponse';

class AuthService {
    static login = async (email, password) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post('auth/login', {
                    email,
                    password,
                })
        );
    };

    static register = async ({ email, name, password }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post('auth/signup', {
                    email,
                    name,
                    password,
                })
        );
    };

    static logOut = async (token) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'auth/logout',
                    {},
                    {
                        headers: {
                            'x-param': token,
                        },
                    }
                )
        );
    };

    static sendVerificationEmail = async (email) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post('auth/send-email', `${email}`, {
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                })
        );
    };

    static verifyEmail = async (token) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'auth/verify',
                    {},
                    {
                        headers: {
                            'X-Referer': token,
                        },
                    }
                )
        );
    };

    static forgotPassword = async (email) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post('auth/forgot-password', `${email}`, {
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                })
        );
    };

    static confirmResetPassword = async (token) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'auth/confirm-reset-password',
                    {},
                    {
                        headers: {
                            'X-Referer': token,
                        },
                    }
                )
        );
    };

    static resetPassword = async ({ token, newPassword, confirmPassword }) => {
        return await handleApiResponse(
            async () =>
                await apiUrl.post(
                    'auth/reset-password',
                    {
                        newPassword,
                        confirmPassword,
                    },
                    {
                        headers: {
                            'X-Referer': token,
                        },
                    }
                )
        );
    };
}

export default AuthService;
