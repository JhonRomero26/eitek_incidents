import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { AlertCircle, Plus, Search, Loader2 } from "lucide-react";
import { useIncidents } from "@/presentation/hooks/useIncidents";

const statusColors = {
  OPEN: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  ASSIGNED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  RESOLVED: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const statusLabels = {
  OPEN: "Abierta",
  ASSIGNED: "Asignada",
  RESOLVED: "Resuelta",
};

export default function IncidentsPage() {
  const { incidents, loading, error, createIncident } = useIncidents();
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    priority: "MEDIA" as "BAJA" | "MEDIA" | "ALTA",
  });

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateIncident = async () => {
    if (!newIncident.title || !newIncident.description) return;
    
    await createIncident({
      title: newIncident.title,
      description: newIncident.description,
      priority: newIncident.priority,
    });
    
    setNewIncident({ title: "", description: "", priority: "MEDIA" });
    setShowNewIncident(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Incidencias
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestiona todas las incidencias del sistema
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowNewIncident(!showNewIncident)}>
          <Plus className="h-4 w-4" />
          Nueva Incidencia
        </Button>
      </div>

      {/* New Incident Form */}
      {showNewIncident && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Crear Nueva Incidencia</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newIncident.title}
                onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                placeholder="Título de la incidencia"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                placeholder="Descripción detallada"
              />
            </div>
            <div>
              <Label htmlFor="priority">Prioridad</Label>
              <select
                id="priority"
                value={newIncident.priority}
                onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value as any })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateIncident}>Crear</Button>
              <Button variant="outline" onClick={() => setShowNewIncident(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar incidencias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
      </Card>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron incidencias
            </p>
          </Card>
        ) : (
          filteredIncidents.map((incident) => (
            <Card key={incident.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {incident.title}
                      </h3>
                      <Badge
                        className={statusColors[incident.status as keyof typeof statusColors]}
                      >
                        {statusLabels[incident.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {incident.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>ID: #{incident.id}</span>
                      <span>•</span>
                      <span>Asignado a: {incident.assigneeName || "Sin asignar"}</span>
                      <span>•</span>
                      <span className={`font-medium ${
                        incident.priority === "ALTA"
                          ? "text-red-600 dark:text-red-400"
                          : incident.priority === "MEDIA"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}>
                        Prioridad {incident.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/dashboard/incidents/${incident.id}`}>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </Link>
              </div>
            </Card>
        ))}
      </div>
    </div>
  );
}
