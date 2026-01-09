import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from "@/lib/api";

export function useLogin() {
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
            router.push('/dashboard')
        } else {
            alert('Login failed');
        }
    };

    return { handleSubmit };
}