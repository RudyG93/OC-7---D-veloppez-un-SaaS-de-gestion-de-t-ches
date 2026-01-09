'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { loginApi, registerApi, getProfileApi } from '@/api/auth';
import { cookieUtils } from '@/lib/cookies';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

export const authKeys = {
    profile: ['auth', 'profile'] as const,
};

export function useLoginMutation() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
        onSuccess: (data) => {
            cookieUtils.setToken(data.data.token);
            queryClient.setQueryData(authKeys.profile, data.data.user);
            router.push('/dashboard');
            router.refresh();
        },
    });
}

export function useRegisterMutation() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (credentials: RegisterCredentials) => registerApi(credentials),
        onSuccess: (data) => {
            cookieUtils.setToken(data.data.token);
            queryClient.setQueryData(authKeys.profile, data.data.user);
            router.push('/dashboard');
            router.refresh();
        },
    });
}

export function useProfile() {
    const token = cookieUtils.getToken();

    return useQuery({
        queryKey: authKeys.profile,
        queryFn: getProfileApi,
        enabled: !!token,
        select: (data) => data.data.user,
        retry: false,
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return () => {
        cookieUtils.removeToken();
        queryClient.clear();
        router.push('/login');
        router.refresh();
    };
}
