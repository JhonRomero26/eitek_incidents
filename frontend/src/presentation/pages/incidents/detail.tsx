import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useIncidents } from "../../hooks/useIncidents";
import { useAssignees } from "../../hooks/useAssignees";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "../../../shared/stores/toastStore";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Loader2, ArrowLeft, User, Calendar, Clock, UserPlus, Play, CheckCircle, Edit } from "lucide-react";
import type { Incident } from "../../../core/domain/Incidents";

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Abierto",
  ASSIGNED: "Asignado",
  IN_PROGRESS: "En Progreso",
  RESOLVED: "Resuelto",
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-yellow-100 text-yellow-800 border-yellow-300",
  ASSIGNED: "bg-blue-100 text-blue-800 border-blue-300",
  IN_PROGRESS: "bg-purple-100 text-purple-800 border-purple-300",
  RESOLVED: "bg-green-100 text-green-800 border-green-300",
};

// Valid status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  OPEN: ["ASSIGNED"],
  ASSIGNED: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: [],
};

export default function IncidentDetailPage() {
  const [, params] = useRoute("/incidents/:id");
  const incidentId = params?.id ? parseInt(params.id) : null;

  const { incidents, loading, updateIncident, assignIncident, loadIncidents } = useIncidents();
  const { assignees } = useAssignees();
  const { currentUser } = useAuth();

  // Permission check: Only ADMIN and SUPPORT can modify incidents
  const canModifyIncidents = currentUser?.role === "ADMIN" || currentUser?.role === "SUPPORT";
  
  // Check if incident can be reassigned (only when not started: OPEN or ASSIGNED)
  const canReassign = (status: string) => {
    return canModifyIncidents && (status === "OPEN" || status === "ASSIGNED");
  };

  const [incident, setIncident] = useState<Incident | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (incidentId && incidents.length > 0) {
      const found = incidents.find((i) => i.id === incidentId);
      setIncident(found || null);
    }
  }, [incidentId, incidents]);

  useEffect(() => {
    if (incidents.length === 0) {
      loadIncidents();
    }
  }, [incidents.length, loadIncidents]);

  const handleAssign = async () => {
    if (!incident || !selectedAssigneeId) {
      toast.warning("Campo requerido", "Seleccione un responsable");
      return;
    }

    setIsSubmitting(true);
    try {
      await assignIncident(incident.id, Number(selectedAssigneeId), currentUser?.id);
      setShowAssignDialog(false);
      setSelectedAssigneeId("");
      toast.success("Incidencia asignada", "El responsable ha sido asignado correctamente");
    } catch (err) {
      console.error("Error assigning incident:", err);
      toast.error("Error al asignar", err instanceof Error ? err.message : "No se pudo asignar la incidencia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = () => {
    if (incident) {
      setEditTitle(incident.title);
      setEditDescription(incident.description || "");
      setShowEditDialog(true);
    }
  };

  const handleEditIncident = async () => {
    if (!incident) return;
    
    if (!editTitle.trim()) {
      toast.warning("Campo requerido", "El título es obligatorio");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateIncident(incident.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setShowEditDialog(false);
      toast.success("Incidencia actualizada", "Los cambios se han guardado correctamente");
    } catch (err) {
      console.error("Error updating incident:", err);
      toast.error("Error al actualizar", err instanceof Error ? err.message : "No se pudo actualizar la incidencia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeStatus = async (newStatus: string) => {
    if (!incident) return;

    setIsSubmitting(true);
    try {
      await updateIncident(incident.id, { status: newStatus });
      toast.success("Estado actualizado", `La incidencia ahora está ${STATUS_LABELS[newStatus]}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Error al actualizar", err instanceof Error ? err.message : "No se pudo cambiar el estado");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNextStatus = () => {
    if (!incident) return null;
    const transitions = VALID_TRANSITIONS[incident.status] || [];
    return transitions[0] || null;
  };

  const getNextStatusButton = () => {
    const nextStatus = getNextStatus();
    if (!nextStatus) return null;

    const buttonConfig: Record<string, { label: string; icon: typeof Play }> = {
      ASSIGNED: { label: "Asignar", icon: UserPlus },
      IN_PROGRESS: { label: "Iniciar Trabajo", icon: Play },
      RESOLVED: { label: "Marcar Resuelto", icon: CheckCircle },
    };

    return buttonConfig[nextStatus];
  };

  if (loading && !incident) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!incident) {
    return (
      <>
        <title>Incidencia no encontrada</title>
        <div className="space-y-6">
          <Link href="/incidents">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Incidencia no encontrada</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const nextStatusButton = getNextStatusButton();

  return (
    <>
        <title>Incidencia #{incident.id}</title>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/incidents">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Incidencia #{incident.id}
            </h1>
          </div>
        </div>
        <Badge className={`${STATUS_COLORS[incident.status]} text-sm px-3 py-1`}>
          {STATUS_LABELS[incident.status] || incident.status}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{incident.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Descripción</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {incident.description || "Sin descripción"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Asignado a</p>
                  <p className="font-medium">
                    {incident.assignee?.name || "Sin asignar"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Fecha de creación</p>
                  <p className="font-medium">
                    {new Date(incident.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Última actualización</p>
                  <p className="font-medium">
                    {new Date(incident.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canModifyIncidents && incident.status !== "RESOLVED" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={openEditDialog}
                  disabled={isSubmitting}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Incidencia
                </Button>
              )}

              {canReassign(incident.status) && (
                <Button
                  className="w-full"
                  onClick={() => setShowAssignDialog(true)}
                  disabled={isSubmitting}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {incident.status === "OPEN" ? "Asignar Responsable" : "Reasignar Responsable"}
                </Button>
              )}

              {nextStatusButton && incident.status !== "OPEN" && (
                <Button
                  className="w-full"
                  onClick={() => handleChangeStatus(getNextStatus()!)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <nextStatusButton.icon className="h-4 w-4 mr-2" />
                  )}
                  {nextStatusButton.label}
                </Button>
              )}

              {!canModifyIncidents && incident.status !== "RESOLVED" && (
                <p className="text-sm text-gray-500 text-center">
                  No tienes permisos para modificar esta incidencia
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Dialog */}
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
              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleAssign}
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Incidencia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="editTitle">Título *</Label>
              <Input
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Título de la incidencia"
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Descripción</Label>
              <Textarea
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Descripción detallada de la incidencia"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleEditIncident}
                disabled={!editTitle.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>

  );
}

