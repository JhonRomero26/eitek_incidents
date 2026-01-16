import { Card } from "@/app/components/ui/card";
import { IncidentTile } from "@/app/components/IncidentTile";

function LastActivity() {
    return (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <IncidentTile
                key={i}
                href={`/dashboard/incidents/${i}`}
                title={`Incidencia Ejemplo ${i}`}
                status={i % 2 === 0 ? "RESOLVED" : "OPEN"}
                dateUpdated={new Date(Date.now() - i * 3600 * 1000)}
              />
            ))}
          </div>
        </Card>
    );
    }

export default LastActivity;