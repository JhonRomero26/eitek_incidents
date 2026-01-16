import LastActivity from "@/app/components/dashboard/LastActivity";
import { IncidentTile } from "@/app/components/IncidentTile";
import { Card } from "@/app/components/ui/card";
import { AlertCircle, Users, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useIncidents, useIncidentsByStatus } from "@/presentation/hooks/useIncidents";
import { Link } from "wouter";

export default function DashboardPage() {
  const { incidents, loading: allLoading } = useIncidents();
  const { incidents: openIncidents, loading: openLoading } = useIncidentsByStatus("OPEN");
  const { incidents: resolvedIncidents, loading: resolvedLoading } = useIncidentsByStatus("RESOLVED");

  const stats = [
    {
      title: "Total Incidencias",
      value: allLoading ? "..." : incidents.length.toString(),
      icon: AlertCircle,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Abiertas",
      value: openLoading ? "..." : openIncidents.length.toString(),
      icon: Clock,
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Resueltas",
      value: resolvedLoading ? "..." : resolvedIncidents.length.toString(),
      icon: CheckCircle,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Usuarios Activos",
      value: "12",
      icon: Users,
      trend: "+2%",
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Bienvenido al sistema de gestión de incidencias
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {stat.trend} vs último mes
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LastActivity />

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Incidencias Abiertas
            </h3>
            <Link href="/dashboard/incidents">
              <span className="text-xs text-primary hover:underline cursor-pointer">Ver todas</span>
            </Link>
          </div>
          {openLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : openIncidents.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No hay incidencias abiertas
            </p>
          ) : (
            <div className="space-y-3">
              {openIncidents.slice(0, 3).map((incident) => (
                <Link key={incident.id} href={`/dashboard/incidents/${incident.id}`}>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {incident.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Prioridad: {incident.priority}
                      </p>
                    </div>
                    <AlertCircle
                      className={`h-5 w-5 ${
                        incident.priority === "ALTA"
                          ? "text-red-500"
                          : incident.priority === "MEDIA"
                          ? "text-yellow-500"
                          : "text-blue-500"
                      }`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
                      : item.priority === "Media"
                      ? "text-yellow-500"
                      : "text-blue-500"
                  }`}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
