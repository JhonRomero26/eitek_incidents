import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAssignees } from "../hooks/useAssignees";
import { useAuthStore } from "../../shared/stores/authStore";
import { Assignee } from "../../core/domain/Assignee";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

export function SelectUserPage() {
    const [, setLocation] = useLocation();
    const { assignees, loading, loadActiveAssignees } = useAssignees();
    const { setCurrentUser } = useAuthStore();
    const [selectedUser, setSelectedUser] = useState<number | null>(null);

    useEffect(() => {
        loadActiveAssignees();
    }, []);

    const handleSelectUser = (assignee: Assignee) => {
        setSelectedUser(assignee.id);
        
        // Guardar en el store (automáticamente se guarda en localStorage)
        setCurrentUser(assignee);

        // Pequeño delay para feedback visual
        setTimeout(() => {
            setLocation("/incidents");
        }, 300);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            ADMIN: "bg-red-100 text-red-800",
            SUPPORT: "bg-blue-100 text-blue-800",
            TECHNICAL: "bg-green-100 text-green-800",
            OPERATOR: "bg-yellow-100 text-yellow-800",
        };
        return colors[role] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <title>Seleccionar Usuario - Sistema de Incidencias</title>
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Sistema de Incidencias
                    </h1>
                    <p className="text-gray-600">
                        Selecciona un usuario para continuar
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assignees.map((assignee) => (
                        <Card
                            key={assignee.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                                selectedUser === assignee.id
                                    ? "ring-2 ring-blue-500 shadow-lg"
                                    : ""
                            }`}
                            onClick={() => handleSelectUser(assignee)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                            {getInitials(assignee.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">
                                            {assignee.name}
                                        </CardTitle>
                                        <CardDescription>
                                            ID: {assignee.id}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                                            assignee.role.toString()
                                        )}`}
                                    >
                                        {assignee.role}
                                    </span>
                                    
                                    <div className="flex flex-col items-end text-xs text-gray-500">
                                        {assignee.canAssignIncidents() && (
                                            <span className="text-blue-600">✓ Puede asignar</span>
                                        )}
                                        {assignee.canDeleteIncidents() && (
                                            <span className="text-red-600">✓ Puede eliminar</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {assignees.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            No hay usuarios activos disponibles
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
