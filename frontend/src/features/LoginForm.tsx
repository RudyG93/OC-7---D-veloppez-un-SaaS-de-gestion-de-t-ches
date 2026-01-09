'use client';
import { useLogin } from '@/hooks/useLogin';

export default function LoginForm() {
    const { handleSubmit } = useLogin();

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" required />
            <input
                type="password"
                name="password"
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
    );
}