import { Link } from "wouter";
import { Badge } from "@/app/components/ui/badge";
import { Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface IncidentTileProps {
  title: string;
  status: string;
  assignee?: string;
  href: string;
  dateUpdated: Date;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  OPEN: { color: "bg-red-500/10 border-red-500 text-red-500", label: "Abierta" },
  ASSIGNED: { color: "bg-blue-500/10 border-blue-500 text-blue-500", label: "Asignada" },
  IN_PROGRESS: { color: "bg-yellow-500/10 border-yellow-500 text-yellow-500", label: "En curso" },
  RESOLVED: { color: "bg-green-500/10 border-green-500 text-green-500", label: "Resuelta" },
  CANCELED: { color: "bg-gray-500/10 border-gray-500 text-gray-500", label: "Cancelada" },
  CLOSED: { color: "bg-purple-500/10 border-purple-500 text-purple-500", label: "Cerrada" },
};

export function IncidentTile({
  title,
  status,
  assignee,
  href,
  dateUpdated,
}: IncidentTileProps) {
  const config = statusConfig[status] || statusConfig.OPEN;

  // Cálculo del tiempo transcurrido (simplificado)
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - dateUpdated.getTime()) / (1000 * 60 * 60)
  );
  
  const timeText = diffInHours <= 0 
    ? "Reciente" 
    : `Hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;

  return (
    <Link className="group block rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary/50 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary/50" href={href}>
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-gray-900 decoration-primary/30 underline-offset-4 group-hover:underline dark:text-white">
                {title}
              </p>
              <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", config.color)}>
                {config.label}
              </Badge>
            </div>

            <div className="flex flex-col gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{assignee || "Sin asignar"}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{timeText}</span>
              </div>
            </div>
          </div>
        </div>
    </Link>
  );
}
