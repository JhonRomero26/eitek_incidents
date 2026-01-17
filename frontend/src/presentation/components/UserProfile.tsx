import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "./ui/avatar";

/**
 * Componente para mostrar información del usuario actual y permitir logout
 */
export function UserProfile() {
    const { currentUser, logout } = useAuth();
    const [, setLocation] = useLocation();

    if (!currentUser) return null;

    const handleLogout = () => {
        logout();
        setLocation("/select-user");
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border">
            <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {getInitials(currentUser.name)}
                </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser.name}
                </p>
                <p className="text-xs text-gray-500">
                    {currentUser.role}
                </p>
            </div>

            <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cerrar sesión"
            >
                <LogOut size={18} />
            </button>
        </div>
    );
}
