export const getInitials = (name: string, email?: string) => {
    if (name) {
        const names = name.split(' ');
        const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
        return initials.slice(0, 2);
    }
    if (email) {
        return email.substring(0, 2).toUpperCase();
    }
    return '';
}