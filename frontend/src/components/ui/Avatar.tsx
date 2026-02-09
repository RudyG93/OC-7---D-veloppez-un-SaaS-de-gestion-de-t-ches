'use client';

import { getInitials } from '@/lib/utils';

/**
 * Tailles disponibles pour l'avatar
 */
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Variantes de couleur pour l'avatar
 */
type AvatarVariant = 'gray' | 'orange' | 'light';

/**
 * Props du composant Avatar
 */
interface AvatarProps {
    /** Nom de l'utilisateur (pour générer les initiales) */
    name?: string | null;
    /** Email de l'utilisateur (fallback pour les initiales) */
    email?: string;
    /** Taille de l'avatar */
    size?: AvatarSize;
    /** Variante de couleur de fond */
    variant?: AvatarVariant;
    /** Classe CSS additionnelle */
    className?: string;
}

/**
 * Classes de taille pour l'avatar
 */
const sizeClasses: Record<AvatarSize, { container: string; text: string }> = {
    xs: { container: 'w-5 h-5', text: 'text-[10px]' },
    sm: { container: 'w-6 h-6', text: 'text-[10px]' },
    md: { container: 'w-8 h-8', text: 'text-xs' },
    lg: { container: 'w-10 h-10', text: 'text-sm' },
    xl: { container: 'w-12 h-12', text: 'text-xs' },
};

/**
 * Classes de couleur pour l'avatar
 */
const variantClasses: Record<AvatarVariant, string> = {
    gray: 'bg-primary-grey',
    orange: 'bg-primary text-white',
    light: 'bg-primary-light text-avatar',
};

/**
 * Composant Avatar pour afficher un utilisateur avec ses initiales
 *
 * @example
 * // Avatar avec initiales
 * <Avatar name="John Doe" email="john@example.com" />
 *
 * @example
 * // Avatar orange (propriétaire)
 * <Avatar name="John Doe" variant="orange" size="lg" />
 *
 * @example
 * // Groupe d'avatars
 * <div className="flex -space-x-2">
 *   <Avatar name="User 1" />
 *   <Avatar name="User 2" />
 * </div>
 */
export default function Avatar({
    name,
    email,
    size = 'md',
    variant = 'gray',
    className = '',
}: AvatarProps) {
    const sizeStyle = sizeClasses[size];
    const initials = getInitials(name || '', email);
    const accessibleName = name || email || 'Utilisateur';

    return (
        <div
            className={`${sizeStyle.container} rounded-full flex items-center justify-center font-medium ${sizeStyle.text} ${variantClasses[variant]} ${className}`}
            title={accessibleName}
            aria-label={accessibleName}
        >
            {initials}
        </div>
    );
}

/**
 * Props pour le groupe d'avatars
 */
interface AvatarGroupProps {
    /** Liste des utilisateurs à afficher */
    users: Array<{ name?: string | null; email: string }>;
    /** Nombre maximum d'avatars à afficher */
    max?: number;
    /** Taille des avatars */
    size?: AvatarSize;
    /** Classe CSS additionnelle */
    className?: string;
}

/**
 * Composant AvatarGroup pour afficher plusieurs avatars empilés
 *
 * @example
 * <AvatarGroup
 *   users={members}
 *   max={3}
 *   size="sm"
 * />
 */
export function AvatarGroup({
    users,
    max = 4,
    size = 'md',
    className = '',
}: AvatarGroupProps) {
    const visibleUsers = users.slice(0, max);
    const remainingCount = users.length - max;
    const sizeStyle = sizeClasses[size];

    return (
        <div className={`flex -space-x-2 ${className}`}>
            {visibleUsers.map((user, index) => (
                <Avatar
                    key={user.email || index}
                    name={user.name}
                    email={user.email}
                    size={size}
                    className="ring-2 ring-white"
                />
            ))}
            {remainingCount > 0 && (
                <div
                    className={`${sizeStyle.container} rounded-full bg-gray-100 flex items-center justify-center font-medium ${sizeStyle.text} text-gray-500 ring-2 ring-white`}
                    aria-label={`${remainingCount} autres membres`}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}
