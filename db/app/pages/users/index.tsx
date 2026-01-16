import { Card } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Plus, Search } from "lucide-react";

const users = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@eitek.com",
    role: "Administrador",
    isActive: true,
  },
  {
    id: 2,
    firstName: "María",
    lastName: "García",
    email: "maria.garcia@eitek.com",
    role: "Técnico",
    isActive: true,
  },
  {
    id: 3,
    firstName: "Carlos",
    lastName: "López",
    email: "carlos.lopez@eitek.com",
    role: "Operaciones",
    isActive: true,
  },
  {
    id: 4,
    firstName: "Ana",
    lastName: "Martínez",
    email: "ana.martinez@eitek.com",
    role: "Soporte",
    isActive: false,
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Usuarios
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`} />
                <AvatarFallback>
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                  <Badge
                    className={
                      user.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    }
                  >
                    {user.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Editar
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Ver
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
