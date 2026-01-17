import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Assignee } from "../../core/domain/Assignee";

interface AuthState {
    currentUser: Assignee | null;
    setCurrentUser: (user: Assignee) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            currentUser: null,
            isAuthenticated: false,

            setCurrentUser: (user: Assignee) => {
                // Guardar en localStorage
                localStorage.setItem("currentUser", JSON.stringify({
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }));

                set({ currentUser: user, isAuthenticated: true });
            },

            logout: () => {
                // Limpiar localStorage
                localStorage.removeItem("currentUser");
                set({ currentUser: null, isAuthenticated: false });
            },
        }),
        {
            name: "auth-storage", // Nombre en localStorage
            partialize: (state) => ({
                currentUser: state.currentUser,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
