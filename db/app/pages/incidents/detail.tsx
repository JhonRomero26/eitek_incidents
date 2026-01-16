import { useParams, useLocation } from "wouter";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  AlertCircle, 
  Calendar,
  MessageSquare,
  History,
  Save,
  X,
  ShieldAlert,
  Trash2,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIncident } from "@/presentation/hooks/useIncidents";

function IncidentDetailPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    priority: "MEDIA" as "BAJA" | "MEDIA" | "ALTA",
    status: "OPEN" as "OPEN" | "ASSIGNED" | "RESOLVED",
  });

  const { incident, loading, error, updateIncident, deleteIncident } = useIncident(Number(id));

  // Initialize edit data when incident loads
  if (incident && !editData.title) {
    setEditData({
      title: incident.title,
      description: incident.description,
      priority: incident.priority,
      status: incident.status,
    });
  }

  const handleSave = async () => {
    if (!incident) return;
    await updateIncident(editData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!incident) return;
    if (confirm("¿Estás seguro de eliminar esta incidencia?")) {
      await deleteIncident();
      setLocation("/dashboard/incidents");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{error || "Incidencia no encontrada"}</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    OPEN: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    ASSIGNED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    RESOLVED: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  };

  const statusLabels = {
    OPEN: "Abierta",
    ASSIGNED: "Asignada",
    RESOLVED: "Resuelta",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Top Navigation */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setLocation("/dashboard/incidents")}
            className="rounded-full h-10 w-10 shrink-0 border-gray-200 dark:border-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] font-bold tracking-tighter bg-gray-50 dark:bg-gray-900">INC-{id}</Badge>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {isEditing ? "Editando incidencia" : incident.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="gap-2 text-gray-500 hover:text-gray-900">
                <X className="h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={handleSave} className="gap-2 px-6 shadow-sm">
                <Save className="h-4 w-4" /> Guardar Cambios
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleDelete} className="gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-900/20">
                <Trash2 className="h-4 w-4" /> Eliminar
              </Button>
              <Button onClick={() => setIsEditing(true)} className="gap-2 px-6 shadow-sm">
                Editar Incidencia
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 border-none shadow-sm bg-white dark:bg-gray-900 overflow-visible relative">
            <div className="absolute -top-3 -right-3">
              <Badge className={cn("px-4 py-1.5 shadow-md border-2 border-white dark:border-gray-900 text-xs font-bold", statusColors[incident.status as keyof typeof statusColors])}>
                {statusLabels[incident.status as keyof typeof statusLabels]}
              </Badge>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-gray-400">
                <MessageSquare className="h-4 w-4" />
                <Label className="text-xs uppercase tracking-[0.2em] font-bold">Descripción General</Label>
              </div>
              
              {isEditing ? (
                <textarea 
                  className="w-full min-h-[180px] p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm leading-relaxed"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Describe el problema detalladamente..."
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {incident.description}
                </p>
              )}
            </div>
          </Card>

          {/* Activity Timeline */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <History className="h-5 w-5 text-primary" /> 
                Línea de tiempo
              </h3>
              <Button variant="ghost" size="sm" className="text-xs text-primary hover:bg-primary/5">Añadir nota</Button>
            </div>
            
            <div className="space-y-1 relative ml-4">
              <div className="absolute left-[18px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />
              {[
                { type: 'status', label: 'Estado cambiado a RESOLVED', user: 'Juan Pérez', time: 'Hace 2 horas', iconColor: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
                { type: 'comment', label: 'Reiniciando servidores de producción...', user: 'Juan Pérez', time: 'Hace 3 horas', iconColor: 'text-gray-400', bgColor: 'bg-gray-50 dark:bg-gray-800/50' },
                { type: 'created', label: 'Incidencia creada automáticamente', user: 'Sistema', time: incidentData.createdAt, iconColor: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
              ].map((item, i) => (
                <div key={i} className="group relative pl-12 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 rounded-xl transition-colors">
                  <div className={cn(
                    "absolute left-0 h-9 w-9 rounded-xl border-2 border-white dark:border-gray-900 flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110",
                    item.bgColor
                  )}>
                    {item.type === 'status' && <AlertCircle className={cn("h-4 w-4", item.iconColor)} />}
                    {item.type === 'comment' && <MessageSquare className={cn("h-4 w-4", item.iconColor)} />}
                    {item.type === 'created' && <Calendar className={cn("h-4 w-4", item.iconColor)} />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</span>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <span className="font-medium text-gray-700 dark:text-gray-400">{item.user}</span>
                      <span className="opacity-30">•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-6">
          <Card className="p-6 space-y-8 border-none shadow-sm bg-white dark:bg-gray-900">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Detalles Técnicos</h3>
              
              <div className="space-y-6">
                {/* Assignee Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-gray-400 shrink-0">
                    <User className="h-4 w-4" /> Asignado
                  </div>
                  {isEditing ? (
                    <Input className="h-8 text-xs bg-gray-50 dark:bg-gray-950" value={incident.assigneeName || "Sin asignar"} disabled />
                  ) : (
                    <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-800/50 pl-1 pr-3 py-1 rounded-full border border-gray-100 dark:border-gray-800/50">
                      <Avatar className="h-6 w-6 border border-white dark:border-gray-700">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${incident.assigneeName || "N/A"}`} />
                        <AvatarFallback className="text-[10px]">
                          {incident.assigneeName ? incident.assigneeName.substring(0, 2).toUpperCase() : "NA"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{incident.assigneeName || "Sin asignar"}</span>
                    </div>
                  )}
                </div>

                {/* Priority Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-gray-400 shrink-0">
                    <ShieldAlert className="h-4 w-4" /> Prioridad
                  </div>
                  {isEditing ? (
                    <select
                      value={editData.priority}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value as any })}
                      className="text-xs font-bold rounded-md px-3 py-1 border-2 bg-background"
                    >
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                    </select>
                  ) : (
                    <Badge variant="outline" className={cn(
                      "rounded-md px-3 font-bold text-[10px] tracking-wider uppercase border-2",
                      incident.priority === "ALTA" 
                        ? "border-red-100 text-red-600 bg-red-50/30 dark:border-red-900/40 dark:text-red-400" 
                        : incident.priority === "MEDIA"
                        ? "border-yellow-100 text-yellow-600 bg-yellow-50/30 dark:border-yellow-900/40 dark:text-yellow-400"
                        : "border-blue-100 text-blue-600 bg-blue-50/30 dark:border-blue-900/40 dark:text-blue-400"
                    )}>
                      {incident.priority}
                    </Badge>
                  )}
                </div>

                {/* Status Row */}
                {isEditing && (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-xs font-medium text-gray-400 shrink-0">
                      <AlertCircle className="h-4 w-4" /> Estado
                    </div>
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value as any })}
                      className="text-xs font-bold rounded-md px-3 py-1 border-2 bg-background"
                    >
                      <option value="OPEN">Abierta</option>
                      <option value="ASSIGNED">Asignada</option>
                      <option value="RESOLVED">Resuelta</option>
                    </select>
                  </div>
                )}

                {/* Created Date Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-gray-400 shrink-0">
                    <Calendar className="h-4 w-4" /> Reportado
                  </div>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                    {new Date(incident.createdAt).toLocaleDateString('es-ES', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="space-y-4">
              <Label className="text-[10px] font-black text-gray-300 uppercase tracking-widest pl-1">Zona de control</Label>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-start gap-3 h-10 text-xs font-semibold border-gray-100 dark:border-gray-800 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all">
                  <User className="h-4 w-4 opacity-50" /> Transferir propiedad
                </Button>
                <Button variant="outline" className="justify-start gap-3 h-10 text-xs font-semibold border-gray-100 dark:border-gray-800 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all">
                  <Clock className="h-4 w-4 opacity-50" /> Escalar incidencia
                </Button>
              </div>
            </div>
          </Card>

          {/* Help Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary tracking-tight">Centro de Soporte</p>
                <p className="text-[11px] text-primary/70 leading-relaxed mt-1">Si esta incidencia es crítica y bloquea la operación, contacta con niveles superiores.</p>
              </div>
              <Button size="sm" variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary/10 group-hover:translate-x-1 transition-transform">
                Consultar documentación →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentDetailPage;
