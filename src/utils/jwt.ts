export const decodeUserIdFromToken = (token: string): string | null => {
    try {
        const payload = token.split(".")[1];
        if (!payload) {
            return null;
        }

        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(atob(normalized));

        return (
            decoded.nameid ??
            decoded.sub ??
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
            null
        );
    } catch {
        return null;
    }
};
