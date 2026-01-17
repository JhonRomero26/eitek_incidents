import { Redirect } from "wouter";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect to="/" />;
    }

    return <>{children}</>;
}
