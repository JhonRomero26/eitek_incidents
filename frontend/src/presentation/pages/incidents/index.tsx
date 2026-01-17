import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useIncidents } from "../../hooks/useIncidents";
import { useAssignees } from "../../hooks/useAssignees";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "../../../shared/stores/toastStore";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Loader2, Plus, Search, Eye, UserPlus, RefreshCw } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Abierto",
  ASSIGNED: "Asignado",
  IN_PROGRESS: "En Progreso",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-yellow-100 text-yellow-800 border-yellow-300",
  ASSIGNED: "bg-blue-100 text-blue-800 border-blue-300",
  IN_PROGRESS: "bg-purple-100 text-purple-800 border-purple-300",
  RESOLVED: "bg-green-100 text-green-800 border-green-300",
  CLOSED: "bg-gray-100 text-gray-800 border-gray-300",
};

export default function IncidentsPage() {
  const { incidents, loading, error, createIncident, assignIncident, loadIncidents } = useIncidents();
  const { assignees } = useAssignees();
  const { currentUser } = useAuth();

  // Permission check: Only ADMIN and SUPPORT can modify incidents
  const canModifyIncidents = currentUser?.role === "ADMIN" || currentUser?.role === "SUPPORT";
  
  // Check if incident can be reassigned (only when not started: OPEN or ASSIGNED)
  const canReassign = (status: string) => {
    return canModifyIncidents && (status === "OPEN" || status === "ASSIGNED");
  };

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Form state for new incident
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for assignment
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<number | "">("");

  // Filter incidents based on user role and search/status filters
  const filteredIncidents = useMemo(() => {
    let filtered = incidents;

    // Non-admin/support users can only see incidents assigned to them
    if (!canModifyIncidents && currentUser) {
      filtered = filtered.filter((i) => i.assignee?.id === currentUser.id);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(term) ||
          i.description.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    return filtered;
  }, [incidents, searchTerm, statusFilter, canModifyIncidents, currentUser]);

  // Stats - based on filtered incidents for consistency
  const userIncidents = useMemo(() => {
    if (!canModifyIncidents && currentUser) {
      return incidents.filter((i) => i.assignee?.id === currentUser.id);
    }
    return incidents;
  }, [incidents, canModifyIncidents, currentUser]);

  const stats = useMemo(() => ({
    total: userIncidents.length,
    open: userIncidents.filter((i) => i.status === "OPEN").length,
    assigned: userIncidents.filter((i) => i.status === "ASSIGNED").length,
    resolved: userIncidents.filter((i) => i.status === "RESOLVED").length,
  }), [userIncidents]);

  const handleCreateIncident = async () => {
    if (!newTitle.trim()) {
      toast.warning("Campo requerido", "El título es obligatorio");
      return;
    }

    setIsSubmitting(true);
    try {
      await createIncident({
        title: newTitle.trim(),
        description: newDescription.trim(),
      });
      setNewTitle("");
      setNewDescription("");
      setShowCreateDialog(false);
      toast.success("Incidencia creada", "La incidencia se ha registrado correctamente");
    } catch (err) {
      console.error("Error creating incident:", err);
      toast.error("Error al crear", err instanceof Error ? err.message : "No se pudo crear la incidencia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignIncident = async () => {
    if (!selectedIncidentId || !selectedAssigneeId) {
      toast.warning("Campo requerido", "Seleccione un responsable");
      return;
    }

    setIsSubmitting(true);
    try {
      await assignIncident(selectedIncidentId, Number(selectedAssigneeId), currentUser?.id);
      setShowAssignDialog(false);
      setSelectedIncidentId(null);
      setSelectedAssigneeId("");
      toast.success("Incidencia asignada", "El responsable ha sido asignado correctamente");
    } catch (err) {
      console.error("Error assigning incident:", err);
      toast.error("Error al asignar", err instanceof Error ? err.message : "No se pudo asignar la incidencia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAssignDialog = (incidentId: number) => {
    setSelectedIncidentId(incidentId);
    setSelectedAssigneeId("");
    setShowAssignDialog(true);
  };

  const handleRefresh = async () => {
    toast.info("Actualizando", "Cargando incidencias...");
    await loadIncidents();
    toast.success("Actualizado", "Lista de incidencias actualizada");
  };

  if (loading && incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500">Cargando incidencias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Incidencias
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestiona las incidencias operativas del sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          {canModifyIncidents && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Incidencia
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
            <p className="text-xs text-gray-500">Abiertas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
            <p className="text-xs text-gray-500">Asignadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-gray-500">Resueltas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="ALL">Todos los estados</option>
              <option value="OPEN">Abierto</option>
              <option value="ASSIGNED">Asignado</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="RESOLVED">Resuelto</option>
              <option value="CLOSED">Cerrado</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No se encontraron incidencias</p>
            </CardContent>
          </Card>
        ) : (
          filteredIncidents.map((incident) => (
            <Card key={incident.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg truncate">
                        {incident.title}
                      </h3>
                      <Badge className={STATUS_COLORS[incident.status]}>
                        {STATUS_LABELS[incident.status] || incident.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {incident.description || "Sin descripción"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>ID: #{incident.id}</span>
                      <span>
                        Creado: {new Date(incident.createdAt).toLocaleDateString()}
                      </span>
                      {incident.assignee && (
                        <span>Asignado a: {incident.assignee.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canReassign(incident.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAssignDialog(incident.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        {incident.status === "OPEN" ? "Asignar" : "Reasignar"}
                      </Button>
                    )}
                    <Link href={`/incidents/${incident.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Incident Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nueva Incidencia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ingrese el título de la incidencia"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describa la incidencia en detalle"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateIncident}
                disabled={!newTitle.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Incidencia"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Incident Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Incidencia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="assignee">Seleccionar Responsable</Label>
              <Select
                id="assignee"
                value={selectedAssigneeId}
                onChange={(e) => setSelectedAssigneeId(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">Seleccione un responsable</option>
                {assignees
                  .filter((a) => a.isActive)
                  .map((assignee) => (
                    <option key={assignee.id} value={assignee.id}>
                      {assignee.name} ({assignee.role})
                    </option>
                  ))}
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAssignDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAssignIncident}
                disabled={!selectedAssigneeId || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Asignando...
                  </>
                ) : (
                  "Asignar"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
