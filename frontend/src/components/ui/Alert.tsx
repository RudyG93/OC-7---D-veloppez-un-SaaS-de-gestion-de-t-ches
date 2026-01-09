'use client';

interface AlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
    const alertClass = {
        success: 'alert-success',
        error: 'alert-error',
        warning: 'alert-warning',
        info: 'alert-info',
    }[type];

    return (
        <div role="alert" className={`alert ${alertClass}`}>
            <span>{message}</span>
            {onClose && (
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={onClose}
                    aria-label="Fermer"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
