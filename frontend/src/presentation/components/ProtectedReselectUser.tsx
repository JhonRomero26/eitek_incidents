import { Redirect } from "wouter";
import { useAuth } from "../hooks/useAuth";

interface ProtectedReselectUserProps {
    children: React.ReactNode;
}

/**
 * Componente para proteger evitar la reselección de
 * usuario si ya está autenticado
 */
export function ProtectedReselectUser({ children }: ProtectedReselectUserProps) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Redirect to="/incidents" />;
    }

    return <>{children}</>;
}
