import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Administra la configuración del sistema
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Configuración General
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Nombre del Sitio</Label>
              <Input id="site-name" defaultValue="Eitek Incidencias" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email de Administrador</Label>
              <Input
                id="admin-email"
                type="email"
                defaultValue="admin@eitek.com"
              />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex justify-end">
            <Button>Guardar Cambios</Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notificaciones
          </h3>
          <div className="space-y-4">
            {[
              "Notificar cuando se cree una nueva incidencia",
              "Notificar cuando se asigne una incidencia",
              "Notificar cuando se resuelva una incidencia",
            ].map((label, i) => (
              <div key={i} className="flex items-center justify-between">
                <Label htmlFor={`notif-${i}`} className="cursor-pointer">
                  {label}
                </Label>
                <input
                  id={`notif-${i}`}
                  type="checkbox"
                  defaultChecked={i === 0}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="flex justify-end">
            <Button>Guardar Cambios</Button>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Seguridad
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex justify-end">
            <Button>Cambiar Contraseña</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
