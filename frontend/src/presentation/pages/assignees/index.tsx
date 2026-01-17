import { useState } from "react";
import { useAssignees } from "../../hooks/useAssignees";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "../../../shared/stores/toastStore";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Loader2, Users, Plus, Edit, Trash2, Power, PowerOff, RefreshCw } from "lucide-react";
import type { Assignee } from "../../../core/domain/Assignee";

export default function AssigneesPage() {
  const { assignees, loading, error, createAssignee, updateAssignee, deleteAssignee, activateAssignee, deactivateAssignee, loadAssignees } = useAssignees();
  const { currentUser } = useAuth();

  // Permission check: Only ADMIN can manage assignees
  const isAdmin = currentUser?.role === "ADMIN";

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<Assignee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("OPERATOR");

  const resetForm = () => {
    setFormName("");
    setFormRole("OPERATOR");
    setSelectedAssignee(null);
  };

  const openEditDialog = (assignee: Assignee) => {
    setSelectedAssignee(assignee);
    setFormName(assignee.name);
    setFormRole(assignee.role);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (assignee: Assignee) => {
    setSelectedAssignee(assignee);
    setShowDeleteDialog(true);
  };

  const handleRefresh = async () => {
    toast.info("Actualizando", "Cargando responsables...");
    await loadAssignees();
    toast.success("Actualizado", "Lista de responsables actualizada");
  };

  const handleCreate = async () => {
    if (!formName.trim()) {
      toast.warning("Campo requerido", "El nombre es obligatorio");
      return;
    }

    setIsSubmitting(true);
    try {
      await createAssignee({
        name: formName.trim(),
        role: formRole,
      });
      setShowCreateDialog(false);
      resetForm();
      toast.success("Responsable creado", `${formName.trim()} ha sido registrado correctamente`);
    } catch (err) {
      console.error("Error creating assignee:", err);
      toast.error("Error al crear", err instanceof Error ? err.message : "No se pudo crear el responsable");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedAssignee || !formName.trim()) {
      toast.warning("Campo requerido", "El nombre es obligatorio");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAssignee(selectedAssignee.id, {
        name: formName.trim(),
        role: formRole,
      });
      setShowEditDialog(false);
      resetForm();
      toast.success("Responsable actualizado", "Los cambios se han guardado correctamente");
    } catch (err) {
      console.error("Error updating assignee:", err);
      toast.error("Error al actualizar", err instanceof Error ? err.message : "No se pudo actualizar el responsable");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAssignee || !currentUser) return;

    setIsSubmitting(true);
    try {
      await deleteAssignee(selectedAssignee.id, currentUser.id);
      setShowDeleteDialog(false);
      const deletedName = selectedAssignee.name;
      resetForm();
      toast.success("Responsable eliminado", `${deletedName} ha sido eliminado correctamente`);
    } catch (err) {
      console.error("Error deleting assignee:", err);
      toast.error("Error al eliminar", err instanceof Error ? err.message : "No se pudo eliminar el responsable");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (assignee: Assignee) => {
    setIsSubmitting(true);
    try {
      if (assignee.isActive) {
        await deactivateAssignee(assignee.id);
        toast.success("Responsable desactivado", `${assignee.name} ha sido desactivado`);
      } else {
        await activateAssignee(assignee.id);
        toast.success("Responsable activado", `${assignee.name} ha sido activado`);
      }
    } catch (err) {
      console.error("Error toggling assignee status:", err);
      toast.error("Error al cambiar estado", err instanceof Error ? err.message : "No se pudo cambiar el estado");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ADMIN: "destructive",
      SUPPORT: "default",
      TECHNICAL: "secondary",
      OPERATOR: "outline",
    };
    return variants[role] || "outline";
  };

  if (loading && assignees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500">Cargando responsables...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Responsables
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isAdmin 
              ? "Gestiona los responsables del sistema" 
              : "Lista de responsables disponibles para asignar incidencias"
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          {isAdmin && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Responsable
            </Button>
          )}
        </div>
      </div>

      {!isAdmin && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6">
            <p className="text-yellow-700 dark:text-yellow-400 text-sm">
              Solo los administradores pueden gestionar responsables
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assignees.map((assignee) => (
          <Card key={assignee.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{assignee.name}</CardTitle>
                </div>
                <Badge variant={getRoleBadgeVariant(assignee.role)}>
                  {assignee.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500">Estado:</span>
                <span className={assignee.isActive ? "text-green-600" : "text-red-600"}>
                  {assignee.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(assignee)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(assignee)}
                    disabled={isSubmitting}
                    title={assignee.isActive ? "Desactivar" : "Activar"}
                  >
                    {assignee.isActive ? (
                      <PowerOff className="h-4 w-4 text-red-500" />
                    ) : (
                      <Power className="h-4 w-4 text-green-500" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(assignee)}
                    disabled={isSubmitting}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {assignees.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay responsables registrados</p>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Responsable</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nombre del responsable"
              />
            </div>
            <div>
              <Label htmlFor="role">Rol *</Label>
              <Select
                id="role"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
              >
                <option value="ADMIN">Administrador</option>
                <option value="SUPPORT">Soporte</option>
                <option value="TECHNICAL">Técnico</option>
                <option value="OPERATOR">Operador</option>
                <option value="USER">Usuario</option>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={!formName.trim() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear"
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
            <DialogTitle>Editar Responsable</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-name">Nombre *</Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nombre del responsable"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Rol *</Label>
              <Select
                id="edit-role"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
              >
                <option value="ADMIN">Administrador</option>
                <option value="SUPPORT">Soporte</option>
                <option value="TECHNICAL">Técnico</option>
                <option value="OPERATOR">Operador</option>
                <option value="USER">Usuario</option>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); }}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} disabled={!formName.trim() || isSubmitting}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar a <strong>{selectedAssignee?.name}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowDeleteDialog(false); resetForm(); }}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
