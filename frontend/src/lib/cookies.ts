import Cookies from 'js-cookie';

const TOKEN_KEY = 'token';

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
    expires: 7, // 7 jours pour correspondre à l'expiration JWT
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
};

export const cookieUtils = {
    setToken: (token: string) => {
        Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
    },

    getToken: () => {
        return Cookies.get(TOKEN_KEY);
    },

    removeToken: () => {
        Cookies.remove(TOKEN_KEY);
    },
};
