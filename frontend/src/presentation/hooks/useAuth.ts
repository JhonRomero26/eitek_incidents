import { useAuthStore } from "../../shared/stores/authStore";

/**
 * Hook para acceder al usuario autenticado actual
 */
export function useAuth() {
    const { currentUser, isAuthenticated, setCurrentUser, logout } = useAuthStore();

    return {
        currentUser,
        isAuthenticated,
        login: setCurrentUser,
        logout,
    };
}
