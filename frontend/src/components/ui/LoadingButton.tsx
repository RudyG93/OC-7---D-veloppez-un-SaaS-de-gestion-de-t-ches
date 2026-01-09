'use client';

interface LoadingButtonProps {
    type?: 'button' | 'submit';
    isLoading: boolean;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
}

export default function LoadingButton({
    type = 'button',
    isLoading,
    children,
    className = 'btn-primary',
    disabled = false,
    onClick,
}: LoadingButtonProps) {
    return (
        <button
            type={type}
            className={`btn ${className} w-full`}
            disabled={disabled || isLoading}
            onClick={onClick}
        >
            {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
            ) : (
                children
            )}
        </button>
    );
}
